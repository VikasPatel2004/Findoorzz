const { Cashfree } = require('cashfree-pg');

// Enhanced configuration with better error handling
const initializeCashfree = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const environment = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'SANDBOX';

  if (!appId || !secretKey) {
    console.error('❌ Missing Cashfree credentials in .env');
    console.error('❌ Required: CASHFREE_APP_ID and CASHFREE_SECRET_KEY');
    return false;
  }

  // Validate credentials format
  const isValidAppId = appId.length > 10;
  const isValidSecretKey = secretKey.length > 20;

  if (!isValidAppId || !isValidSecretKey) {
    console.error('❌ Invalid Cashfree credentials format');
    return false;
  }

  Cashfree.XClientId = appId;
  Cashfree.XClientSecret = secretKey;
  Cashfree.XEnvironment = environment;

  console.log(`✅ Cashfree configured for ${environment} environment`);
  return true;
};

// Initialize Cashfree
const isInitialized = initializeCashfree();

// Enhanced error handling wrapper
const safeCashfreeCall = async (method, ...args) => {
  try {
    if (!isInitialized) {
      throw new Error('Cashfree not properly initialized');
    }

    console.log(`[Cashfree] Calling ${method} with args:`, args);
    const result = await Cashfree[method](...args);

    if (result.status === 'ERROR') {
      throw new Error(result.message || 'Cashfree API error');
    }

    return result;
  } catch (error) {
    console.error(`[Cashfree] Error in ${method}:`, {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Invalid Cashfree credentials. Please check your API keys.');
    }

    if (error.response?.status === 400) {
      throw new Error(`Payment validation failed: ${error.response.data?.message || 'Invalid request data'}`);
    }

    if (error.response?.status === 500) {
      throw new Error('Cashfree server error. Please try again later.');
    }

    throw error;
  }
};

// Enhanced order creation with better error handling
Cashfree.PGCreateOrder = async (version, order) => {
  return safeCashfreeCall('PGCreateOrder', version, order);
};

// Enhanced payment verification
Cashfree.PGOrderFetchPayments = async (version, orderId) => {
  return safeCashfreeCall('PGOrderFetchPayments', version, orderId);
};

module.exports = { 
  Cashfree, 
  isInitialized,
  initializeCashfree 
};
