const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');

const router = express.Router();

// Create a new payment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const paymentData = { ...req.body, user: req.user.userId };
    const payment = new Payment(paymentData);
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating payment', error: err.message });
  }
});

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
