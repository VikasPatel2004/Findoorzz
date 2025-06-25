const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { checkListingOwnership } = require('../middleware/ownershipMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');

const router = express.Router();

// Create a new flat listing
router.post('/flat', authenticateToken, async (req, res) => {
  try {
    const listingData = { ...req.body, owner: req.user.userId };
    const listing = new FlatListing(listingData);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error creating flat listing', error: err.message });
  }
});

// Get all flat listings
router.get('/flat', async (req, res) => {
  try {
    const listings = await FlatListing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listings', error: err.message });
  }
});

// Update a flat listing (only owner)
router.put('/flat/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await FlatListing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error updating flat listing', error: err.message });
  }
});

// Delete a flat listing (only owner)
router.delete('/flat/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await FlatListing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting flat listing', error: err.message });
  }
});

// Create a new PG listing
router.post('/pg', authenticateToken, async (req, res) => {
  try {
    const listingData = { ...req.body, owner: req.user.userId };
    const listing = new PGListing(listingData);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error creating PG listing', error: err.message });
  }
});

// Get all PG listings
router.get('/pg', async (req, res) => {
  try {
    const listings = await PGListing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listings', error: err.message });
  }
});

// Update a PG listing (only owner)
router.put('/pg/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await PGListing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error updating PG listing', error: err.message });
  }
});

// Delete a PG listing (only owner)
router.delete('/pg/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await PGListing.findByIdAndDelete(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting PG listing', error: err.message });
  }
});

module.exports = router;
