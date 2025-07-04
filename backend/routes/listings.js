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

// Get single flat listing by ID
router.get('/flat/:id', async (req, res) => {
  try {
    const listing = await FlatListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listing', error: err.message });
  }
});


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
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.end(file.buffer);
    });
    urls.push(uploadResult.secure_url);
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
    if (req.files && req.files['propertyImages']) {
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

// Get all flat listings with pagination and filtering, public access (no authentication)
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

    // Remove pagination to return all listings like PG
    const listings = await FlatListing.find(filter);

    const total = listings.length;

    res.json({
      listings,
      total,
      page: Number(page),
      pages: 1,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching flat listings', error: err.message });
  }
});

// Validation rules for flat listing update
const flatListingUpdateValidationRules = [
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

    // Convert number fields to numbers
    const updateData = {
      ...req.body,
      numberOfRooms: req.body.numberOfRooms ? Number(req.body.numberOfRooms) : undefined,
      rentAmount: req.body.rentAmount ? Number(req.body.rentAmount) : undefined,
    };

    if (propertyImages.length > 0) {
      updateData.propertyImages = propertyImages;
    }

    const listing = await FlatListing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error('Error updating flat listing:', err);
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

// Get all PG listings, only for authenticated user (owner)
router.get('/pg', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await PGListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listings', error: err.message });
  }
});

router.get('/pg/list-all', async (req, res) => {
  try {
    const listings = await PGListing.find({});
    res.json(listings);
  } catch (err) {
    console.error('Error in /pg/list-all route:', err.stack || err);
    res.status(500).json({ message: 'Error fetching all PG listings', error: err.message });
  }
});
router.post('/pg/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;

    // Check if listing exists
    const listing = await PGListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already saved
    const existing = await SavedListing.findOne({ user: userId, listing: listingId });
    if (existing) {
      return res.status(400).json({ message: 'Listing already saved' });
    }

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
    if (!deleted) {
      return res.status(404).json({ message: 'Saved listing not found' });
    }

    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get all saved PG listings for the logged-in user
router.get('/pg/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const savedListings = await SavedListing.find({ user: userId }).populate('listing');
    const listings = savedListings.map(sl => sl.listing);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listings', error: err.message });
  }
});
// Get single PG listing by ID
router.get('/pg/:id', async (req, res) => {
  try {
    const listing = await PGListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listing', error: err.message });
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
    
    // Convert number fields to numbers
    const updateData = {
      ...req.body,
      numberOfRooms: req.body.numberOfRooms ? Number(req.body.numberOfRooms) : undefined,
      rentAmount: req.body.rentAmount ? Number(req.body.rentAmount) : undefined,
    };
    
    if (propertyImages.length > 0) {
      updateData.propertyImages = propertyImages;
    }
    
    const listing = await PGListing.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.json(listing);
  } catch (err) {
    console.error('Error updating PG listing:', err);
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

// Save a PG listing for the logged-in user




// Save a flat listing for the logged-in user
router.post('/flat/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;

    // Check if listing exists
    const listing = await FlatListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if already saved
    const existing = await SavedListing.findOne({ user: userId, listing: listingId });
    if (existing) {
      return res.status(400).json({ message: 'Listing already saved' });
    }

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
    if (!deleted) {
      return res.status(404).json({ message: 'Saved listing not found' });
    }

    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get all saved flat listings for the logged-in user
router.get('/flat/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const savedListings = await SavedListing.find({ user: userId }).populate('listing');
    const listings = savedListings.map(sl => sl.listing);

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listings', error: err.message });
  }
});

module.exports = router;
