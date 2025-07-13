const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const Notification = require('../models/Notification');

const router = express.Router();

// Create a new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Booking request received:', req.body);
    console.log('User ID from token:', req.user.userId);
    
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
      console.log('Overlapping booking found:', overlappingBooking);
      return res.status(409).json({ message: 'Listing is already booked for the selected dates' });
    }

    // Check if user has already booked this listing
    const existingUserBooking = await Booking.findOne({
      listingType,
      listingId,
      user: userId,
      status: { $ne: 'cancelled' }
    });

    if (existingUserBooking) {
      console.log('User already has a booking for this listing:', existingUserBooking);
      return res.status(409).json({ message: 'You have already booked this listing' });
    }

    const bookingData = { listingType, listingId, bookingStartDate, bookingEndDate, user: userId };
    const booking = new Booking(bookingData);
    await booking.save();

    // Notification logic
    let ownerId;
    let listingTitle;
    let type;
    
    if (listingType === 'FlatListing') {
      const flat = await FlatListing.findById(listingId);
      if (flat) {
        ownerId = flat.owner;
        listingTitle = `${flat.landlordName} - ${flat.houseNumber}`;
        type = 'Lender';
      }
    } else if (listingType === 'PGListing') {
      const pg = await PGListing.findById(listingId);
      if (pg) {
        ownerId = pg.owner;
        listingTitle = `${pg.landlordName} - ${pg.houseNumber}`;
        type = 'Landlord';
      }
    }
    
    // Create notification for the listing owner
    if (ownerId && type) {
      await Notification.create({
        user: ownerId,
        message: `New booking received for your ${listingType === 'FlatListing' ? 'flat' : 'PG'} listing: ${listingTitle}`,
        type: type,
        relatedBooking: booking._id,
        relatedListing: listingId
      });
    }
    
    // Create notification for the user who made the booking
    await Notification.create({
      user: userId,
      message: `Booking confirmed for ${listingTitle || 'your selected property'}. Payment successful!`,
      type: 'Booking',
      relatedBooking: booking._id,
      relatedListing: listingId
    });

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
    
    // Get listing details for notification
    let listingTitle = 'your property';
    let ownerId;
    
    if (booking.listingType === 'FlatListing') {
      const flat = await FlatListing.findById(booking.listingId);
      if (flat) {
        listingTitle = `${flat.landlordName} - ${flat.houseNumber}`;
        ownerId = flat.owner;
      }
    } else if (booking.listingType === 'PGListing') {
      const pg = await PGListing.findById(booking.listingId);
      if (pg) {
        listingTitle = `${pg.landlordName} - ${pg.houseNumber}`;
        ownerId = pg.owner;
      }
    }
    
    // Create notification for the listing owner
    if (ownerId) {
      await Notification.create({
        user: ownerId,
        message: `Booking cancelled for your listing: ${listingTitle}`,
        type: booking.listingType === 'FlatListing' ? 'Lender' : 'Landlord',
        relatedBooking: booking._id,
        relatedListing: booking.listingId
      });
    }
    
    // Create notification for the user who cancelled
    await Notification.create({
      user: req.user.userId,
      message: `Your booking for ${listingTitle} has been cancelled successfully.`,
      type: 'Booking',
      relatedBooking: booking._id,
      relatedListing: booking.listingId
    });
    
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking', error: err.message });
  }
});

module.exports = router;
