const express = require('express');
const crypto = require('crypto');
const authenticateToken = require('../middleware/authMiddleware');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendPaymentConfirmation } = require('../config/email');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create Razorpay order
router.post('/create-order',
  authenticateToken,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { bookingId, amount, description } = req.body;
      const userId = req.user.userId;

      // Verify booking exists and belongs to user
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.user.toString() !== userId) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Create Razorpay order
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          bookingId: bookingId,
          userId: userId
        }
      };

      const order = await razorpay.orders.create(options);

      // Create payment record
      const payment = new Payment({
        booking: bookingId,
        user: userId,
        amount: amount,
        currency: 'INR',
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        razorpayOrderId: order.id,
        description: description || 'Property booking payment',
        receipt: order.receipt
      });

      await payment.save();

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        paymentId: payment._id
      });

    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  }
);

// Verify payment
router.post('/verify-payment',
  authenticateToken,
  [
    body('razorpayOrderId').notEmpty().withMessage('Order ID is required'),
    body('razorpayPaymentId').notEmpty().withMessage('Payment ID is required'),
    body('razorpaySignature').notEmpty().withMessage('Signature is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const userId = req.user.userId;

      // Verify signature
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: 'Invalid signature' });
      }

      // Find and update payment
      const payment = await Payment.findOne({
        razorpayOrderId: razorpayOrderId,
        user: userId
      });

      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Update payment details
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      payment.paymentStatus = 'completed';
      payment.transactionId = razorpayPaymentId;

      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(payment.booking, { status: 'confirmed' });

      // Send confirmation email
      const user = await require('../models/User').findById(userId);
      if (user && user.email) {
        await sendPaymentConfirmation(user.email, user.name, {
          transactionId: razorpayPaymentId,
          amount: payment.amount,
          createdAt: payment.createdAt,
          paymentStatus: payment.paymentStatus
        });
      }

      res.json({
        message: 'Payment verified successfully',
        payment: payment
      });

    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
  }
);

// Webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body;

    switch (event.event) {
      case 'payment.captured':
        // Handle successful payment
        const payment = await Payment.findOne({ razorpayPaymentId: event.payload.payment.entity.id });
        if (payment && payment.paymentStatus === 'pending') {
          payment.paymentStatus = 'completed';
          await payment.save();
          
          // Update booking status
          await Booking.findByIdAndUpdate(payment.booking, { status: 'confirmed' });
        }
        break;

      case 'payment.failed':
        // Handle failed payment
        const failedPayment = await Payment.findOne({ razorpayPaymentId: event.payload.payment.entity.id });
        if (failedPayment) {
          failedPayment.paymentStatus = 'failed';
          await failedPayment.save();
        }
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ status: 'ok' });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook error' });
  }
});

// Get payment status
router.get('/payment-status/:paymentId', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment || payment.user._id.toString() !== req.user.userId) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);

  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ message: 'Error fetching payment status' });
  }
});

module.exports = router; 