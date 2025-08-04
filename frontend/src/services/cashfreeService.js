import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Load Cashfree SDK
const loadCashfreeSDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Cashfree) {
      resolve();
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree-checkout.js';
      script.crossOrigin = 'anonymous'; // Add cross-origin attribute
      script.onload = () => {
        console.log('Cashfree SDK loaded successfully');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Cashfree SDK:', error);
        // Resolve anyway to prevent blocking the payment flow
        // The application should handle the absence of the SDK gracefully
        resolve();
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Cashfree SDK:', error);
      // Resolve anyway to prevent blocking the payment flow
      resolve();
    }
  });
};

const cashfreeService = {
  processPayment: async (listingId, amount, description, userDetails, token, onSuccess, onFailure) => {
    try {
      console.log('🔁 Starting Cashfree payment process...');

      if (!token || typeof token !== 'string') {
        throw new Error('❌ Missing or invalid authentication token');
      }

      try {
        await loadCashfreeSDK();
        console.log('Cashfree SDK loaded or already available');
      } catch (error) {
        console.warn('Proceeding without Cashfree SDK:', error);
        // Continue with the payment process even if SDK loading fails
      }

      // Sanitize and verify required fields
      if (!listingId || !amount) {
        throw new Error('❌ Incomplete payment details: Missing listing ID or amount');
      }
      
      // Check for user ID (could be either id or _id)
      const userId = userDetails?.id || userDetails?._id;
      
      // Log the user details for debugging
      console.log('User details received:', userDetails);
      console.log('User ID extracted:', userId);
      console.log('User ID type:', typeof userId);
      
      // Normalize the userDetails object to ensure id is correctly set
      const normalizedUserDetails = {
        ...userDetails,
        id: userId.toString() // Ensure id is set correctly using the extracted userId as a string
      };
      
      console.log('Normalized user details for API call:', normalizedUserDetails);
      
      if (!userId || !userDetails?.email) {
        // Log the missing details for debugging
        console.error('Missing user details:', { 
          hasId: !!userId, 
          hasEmail: !!userDetails?.email,
          userDetails
        });
        throw new Error('❌ Incomplete payment details: Missing user information');
      }
      
      if (!userDetails?.phone) {
        throw new Error('❌ Phone number is required for payment processing. Please update your profile with a valid phone number.');
      }
      
      console.log('Sending payment request with user details:', normalizedUserDetails);
      
      console.log('Sending API request with normalized user details:', {
        bookingId: listingId,
        amount,
        description,
        userDetails: normalizedUserDetails
      });
      
      const response = await axios.post(`${API_BASE_URL}/cashfree/create-payment`, {
        bookingId: listingId,
        amount,
        description,
        userDetails: normalizedUserDetails
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const { payment_session_id, orderId } = response.data;

      if (!payment_session_id) {
        throw new Error('❌ Failed to receive payment_session_id from server');
      }

      // Initialize Cashfree SDK and redirect
      if (window.Cashfree) {
        try {
          console.log('Initializing Cashfree with session ID:', payment_session_id);
          const cashfree = new window.Cashfree(payment_session_id);
          cashfree.redirect();
        } catch (sdkError) {
          console.error('Error initializing Cashfree SDK:', sdkError);
          // Fallback: Redirect to payment page directly
          window.location.href = `${process.env.VITE_CASHFREE_PAYMENT_URL || 'https://payments.cashfree.com/order'}/${payment_session_id}`;
        }
      } else {
        console.warn('Cashfree SDK not available, using direct redirect');
        // Fallback: Redirect to payment page directly
        window.location.href = `${process.env.VITE_CASHFREE_PAYMENT_URL || 'https://payments.cashfree.com/order'}/${payment_session_id}`;
      }

      if (onSuccess) {
        onSuccess({ orderId, payment_session_id });
      }

    } catch (error) {
      console.error('🚨 Cashfree Payment Error:', error);

      let errorMessage = 'Payment processing failed';
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data.error?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error: No response from server';
      } else {
        errorMessage = error.message || 'Unknown payment error';
      }

      if (onFailure) {
        onFailure(new Error(errorMessage));
      }
    }
  },

  verifyPayment: async (orderId, bookingData, token) => {
    try {
      if (!orderId || !token) {
        throw new Error('❌ Missing orderId or token for payment verification');
      }

      const response = await axios.post(`${API_BASE_URL}/cashfree/verify-payment`,
        { orderId, bookingData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

      return response.data;

    } catch (error) {
      console.error('🚨 Cashfree Verification Error:', error);

      let errorMessage = 'Payment verification failed';
      if (error.response?.data) {
        errorMessage = error.response.data.message || `Verification error: ${error.response.status}`;
      }

      throw new Error(errorMessage);
    }
  },

  checkPaymentStatus: async (orderId, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cashfree/payment-status/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;

    } catch (error) {
      console.error('🚨 Error checking payment status:', error);
      throw new Error(error.message || 'Failed to check payment status');
    }
  }
};

export default cashfreeService;