const express = require('express');
const router = express.Router();
const { Cashfree, isInitialized } = require('../config/cashfree');
const Booking = require('../models/Booking');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Create Cashfree payment
router.post('/create-payment', authMiddleware, async (req, res) => {
    try {
        if (!isInitialized) {
            return res.status(500).json({
                message: 'Payment service not properly configured',
                error: 'Cashfree not initialized'
            });
        }

        const { bookingId, amount, description, userDetails } = req.body;

        // Basic validation
        if (!bookingId || !amount || !userDetails) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                fields: ['bookingId', 'amount', 'userDetails']
            });
        }

        // Check user account status
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                message: 'User not found'
            });
        }

        if (user.verificationStatus === 'pending' || user.verificationStatus === 'under_review') {
            return res.status(403).json({ 
                message: 'Account verification required. Please complete your profile verification.',
                verificationStatus: user.verificationStatus
            });
        }

        const order = {
            order_amount: parseFloat(amount),
            order_currency: "INR",
            order_id: `order_${bookingId}_${Date.now()}`,
            customer_details: {
                customer_id: (userDetails.id || userDetails._id).toString(),
                customer_email: userDetails.email,
                customer_phone: userDetails.phone.toString()
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-status/{order_id}`
            },
            order_note: description || 'Property booking payment'
        };

        const payment = await Cashfree.PGCreateOrder("2023-08-01", order);
        
        res.json({
            success: true,
            payment_session_id: payment.data.payment_session_id,
            orderId: order.order_id
        });

    } catch (error) {
        console.error('Payment error:', error);
        
        if (error.response?.status === 401) {
            res.status(401).json({ 
                message: 'Invalid Cashfree credentials'
            });
        } else if (error.response?.status === 400) {
            res.status(400).json({ 
                message: error.response.data?.message || 'Invalid payment data'
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
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                message: 'Missing orderId' 
            });
        }

        const payment = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

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

            res.json({ 
                success: true, 
                message: 'Payment successful',
                payment: paymentData
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

module.exports = router;
