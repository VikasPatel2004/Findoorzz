const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { checkListingOwnership } = require('../middleware/ownershipMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const SavedListing = require('../models/SavedListing');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

/* ---------------------- FLAT LISTINGS ---------------------- */

// Get all flat listings (with optional filters)
router.get('/flat', async (req, res) => {
  try {
    const { city, furnishingStatus, minRent, maxRent } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (furnishingStatus) filter.furnishingStatus = furnishingStatus;
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = Number(minRent);
      if (maxRent) filter.rentAmount.$lte = Number(maxRent);
    }
    const listings = await FlatListing.find(filter);
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listings', error: err.message });
  }
});

// Get all flat listings (no filters, all)
router.get('/flat/list-all', async (req, res) => {
  try {
    const listings = await FlatListing.find({});
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all Flat listings', error: err.message });
  }
});

// Get all saved flat listings for the logged-in user
router.get('/flat/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const savedListings = await SavedListing.find({ user: userId }).populate('listing');
    // Filter out null listings (in case the original listing was deleted)
    const listings = savedListings.map(sl => sl.listing).filter(listing => listing !== null);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listings', error: err.message });
  }
});

// Save a flat listing for the logged-in user
router.post('/flat/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const listing = await FlatListing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    const existing = await SavedListing.findOne({ user: userId, listing: listingId });
    if (existing) return res.status(400).json({ message: 'Listing already saved' });
    const savedListing = new SavedListing({ user: userId, listing: listingId });
    await savedListing.save();
    res.status(201).json({ message: 'Listing saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving listing', error: err.message });
  }
});

// Unsave a flat listing for the logged-in user
router.delete('/flat/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const deleted = await SavedListing.findOneAndDelete({ user: userId, listing: listingId });
    if (!deleted) return res.status(404).json({ message: 'Saved listing not found' });
    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get single flat listing by ID (generic, must be last among /flat routes)
router.get('/flat/:id', async (req, res) => {
  try {
    const listing = await FlatListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listing', error: err.message });
  }
});

/* ---------------------- PG LISTINGS ---------------------- */

// Get all PG listings for authenticated user (owner)
router.get('/pg', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await PGListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listings', error: err.message });
  }
});

// Get all PG listings (for students, public)
router.get('/pg/list-all', async (req, res) => {
  try {
    const listings = await PGListing.find({});
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all PG listings', error: err.message });
  }
});

// Get all saved PG listings for the logged-in user
router.get('/pg/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const savedListings = await SavedListing.find({ user: userId }).populate('listing');
    // Filter out null listings (in case the original listing was deleted)
    const listings = savedListings.map(sl => sl.listing).filter(listing => listing !== null);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listings', error: err.message });
  }
});

// Save a PG listing for the logged-in user
router.post('/pg/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const listing = await PGListing.findById(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    const existing = await SavedListing.findOne({ user: userId, listing: listingId });
    if (existing) return res.status(400).json({ message: 'Listing already saved' });
    const savedListing = new SavedListing({ user: userId, listing: listingId });
    await savedListing.save();
    res.status(201).json({ message: 'Listing saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving listing', error: err.message });
  }
});

// Unsave a PG listing for the logged-in user
router.delete('/pg/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const deleted = await SavedListing.findOneAndDelete({ user: userId, listing: listingId });
    if (!deleted) return res.status(404).json({ message: 'Saved listing not found' });
    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get single PG listing by ID (generic, must be last among /pg routes)
router.get('/pg/:id', async (req, res) => {
  try {
    const listing = await PGListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listing', error: err.message });
  }
});

module.exports = router;