import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const loadRazorpay = () =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(window.Razorpay);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => resolve(null);
    document.body.appendChild(script);
  });

const createOrder = async (bookingId, amount, token, description) => {
  const { data } = await axios.post(
    `${API}/razorpay/create-order`,
    { bookingId, amount, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data; // { success, orderId, amount, currency, key }
};

const verifyPayment = async (payload, token) => {
  const { data } = await axios.post(
    `${API}/razorpay/verify-payment`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

const processPayment = async (bookingId, amount, description, userDetails, token, onSuccess, onFailure) => {
  const { orderId, amount: amt, currency, key } = await createOrder(bookingId, amount, token, description);

  const Razorpay = await loadRazorpay();
  if (!Razorpay) throw new Error('Failed to load Razorpay');

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: amt,
      currency,
      name: 'FinDoorz',
      description: description || 'Property booking payment',
      order_id: orderId,
      prefill: {
        name: userDetails?.name || '',
        email: userDetails?.email || '',
        contact: userDetails?.phone || ''
      },
      theme: { color: '#2563eb' },
      handler: async function (response) {
        try {
          const result = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          }, token);
          if (typeof onSuccess === 'function') onSuccess(result);
          resolve(result);
        } catch (err) {
          if (typeof onFailure === 'function') onFailure(err);
          reject(err);
        }
      },
      modal: {
        ondismiss: function () {
          const err = new Error('Payment popup closed');
          if (typeof onFailure === 'function') onFailure(err);
          reject(err);
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  });
};

export default { processPayment, verifyPayment };
