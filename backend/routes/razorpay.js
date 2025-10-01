const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');
const razorpay = require('../config/razorpay');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');
const FlatListing = require('../models/FlatListing');
const Payment = require('../models/Payment');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'OK', route: '/api/razorpay', timestamp: new Date().toISOString() });
});

// Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { bookingId, amount, description } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: 'bookingId and amount are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const parsedAmount = Math.round(Number(amount));
    if (!parsedAmount || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Razorpay takes amount in paise, now sent directly from frontend
    // Ensure receipt is <= 40 characters
    let shortReceipt = `rcpt_${bookingId}`;
    if (shortReceipt.length > 35) {
      shortReceipt = shortReceipt.slice(0, 35);
    }
    shortReceipt += `_${Date.now()}`.slice(0, 5); // add a short timestamp
    shortReceipt = shortReceipt.slice(0, 40); // final safety trim
    const options = {
      amount: parsedAmount,
      currency: 'INR',
      receipt: shortReceipt,
      notes: { bookingId, description: description || 'Property booking payment' }
    };

    const order = await razorpay.orders.create(options);

    // Create Payment record with pending status
    await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: parsedAmount,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      razorpayOrderId: order.id,
      description: description || 'Property booking payment',
      receipt: options.receipt,
      notes: JSON.stringify(options.notes)
    });

    res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
});

// Verify payment from frontend handler
router.post('/verify-payment', authenticateToken, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Mark payment completed and update booking
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpayOrderId, user: req.user.id },
      {
        paymentStatus: 'completed',
        razorpayPaymentId,
        razorpaySignature,
        transactionId: razorpayPaymentId
      },
      { new: true }
    );

    // Resolve booking and notifications
    let updatedBooking = null;
    try {
      const bookingId = payment?.booking || req.body.bookingId;
      if (bookingId) {
        updatedBooking = await Booking.findByIdAndUpdate(
          bookingId,
          { status: 'confirmed', paymentStatus: 'completed' },
          { new: true }
        );

        // If Flat listing, move to under_review and notify
        const booking = await Booking.findById(bookingId);
        if (booking && booking.listingType === 'FlatListing') {
          const flat = await FlatListing.findByIdAndUpdate(
            booking.listingId,
            { reviewStatus: 'under_review' },
            { new: true }
          );

          const renterUser = await User.findById(booking.user);
          if (flat && flat.owner) {
            await Notification.create({
              user: flat.owner,
              message: `Your listing was booked by ${renterUser?.name || 'a renter'}. Amount will be credited once the handover is confirmed by broker.`,
              type: 'Lender',
              relatedBooking: booking._id,
              relatedListing: flat._id
            });
          }

          const adminUsers = await User.find({ isAdmin: true });
          for (const admin of adminUsers) {
            await Notification.create({
              user: admin._id,
              message: `Deposit received for flat ${flat?.houseNumber}, ${flat?.colony}. Listing moved to Under Review.`,
              type: 'System',
              relatedBooking: booking._id,
              relatedListing: flat?._id
            });
          }
        }
      }
    } catch (notifyErr) {
      console.error('Post-payment update/notify error:', notifyErr);
    }

    return res.json({ success: true, message: 'Payment verified', payment, booking: updatedBooking });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    res.status(500).json({ message: 'Failed to verify payment', error: err.message });
  }
});

// Optional webhook for server-side verification
router.post('/webhook', express.json({ type: '*/*' }), async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== expected) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured') {
      const paymentId = req.body.payload.payment.entity.id;
      const orderId = req.body.payload.payment.entity.order_id;
      await Payment.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { paymentStatus: 'completed', transactionId: paymentId, razorpayPaymentId: paymentId },
        { new: true }
      );
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Razorpay webhook error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;
