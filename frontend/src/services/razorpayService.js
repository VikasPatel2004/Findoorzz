import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Initialize Razorpay
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });
};

// Create order
async function createOrder(bookingId, amount, description, token) {
  const response = await axios.post(`${API_BASE_URL}/razorpay/create-order`, {
    bookingId,
    amount,
    description
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// Verify payment
async function verifyPayment(paymentData, token) {
  const response = await axios.post(`${API_BASE_URL}/razorpay/verify-payment`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// Get payment status
async function getPaymentStatus(paymentId, token) {
  const response = await axios.get(`${API_BASE_URL}/razorpay/payment-status/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

// Process payment
async function processPayment(bookingId, amount, description, userData, token) {
  try {
    // Create order
    const orderData = await createOrder(bookingId, amount, description, token);
    
    // Load Razorpay
    const Razorpay = await loadRazorpay();
    if (!Razorpay) {
      throw new Error('Failed to load Razorpay');
    }

    // Configure payment options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'FinDoorz',
      description: description,
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Verify payment
          const verificationData = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }, token);

          return {
            success: true,
            payment: verificationData.payment,
            message: 'Payment successful!'
          };
        } catch (error) {
          return {
            success: false,
            message: 'Payment verification failed'
          };
        }
      },
      prefill: {
        name: userData.name,
        email: userData.email,
        contact: userData.phone || ''
      },
      theme: {
        color: '#1f2937'
      },
      modal: {
        ondismiss: function() {
          return {
            success: false,
            message: 'Payment cancelled'
          };
        }
      }
    };

    // Open payment modal
    const paymentObject = new Razorpay(options);
    paymentObject.open();

    return new Promise((resolve) => {
      paymentObject.on('payment.failed', function (response) {
        resolve({
          success: false,
          message: 'Payment failed',
          error: response.error
        });
      });
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}

export default {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  processPayment,
  loadRazorpay
}; 