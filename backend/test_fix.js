require('dotenv').config();
const { createPaymentOrder, isInitialized } = require('./config/cashfree');

console.log('🧪 Testing Cashfree Fix...');
console.log('Initialization status:', isInitialized);

if (!isInitialized) {
    console.error('❌ Cashfree not initialized. Check your .env file.');
    process.exit(1);
}

async function testFix() {
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

        console.log('Creating test order:', order.order_id);
        // Try with latest API version
        const payment = await createPaymentOrder("2022-09-01", order);
        
        console.log('✅ Payment created successfully!');
        console.log('Payment Session ID:', payment.data?.payment_session_id);
        
    } catch (error) {
        console.error('❌ Test failed:');
        console.error('Message:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testFix();
