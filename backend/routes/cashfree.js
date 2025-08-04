const express = require('express');
const router = express.Router();
const { Cashfree } = require('../config/cashfree');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// Create Cashfree payment
router.post('/create-payment', authMiddleware, async (req, res) => {
    try {
        const { bookingId, amount, description, userDetails } = req.body;

        // Validate required fields
        if (!bookingId || !amount || !userDetails) {
            return res.status(400).json({ 
                message: 'Missing required fields: bookingId, amount, or userDetails' 
            });
        }

        // Validate user details
        if (!userDetails.id || !userDetails.email || !userDetails.phone) {
            return res.status(400).json({ 
                message: 'Missing required user details: id, email, or phone' 
            });
        }

        const order = {
            order_amount: parseFloat(amount),
            order_currency: "INR",
            order_id: `order_${bookingId}_${Date.now()}`,
            customer_details: {
                customer_id: userDetails.id.toString(),
                customer_email: userDetails.email,
                customer_phone: userDetails.phone.toString()
            },
            order_meta: {
                return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment-status/{order_id}`
            },
            order_note: description || 'Property booking payment'
        };

        console.log('Creating Cashfree order:', order);

        const payment = await Cashfree.PGCreateOrder("2023-08-01", order);
        
        res.json({
            success: true,
            payment_session_id: payment.data.payment_session_id,
            orderId: order.order_id,
            order_amount: payment.data.order_amount,
            order_currency: payment.data.order_currency
        });

    } catch (error) {
        console.error('Error creating Cashfree payment:', error);
        
        if (error.response) {
            // Cashfree API error
            res.status(error.response.status || 500).json({ 
                message: error.response.data?.message || 'Failed to create payment',
                error: error.response.data 
            });
        } else {
            // Other errors
            res.status(500).json({ 
                message: 'Failed to create payment',
                error: error.message 
            });
        }
    }
});

// Verify Cashfree payment
router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
        const { orderId, bookingData } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                message: 'Missing required parameter: orderId' 
            });
        }

        console.log('Verifying payment for order:', orderId);

        const payment = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        if (!payment.data || payment.data.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No payment found for this order' 
            });
        }

        const paymentData = payment.data[0];
        
        if (paymentData.payment_status === 'SUCCESS') {
            // Extract booking ID from order ID
            const bookingId = orderId.split('_')[1];
            
            // Update booking status
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

            if (!updatedBooking) {
                console.error('Booking not found:', bookingId);
                return res.status(404).json({ 
                    success: false, 
                    message: 'Booking not found' 
                });
            }

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
        console.error('Error verifying Cashfree payment:', error);
        
        if (error.response) {
            res.status(error.response.status || 500).json({ 
                message: error.response.data?.message || 'Failed to verify payment',
                error: error.response.data 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to verify payment',
                error: error.message 
            });
        }
    }
});

// Get payment status
router.get('/payment-status/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({ 
                message: 'Missing required parameter: orderId' 
            });
        }

        const payment = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        if (!payment.data || payment.data.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No payment found for this order' 
            });
        }

        res.json({
            success: true,
            payment: payment.data[0]
        });

    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ 
            message: 'Failed to fetch payment status',
            error: error.message 
        });
    }
});

module.exports = router;
