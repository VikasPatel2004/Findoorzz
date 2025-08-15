import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Load Cashfree SDK
const loadCashfreeSDK = () => {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve();
      return;
    }

    try {
      const script = document.createElement('script');
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree-checkout.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('Cashfree SDK loaded successfully');
        resolve();
      };
      script.onerror = (error) => {
        console.error('Failed to load Cashfree SDK:', error);
        resolve(); // Resolve anyway to prevent blocking
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Cashfree SDK:', error);
      resolve();
    }
  });
};

const cashfreeService = {
  processPayment: async (listingId, amount, description, userDetails, token, onSuccess, onFailure) => {
  try {
    // Step 1: Create order with backend
    const response = await axios.post(`${API_BASE_URL}/cashfree/create-payment`, {
      bookingId: listingId,
      amount,
      description,
      userDetails
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const { payment_session_id } = response.data;

    // Step 2: Redirect to Cashfree using payment session (always via URL)
    const checkoutBase = import.meta.env.VITE_CASHFREE_PAYMENT_URL || 'https://payments.cashfree.com/order';
    window.location.href = `${checkoutBase}/#${payment_session_id}`;

  } catch (error) {
    console.error('Payment error:', error);
    onFailure(error);
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