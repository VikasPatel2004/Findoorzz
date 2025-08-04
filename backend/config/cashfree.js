const { Cashfree } = require('cashfree-pg');

if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
  console.error('❌ Missing Cashfree credentials in .env');
}

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX';

Cashfree.PGCreateOrder = async (version, order) => {
  try {
    console.log('[Cashfree] Creating order with payload:', order);
    const response = await Cashfree.__proto__.PGCreateOrder.call(Cashfree, version, order);
    console.log('[Cashfree] Order created:', response.data.order_id);
    return response;
  } catch (err) {
    console.error('[Cashfree] Order creation failed:', err.response?.data || err.message);
    throw err;
  }
};

Cashfree.PGOrderFetchPayments = async (version, orderId) => {
  try {
    console.log('[Cashfree] Fetching payment for order:', orderId);
    const response = await Cashfree.__proto__.PGOrderFetchPayments.call(Cashfree, version, orderId);
    return response;
  } catch (err) {
    console.error('[Cashfree] Payment fetch failed:', err.response?.data || err.message);
    throw err;
  }
};

module.exports = { Cashfree };