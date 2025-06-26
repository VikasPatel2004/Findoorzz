const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { checkListingOwnership } = require('../middleware/ownershipMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// Validation rules for flat listing
const flatListingValidationRules = [
  body('landlordName').notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('houseNumber').notEmpty().withMessage('House number is required'),
  body('colony').notEmpty().withMessage('Colony is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('numberOfRooms').isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be a number'),
];

// Helper function to upload files to Cloudinary
async function uploadFilesToCloudinary(files) {
  const urls = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) throw error;
      return result;
    });
    // Since upload_stream is callback based, we need to wrap it in a promise
  }
  return urls;
}

// Create a new flat listing with file uploads
router.post('/flat', authenticateToken, upload.fields([
  { name: 'propertyImages', maxCount: 10 }
]), flatListingValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Upload files to Cloudinary
    const propertyImages = [];
    if (req.files['propertyImages']) {
      for (const file of req.files['propertyImages']) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });
        propertyImages.push(uploadResult.secure_url);
      }
    }

    const listingData = {
      ...req.body,
      owner: req.user.userId,
      propertyImages,
    };

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

router.put('/flat/:id', authenticateToken, checkListingOwnership, upload.fields([
  { name: 'propertyImages', maxCount: 10 }
]), flatListingUpdateValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Upload files to Cloudinary
    const propertyImages = [];
    if (req.files['propertyImages']) {
      for (const file of req.files['propertyImages']) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });
        propertyImages.push(uploadResult.secure_url);
      }
    }

    const updateData = {
      ...req.body,
      propertyImages,
    };

    const listing = await FlatListing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
  body('landlordName').notEmpty().withMessage('Landlord name is required'),
  body('contactNumber').notEmpty().withMessage('Contact number is required'),
  body('houseNumber').notEmpty().withMessage('House number is required'),
  body('colony').notEmpty().withMessage('Colony is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('numberOfRooms').isInt({ min: 1 }).withMessage('Number of rooms must be at least 1'),
  body('furnishingStatus').notEmpty().withMessage('Furnishing status is required'),
  body('rentAmount').isNumeric().withMessage('Rent amount must be a number'),
];

// Create a new PG listing with file uploads
router.post('/pg', authenticateToken, upload.fields([
  { name: 'propertyImages', maxCount: 10 }
]), pgListingValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Upload files to Cloudinary
    const propertyImages = [];
    if (req.files['propertyImages']) {
      for (const file of req.files['propertyImages']) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });
        propertyImages.push(uploadResult.secure_url);
      }
    }

    const listingData = {
      ...req.body,
      owner: req.user.userId,
      propertyImages,
    };

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
router.put('/pg/:id', authenticateToken, checkListingOwnership, upload.fields([
  { name: 'propertyImages', maxCount: 10 }
]), pgListingUpdateValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Upload files to Cloudinary
    const propertyImages = [];
    if (req.files['propertyImages']) {
      for (const file of req.files['propertyImages']) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
          stream.end(file.buffer);
        });
        propertyImages.push(uploadResult.secure_url);
      }
    }

    const updateData = {
      ...req.body,
      propertyImages,
    };

    const listing = await PGListing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
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
