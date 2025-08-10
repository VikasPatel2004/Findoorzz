const dotenv = require('dotenv');
const { Cashfree } = require('cashfree-pg');

dotenv.config();

console.log('\n=== Testing Different Cashfree v5 Initialization Methods ===\n');

// Method 1: Set on class directly
console.log('Method 1: Setting on Cashfree class...');
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';

console.log('Class properties after setting:');
console.log('Cashfree.XClientId:', Cashfree.XClientId);
console.log('Cashfree.XEnvironment:', Cashfree.XEnvironment);

// Method 2: Create instance with config object
console.log('\nMethod 2: Creating instance with config...');
const cashfree = new Cashfree();

// Method 3: Alternative - Set environment variables
console.log('\nMethod 3: Setting CF_ environment variables...');
process.env.CF_CLIENT_ID = process.env.CASHFREE_APP_ID;
process.env.CF_CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY;
process.env.CF_ENVIRONMENT = process.env.CASHFREE_ENVIRONMENT;

console.log('Testing Cashfree configuration...');
console.log('App ID:', process.env.CASHFREE_APP_ID);
console.log('App ID Length:', process.env.CASHFREE_APP_ID?.length);
console.log('Secret Key:', process.env.CASHFREE_SECRET_KEY?.substring(0, 20) + '...');
console.log('Secret Key Length:', process.env.CASHFREE_SECRET_KEY?.length);
console.log('Environment:', process.env.CASHFREE_ENVIRONMENT);
console.log('Cashfree config:', {
    XClientId: cashfree.XClientId || 'Not Set',
    XEnvironment: cashfree.XEnvironment || 'Not Set',
    secretExists: !!cashfree.XClientSecret
});

async function testCashfreePayment() {
    try {
        const order = {
            order_amount: 100.00,
            order_currency: "INR",
            order_id: `test_order_${Date.now()}`,
            customer_details: {
                customer_id: "test_customer_123",
                customer_email: "test@example.com",
                customer_phone: "9999999999"
            },
            order_meta: {
                return_url: "http://localhost:3000/payment-status/{order_id}"
            },
            order_note: "Test payment"
        };

        console.log('Creating test order with data:', JSON.stringify(order, null, 2));
        
        // v5.x correct method - same as backend
        const payment = await cashfree.PGCreateOrder("2023-08-01", order);
        
        console.log('✅ Test payment created successfully!');
        console.log('Response:', payment);
        
    } catch (error) {
        console.error('❌ Test payment failed:');
        console.error('Error message:', error.message);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        // Also try alternative API patterns
        try {
            console.log('\nTrying alternative import pattern...');
            const { PGCreateOrder } = require('cashfree-pg');
            
            // Set environment variables directly
            process.env.CF_CLIENT_ID = process.env.CASHFREE_APP_ID;
            process.env.CF_CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY;
            process.env.CF_ENVIRONMENT = process.env.CASHFREE_ENVIRONMENT;
            
            const altPayment = await PGCreateOrder("2023-08-01", order);
            console.log('✅ Alternative method successful!');
            console.log('Alt Response:', altPayment);
        } catch (altError) {
            console.error('❌ Alternative method also failed:', altError.message);
        }
    }
}

testCashfreePayment();
