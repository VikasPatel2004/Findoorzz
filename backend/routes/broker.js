const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const FlatListing = require('../models/FlatListing');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Middleware to ensure broker role
async function requireBroker(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role !== 'broker') {
      return res.status(403).json({ message: 'Access denied. Broker role required.' });
    }
    next();
  } catch (err) {
    console.error('Broker middleware error:', err);
    res.status(500).json({ message: 'Authentication failed' });
  }
}

// Broker confirms handover for an assigned Flat listing
router.post('/listings/:id/confirm', authenticateToken, requireBroker, async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await FlatListing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Flat listing not found' });

    // Ensure this broker is assigned to this listing
    if (!listing.assignedBroker || String(listing.assignedBroker) !== String(req.user.userId)) {
      return res.status(403).json({ message: 'You are not assigned to this listing' });
    }

    // Update listing state
    listing.booked = true;
    listing.reviewStatus = 'confirmed';
    await listing.save();

    // Optionally, update the latest active booking's status to completed
    try {
      const booking = await Booking.findOne({ listingType: 'FlatListing', listingId: id, status: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
      if (booking) {
        booking.status = 'completed';
        await booking.save();
      }
    } catch (e) {
      console.warn('Booking update warning:', e.message);
    }

    // Notify admins that payout is due
    try {
      const admins = await User.find({ isAdmin: true });
      for (const admin of admins) {
        await Notification.create({
          user: admin._id,
          message: `Broker confirmed handover for flat ${listing.houseNumber}, ${listing.colony}. Proceed with payouts to lender and broker.`,
          type: 'System',
          relatedListing: listing._id
        });
      }
    } catch (e) {
      console.warn('Admin notification warning:', e.message);
    }

    res.json({ message: 'Handover confirmed. Listing marked as booked.', listing });
  } catch (err) {
    console.error('Broker confirm error:', err);
    res.status(500).json({ message: 'Error confirming handover', error: err.message });
  }
});

module.exports = router;
