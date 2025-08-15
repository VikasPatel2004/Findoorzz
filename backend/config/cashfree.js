const { Cashfree } = require('cashfree-pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Initialize Cashfree credentials and environment
const initializeCashfree = () => {
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const environment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';

  if (!appId || !secretKey) {
    console.error('❌ Missing Cashfree credentials in .env');
    console.error('❌ Required: CASHFREE_APP_ID and CASHFREE_SECRET_KEY');
    return false;
  }

  const isValidAppId = appId.length > 10;
  const isValidSecretKey = secretKey.length > 20;

  if (!isValidAppId || !isValidSecretKey) {
    console.error('❌ Invalid Cashfree credentials format');
    console.log('❌ App ID length:', appId?.length, 'Secret Key length:', secretKey?.length);
    return false;
  }

  // Initialize Cashfree v5.x properly
  // Also set environment variables recognized by SDK
  process.env.CF_CLIENT_ID = appId;
  process.env.CF_CLIENT_SECRET = secretKey;
  process.env.CF_ENVIRONMENT = environment;

  Cashfree.XClientId = appId;
  Cashfree.XClientSecret = secretKey;
  Cashfree.XEnvironment = environment;

  const maskedId = appId ? appId.slice(0, 4) + '...' + appId.slice(-4) : 'N/A';
  console.log(`✅ Cashfree configured for ${environment} environment (App ID: ${maskedId})`);
  console.log(`✅ CF env vars set: ${!!process.env.CF_CLIENT_ID && !!process.env.CF_CLIENT_SECRET}`);
  return true;
};

// Initialize once at startup
const isInitialized = initializeCashfree();

// Centralized error-handling wrapper
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

// Create a single Cashfree instance for the application
const cashfreeInstance = isInitialized ? new Cashfree() : null;

// Export methods that use the instance
const createPaymentOrder = async (version, order) => {
  if (!cashfreeInstance) {
    throw new Error('Cashfree not properly initialized');
  }
  return await cashfreeInstance.PGCreateOrder(version, order);
};

const fetchPayments = async (version, orderId) => {
  if (!cashfreeInstance) {
    throw new Error('Cashfree not properly initialized');
  }
  return await cashfreeInstance.PGOrderFetchPayments(version, orderId);
};

module.exports = {
  Cashfree,
  isInitialized,
  initializeCashfree,
  createPaymentOrder,
  fetchPayments
};
