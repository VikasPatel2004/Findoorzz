const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { checkListingOwnership } = require('../middleware/ownershipMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules for flat listing
const flatListingValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('landlordName').notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('houseNumber').notEmpty().withMessage('House number is required'),
  body('colony').notEmpty().withMessage('Colony is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('numberOfRooms').isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be a number'),
];

// Create a new flat listing
router.post('/flat', authenticateToken, flatListingValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const listingData = { ...req.body, owner: req.user.userId };
    const listing = new FlatListing(listingData);
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error creating flat listing', error: err.message });
  }
});

// Get all flat listings with pagination and filtering
router.get('/flat', async (req, res) => {
  try {
    const { page = 1, limit = 10, city, furnishingStatus, minRent, maxRent } = req.query;

    const filter = {};
    if (city) filter.city = city;
    if (furnishingStatus) filter.furnishingStatus = furnishingStatus;
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = Number(minRent);
      if (maxRent) filter.rentAmount.$lte = Number(maxRent);
    }

    const listings = await FlatListing.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await FlatListing.countDocuments(filter);

    res.json({
      listings,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listings', error: err.message });
  }
});

// Validation rules for flat listing update
const flatListingUpdateValidationRules = [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('landlordName').optional().notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').optional().notEmpty().withMessage('Contact number is required'),
  body('houseNumber').optional().notEmpty().withMessage('House number is required'),
  body('colony').optional().notEmpty().withMessage('Colony is required'),
  body('city').optional().notEmpty().withMessage('City is required'),
  body('numberOfRooms').optional().isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').optional().notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').optional().isNumeric().withMessage('Rent amount must be a number'),
];

// Update a flat listing (only owner)
router.put('/flat/:id', authenticateToken, checkListingOwnership, flatListingUpdateValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

// Validation rules for PG listing
const pgListingValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('landlordName').notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('houseNumber').notEmpty().withMessage('House number is required'),
  body('colony').notEmpty().withMessage('Colony is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('numberOfRooms').isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be a number'),
];

// Create a new PG listing
router.post('/pg', authenticateToken, pgListingValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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

// Validation rules for PG listing update
const pgListingUpdateValidationRules = [
  body('title').optional().notEmpty().withMessage('Title is required'),
  body('landlordName').optional().notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').optional().notEmpty().withMessage('Contact number is required'),
  body('houseNumber').optional().notEmpty().withMessage('House number is required'),
  body('colony').optional().notEmpty().withMessage('Colony is required'),
  body('city').optional().notEmpty().withMessage('City is required'),
  body('numberOfRooms').optional().isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').optional().notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').optional().isNumeric().withMessage('Rent amount must be a number'),
];

// Update a PG listing (only owner)
router.put('/pg/:id', authenticateToken, checkListingOwnership, pgListingUpdateValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
