const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const bookingData = { ...req.body, user: req.user.userId };
    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err.message });
  }
});

// Get bookings for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId }).populate('listingId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
});

// Cancel a booking (only by user who booked)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
});

module.exports = router;
