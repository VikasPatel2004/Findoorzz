const express = require('express');
const router = express.Router();
const { Cashfree, isInitialized, createPaymentOrder, fetchPayments } = require('../config/cashfree');
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        route: '/api/cashfree',
        timestamp: new Date().toISOString(),
        initialized: isInitialized 
    });
});

// Create Cashfree payment
router.post('/create-payment', authMiddleware, async (req, res) => {
    try {
        console.log('=== Cashfree Create Payment Request ===');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('User ID:', req.user?.id);

        if (!isInitialized) {
            console.error('Cashfree not initialized');
            return res.status(500).json({
                message: 'Payment service not properly configured',
                error: 'Cashfree not initialized'
            });
        }

        const { bookingId, amount, description, userDetails } = req.body;

        if (!bookingId || !amount || !userDetails) {
            console.error('Missing required fields:', { bookingId, amount, userDetails });
            return res.status(400).json({ 
                message: 'Missing required fields',
                fields: ['bookingId', 'amount', 'userDetails']
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ 
                message: 'Invalid amount',
                amount: amount 
            });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('User not found:', req.user.id);
            return res.status(404).json({ 
                message: 'User not found'
            });
        }

        console.log('User verification status:', user.verificationStatus);

        if (user.verificationStatus === 'pending' || user.verificationStatus === 'under_review') {
            return res.status(403).json({ 
                message: 'Account verification required. Please complete your profile verification.',
                verificationStatus: user.verificationStatus
            });
        }

        const order = {
            order_amount: parsedAmount,
            order_currency: "INR",
            order_id: `order_${bookingId}_${Date.now()}`,
            customer_details: {
                customer_id: (userDetails.id || userDetails._id || req.user.id).toString(),
                customer_email: userDetails.email || user.email,
                customer_phone: (userDetails.phone || user.phone || '9999999999').toString()
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-status/{order_id}`
            },
            order_note: description || 'Property booking payment'
        };

        console.log('Creating Cashfree order:', order);

        // Use the centralized payment creation method
        const payment = await createPaymentOrder("2023-08-01", order);
        
        console.log('Cashfree response:', payment);

        res.json({
            success: true,
            payment_session_id: payment.data.payment_session_id,
            orderId: order.order_id,
            message: 'Payment order created successfully'
        });

    } catch (error) {
        console.error('Payment error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        if (error.response?.status === 401) {
            res.status(401).json({ 
                message: 'Invalid Cashfree credentials',
                error: error.response.data
            });
        } else if (error.response?.status === 400) {
            res.status(400).json({ 
                message: error.response.data?.message || 'Invalid payment data',
                error: error.response.data
            });
        } else {
            res.status(500).json({ 
                message: 'Payment processing failed',
                error: error.message
            });
        }
    }
});

// Verify Cashfree payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
        console.log('=== Cashfree Verify Payment Request ===');
        console.log('Body:', req.body);

        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                message: 'Missing orderId' 
            });
        }

        // Use the centralized payment fetch method
        const payment = await fetchPayments("2023-08-01", orderId);

        if (!payment.data || payment.data.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No payment found' 
            });
        }

        const paymentData = payment.data[0];
        
        if (paymentData.payment_status === 'SUCCESS') {
            const bookingId = orderId.split('_')[1];
            
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId, 
                { 
                    status: 'confirmed',
                    paymentStatus: 'completed',
                    paymentId: paymentData.cf_payment_id,
                    orderId: orderId
                },
                { new: true }
            );

            console.log('Payment verified successfully:', paymentData);

            res.json({ 
                success: true, 
                message: 'Payment successful',
                payment: paymentData,
                booking: updatedBooking
            });
        } else {
            res.json({ 
                success: false, 
                message: `Payment ${paymentData.payment_status}`,
                payment: paymentData
            });
        }

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ 
            message: 'Payment verification failed',
            error: error.message 
        });
    }
});

// Redirect endpoint for frontend
router.get('/redirect/:paymentSessionId', (req, res) => {
    const { paymentSessionId } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-status/${paymentSessionId}`);
});

// Payment status endpoint for polling
router.get('/payment-status/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: 'Missing orderId' });
        }

        const payment = await fetchPayments("2023-08-01", orderId);
        if (!payment.data || payment.data.length === 0) {
            return res.status(404).json({ success: false, message: 'No payment found' });
        }

        const paymentData = payment.data[0];
        let booking = null;

        // Extract booking ID if present in our order_id format: order_<bookingId>_<timestamp>
        const parts = orderId.split('_');
        if (parts.length >= 3) {
            const bookingId = parts[1];
            try {
                booking = await Booking.findById(bookingId);
            } catch (e) {
                // ignore lookup errors
            }
        }

        return res.json({
            success: paymentData.payment_status === 'SUCCESS',
            payment: paymentData,
            booking
        });

    } catch (error) {
        console.error('Payment status error:', error);
        return res.status(500).json({ 
            message: 'Failed to fetch payment status', 
            error: error.message 
        });
    }
});

module.exports = router;