const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');

const router = express.Router();

// Import express-validator
const { body, validationResult } = require('express-validator');

// Create a new payment
router.post('/',
  authenticateToken,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    body('paymentStatus').notEmpty().withMessage('Payment status is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Rename bookingId to booking to match Payment model
      const { bookingId, ...rest } = req.body;
      const paymentData = { booking: bookingId, ...rest, user: req.user.userId };
      const payment = new Payment(paymentData);
      await payment.save();
      res.status(201).json(payment);
    } catch (err) {
      console.error('Payment creation error:', err);
      res.status(500).json({ message: 'Error creating payment', error: err.message });
    }
  }
);

// Get payments for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.userId }).populate('booking');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
});

module.exports = router;
