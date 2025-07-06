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
    const savedListings = await SavedListing.find({ user: userId, listingType: 'FlatListing' }).populate('listing');
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
    const existing = await SavedListing.findOne({ user: userId, listing: listingId, listingType: 'FlatListing' });
    if (existing) return res.status(400).json({ message: 'Listing already saved' });
    const savedListing = new SavedListing({ user: userId, listing: listingId, listingType: 'FlatListing' });
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
    const deleted = await SavedListing.findOneAndDelete({ user: userId, listing: listingId, listingType: 'FlatListing' });
    if (!deleted) return res.status(404).json({ message: 'Saved listing not found' });
    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get saved status of a flat listing for the logged-in user
router.get('/flat/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const savedListing = await SavedListing.findOne({ user: userId, listing: listingId, listingType: 'FlatListing' });
    if (savedListing) {
      res.json({ saved: true });
    } else {
      res.json({ saved: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listing status', error: err.message });
  }
});

// Create a new flat listing
router.post('/flat', authenticateToken, upload.array('propertyImages', 10), async (req, res) => {
  try {
    // Validate required fields
    const {
      landlordName,
      contactNumber,
      houseNumber,
      colony,
      city,
      numberOfRooms,
      furnishingStatus,
      wifi,
      airConditioning,
      rentAmount,
      independent,
      description
    } = req.body;

    if (!landlordName || !contactNumber || !houseNumber || !colony || !city || !numberOfRooms || !furnishingStatus || !rentAmount || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upload images to Cloudinary
    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });
      propertyImages = await Promise.all(imageUploadPromises);
    }

    // Create new FlatListing document
    const newListing = new FlatListing({
      landlordName,
      contactNumber,
      houseNumber,
      colony,
      city,
      numberOfRooms: Number(numberOfRooms),
      furnishingStatus,
      wifi: wifi === 'true' || wifi === true,
      airConditioning: airConditioning === 'true' || airConditioning === true,
      rentAmount: Number(rentAmount),
      independent: independent === 'true' || independent === true,
      description,
      propertyImages,
      owner: req.user.userId
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (err) {
    console.error('Error creating flat listing:', err);
    res.status(500).json({ message: 'Error creating flat listing', error: err.message });
  }
});

// Update a flat listing
router.put('/flat/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await FlatListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const updatedListing = await FlatListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Error updating flat listing', error: err.message });
  }
});

// Delete a flat listing
router.delete('/flat/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await FlatListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    await FlatListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting flat listing', error: err.message });
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
    const savedListings = await SavedListing.find({ user: userId, listingType: 'PGListing' }).populate('listing');
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
    const existing = await SavedListing.findOne({ user: userId, listing: listingId, listingType: 'PGListing' });
    if (existing) return res.status(400).json({ message: 'Listing already saved' });
    const savedListing = new SavedListing({ user: userId, listing: listingId, listingType: 'PGListing' });
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
    const deleted = await SavedListing.findOneAndDelete({ user: userId, listing: listingId, listingType: 'PGListing' });
    if (!deleted) return res.status(404).json({ message: 'Saved listing not found' });
    res.json({ message: 'Listing unsaved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error unsaving listing', error: err.message });
  }
});

// Get saved status of a PG listing for the logged-in user
router.get('/pg/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    const savedListing = await SavedListing.findOne({ user: userId, listing: listingId, listingType: 'PGListing' });
    if (savedListing) {
      res.json({ saved: true });
    } else {
      res.json({ saved: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved listing status', error: err.message });
  }
});

// Create a new PG listing
router.post('/pg', authenticateToken, upload.array('propertyImages', 10), async (req, res) => {
  try {
    // Validate required fields
    const {
      landlordName,
      contactNumber,
      houseNumber,
      colony,
      city,
      numberOfRooms,
      furnishingStatus,
      wifi,
      airConditioning,
      rentAmount,
      independent,
      description
    } = req.body;

    if (!landlordName || !contactNumber || !houseNumber || !colony || !city || !numberOfRooms || !furnishingStatus || !rentAmount || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Upload images to Cloudinary
    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      });
      propertyImages = await Promise.all(imageUploadPromises);
    }

    // Create new PGListing document
    const newListing = new PGListing({
      landlordName,
      contactNumber,
      houseNumber,
      colony,
      city,
      numberOfRooms,
      furnishingStatus,
      wifi: wifi === 'true' || wifi === true,
      airConditioning: airConditioning === 'true' || airConditioning === true,
      rentAmount,
      independent: independent === 'true' || independent === true,
      description,
      propertyImages,
      owner: req.user.userId
    });

    await newListing.save();

    res.status(201).json(newListing);
  } catch (err) {
    console.error('Error creating PG listing:', err);
    res.status(500).json({ message: 'Error creating PG listing', error: err.message });
  }
});

// Update a PG listing
router.put('/pg/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await PGListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const updatedListing = await PGListing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ message: 'Error updating PG listing', error: err.message });
  }
});

// Delete a PG listing
router.delete('/pg/:id', authenticateToken, checkListingOwnership, async (req, res) => {
  try {
    const listing = await PGListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    await PGListing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting PG listing', error: err.message });
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
