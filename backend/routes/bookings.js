const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { listingType, listingId, bookingStartDate, bookingEndDate } = req.body;
    const userId = req.user.userId;

    // Check for overlapping bookings for the same listing
    const overlappingBooking = await Booking.findOne({
      listingType,
      listingId,
      status: { $ne: 'cancelled' },
      $or: [
        { bookingStartDate: { $lte: bookingEndDate, $gte: bookingStartDate } },
        { bookingEndDate: { $lte: bookingEndDate, $gte: bookingStartDate } },
        { bookingStartDate: { $lte: bookingStartDate }, bookingEndDate: { $gte: bookingEndDate } }
      ]
    });

    if (overlappingBooking) {
      return res.status(409).json({ message: 'Listing is already booked for the selected dates' });
    }

    const bookingData = { listingType, listingId, bookingStartDate, bookingEndDate, user: userId };
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
