require('dotenv').config();
const { Cashfree } = require('cashfree-pg');

console.log('=== Cashfree Authentication Debug ===\n');

// Check environment variables
console.log('Environment Variables:');
console.log('CASHFREE_APP_ID:', process.env.CASHFREE_APP_ID);
console.log('CASHFREE_SECRET_KEY:', process.env.CASHFREE_SECRET_KEY ? 'SET (length: ' + process.env.CASHFREE_SECRET_KEY.length + ')' : 'NOT SET');
console.log('CASHFREE_ENVIRONMENT:', process.env.CASHFREE_ENVIRONMENT);

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';

console.log('\nCashfree Class Properties:');
console.log('Cashfree.XClientId:', Cashfree.XClientId);
console.log('Cashfree.XClientSecret:', Cashfree.XClientSecret ? 'SET' : 'NOT SET');
console.log('Cashfree.XEnvironment:', Cashfree.XEnvironment);

// Create instance
const cashfree = new Cashfree();

console.log('\nCashfree Instance Properties:');
console.log('Instance type:', typeof cashfree);
console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(cashfree)).filter(name => name.startsWith('PG')));

// Test with minimal order
async function testMinimalOrder() {
    try {
        console.log('\n=== Testing Minimal Order ===');
        
        const minimalOrder = {
            order_amount: 1.00,
            order_currency: "INR",
            order_id: `test_${Date.now()}`,
            customer_details: {
                customer_id: "test_123",
                customer_email: "test@test.com",
                customer_phone: "9999999999"
            }
        };
        
        console.log('Order data:', JSON.stringify(minimalOrder, null, 2));
        
        const result = await cashfree.PGCreateOrder("2022-09-01", minimalOrder);
        
        console.log('✅ Success!', result);
        
    } catch (error) {
        console.log('❌ Error details:');
        console.log('Message:', error.message);
        console.log('Status:', error.response?.status);
        console.log('Headers:', error.response?.headers);
        console.log('Request config:', error.config?.headers);
        console.log('Full response data:', JSON.stringify(error.response?.data, null, 2));
    }
}

testMinimalOrder();
