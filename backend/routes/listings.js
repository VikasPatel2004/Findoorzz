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

// Get all flat listings (no filters, all) - PUBLIC ROUTE
router.get('/flat/list-all', async (req, res) => {
  try {
    console.log('Fetching all flat listings...');
    const listings = await FlatListing.find({});
    console.log(`Found ${listings.length} flat listings`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching flat listings:', err);
    res.status(500).json({ message: 'Error fetching all Flat listings', error: err.message });
  }
});

// Get user's own flat listings (for any user who has created flat listings)
router.get('/flat/my-created', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await FlatListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your created flat listings', error: err.message });
  }
});

// Get flat listings for authenticated user (lender) - only their own listings
router.get('/flat/my-listings', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await FlatListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your flat listings', error: err.message });
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

// Get all flat listings (with optional filters) - for renters to see all listings
router.get('/flat', async (req, res) => {
  try {
    const { city, colony, minRent, maxRent, numberOfRooms, furnishingStatus, wifi, airConditioning, independent } = req.query;
    const filter = {};
    
    // City filter
    if (city) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }
    
    // Colony filter
    if (colony) {
      filter.colony = { $regex: colony.trim(), $options: 'i' };
    }
    
    // Price range filter
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = Number(minRent);
      if (maxRent) filter.rentAmount.$lte = Number(maxRent);
    }
    
    // Number of rooms filter
    if (numberOfRooms) {
      if (numberOfRooms === '4+') {
        filter.numberOfRooms = { $gte: 4 };
      } else {
        filter.numberOfRooms = Number(numberOfRooms);
      }
    }
    
    // Furnishing status filter
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    
    // Amenities filters - only apply when explicitly set to true
    if (wifi === 'true' || wifi === true) {
      filter.wifi = true;
    }
    
    if (airConditioning === 'true' || airConditioning === true) {
      filter.airConditioning = true;
    }
    
    if (independent === 'true' || independent === true) {
      filter.independent = true;
    }
    
    console.log('Applied filters:', filter);
    const listings = await FlatListing.find(filter);
    console.log(`Found ${listings.length} listings matching filters`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching flat listings:', err);
    res.status(500).json({ message: 'Error fetching flat listings', error: err.message });
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
router.put('/flat/:id', authenticateToken, checkListingOwnership, upload.array('propertyImages', 10), async (req, res) => {
  try {
    const listing = await FlatListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Prepare update data
    const updateData = { ...req.body };

    // Handle image uploads if new images are provided
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
      const newImages = await Promise.all(imageUploadPromises);
      updateData.propertyImages = newImages;
    }

    // Convert boolean strings to actual booleans
    if (updateData.wifi !== undefined) {
      updateData.wifi = updateData.wifi === 'true' || updateData.wifi === true;
    }
    if (updateData.airConditioning !== undefined) {
      updateData.airConditioning = updateData.airConditioning === 'true' || updateData.airConditioning === true;
    }
    if (updateData.independent !== undefined) {
      updateData.independent = updateData.independent === 'true' || updateData.independent === true;
    }

    // Convert numeric fields
    if (updateData.numberOfRooms !== undefined) {
      updateData.numberOfRooms = Number(updateData.numberOfRooms);
    }
    if (updateData.rentAmount !== undefined) {
      updateData.rentAmount = Number(updateData.rentAmount);
    }

    const updatedListing = await FlatListing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (err) {
    console.error('Error updating flat listing:', err);
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

// Get all PG listings (for students, public) - all listings from all landlords
router.get('/pg/list-all', async (req, res) => {
  try {
    console.log('Fetching all PG listings...');
    const listings = await PGListing.find({});
    console.log(`Found ${listings.length} PG listings`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching PG listings:', err);
    res.status(500).json({ message: 'Error fetching all PG listings', error: err.message });
  }
});

// Get all PG listings for students (including their own and others)
router.get('/pg/student-listings', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching all PG listings for student...');
    const userId = req.user.userId;
    
    // Get all listings
    const allListings = await PGListing.find({});
    
    // Mark which listings belong to the current user
    const listingsWithOwnership = allListings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.isOwnedByUser = listing.owner.toString() === userId;
      return listingObj;
    });
    
    console.log(`Found ${listingsWithOwnership.length} PG listings for student`);
    res.json(listingsWithOwnership);
  } catch (err) {
    console.error('Error fetching PG listings for student:', err);
    res.status(500).json({ message: 'Error fetching PG listings for student', error: err.message });
  }
});

// Get filtered PG listings (for students, public) - all listings with filters
router.get('/pg/filtered', async (req, res) => {
  try {
    const { city, colony, minRent, maxRent, numberOfRooms, furnishingStatus, wifi, airConditioning, independent } = req.query;
    const filter = {};
    
    // City filter
    if (city) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }
    
    // Colony filter
    if (colony) {
      filter.colony = { $regex: colony.trim(), $options: 'i' };
    }
    
    // Price range filter
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = minRent; // Keep as string for PG listings
      if (maxRent) filter.rentAmount.$lte = maxRent; // Keep as string for PG listings
    }
    
    // Number of rooms filter
    if (numberOfRooms) {
      if (numberOfRooms === '4+') {
        filter.numberOfRooms = { $gte: '4' };
      } else {
        filter.numberOfRooms = numberOfRooms; // Keep as string for PG listings
      }
    }
    
    // Furnishing status filter
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    
    // Amenities filters - only apply when explicitly set to true
    if (wifi === 'true' || wifi === true) {
      filter.wifi = true;
    }
    
    if (airConditioning === 'true' || airConditioning === true) {
      filter.airConditioning = true;
    }
    
    if (independent === 'true' || independent === true) {
      filter.independent = true;
    }
    
    console.log('Applied PG filters:', filter);
    const listings = await PGListing.find(filter);
    console.log(`Found ${listings.length} PG listings matching filters`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching PG listings:', err);
    res.status(500).json({ message: 'Error fetching PG listings', error: err.message });
  }
});

// Get filtered PG listings for students (including their own and others)
router.get('/pg/student-filtered', authenticateToken, async (req, res) => {
  try {
    const { city, colony, minRent, maxRent, numberOfRooms, furnishingStatus, wifi, airConditioning, independent } = req.query;
    const userId = req.user.userId;
    const filter = {};
    
    // City filter
    if (city) {
      filter.city = { $regex: city.trim(), $options: 'i' };
    }
    
    // Colony filter
    if (colony) {
      filter.colony = { $regex: colony.trim(), $options: 'i' };
    }
    
    // Price range filter
    if (minRent || maxRent) {
      filter.rentAmount = {};
      if (minRent) filter.rentAmount.$gte = Number(minRent);
      if (maxRent) filter.rentAmount.$lte = Number(maxRent);
    }
    
    // Number of rooms filter
    if (numberOfRooms) {
      if (numberOfRooms === '4+') {
        filter.numberOfRooms = { $gte: '4' };
      } else {
        filter.numberOfRooms = numberOfRooms; // Keep as string for PG listings
      }
    }
    
    // Furnishing status filter
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    
    // Amenities filters - only apply when explicitly set to true
    if (wifi === 'true' || wifi === true) {
      filter.wifi = true;
    }
    
    if (airConditioning === 'true' || airConditioning === true) {
      filter.airConditioning = true;
    }
    
    if (independent === 'true' || independent === true) {
      filter.independent = true;
    }
    
    console.log('Applied PG student filters:', filter);
    const listings = await PGListing.find(filter);
    
    // Mark which listings belong to the current user
    const listingsWithOwnership = listings.map(listing => {
      const listingObj = listing.toObject();
      listingObj.isOwnedByUser = listing.owner.toString() === userId;
      return listingObj;
    });
    
    console.log(`Found ${listingsWithOwnership.length} PG listings matching filters for student`);
    res.json(listingsWithOwnership);
  } catch (err) {
    console.error('Error fetching filtered PG listings for student:', err);
    res.status(500).json({ message: 'Error fetching filtered PG listings for student', error: err.message });
  }
});

// Get user's own PG listings (for any user who has created PG listings)
router.get('/pg/my-created', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await PGListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your created PG listings', error: err.message });
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

// Get all PG listings for authenticated user (landlord) - only their own listings
router.get('/pg', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const listings = await PGListing.find(filter);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching PG listings', error: err.message });
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
router.put('/pg/:id', authenticateToken, checkListingOwnership, upload.array('propertyImages', 10), async (req, res) => {
  try {
    const listing = await PGListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Prepare update data
    const updateData = { ...req.body };

    // Handle image uploads if new images are provided
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
      const newImages = await Promise.all(imageUploadPromises);
      updateData.propertyImages = newImages;
    }

    // Convert boolean strings to actual booleans
    if (updateData.wifi !== undefined) {
      updateData.wifi = updateData.wifi === 'true' || updateData.wifi === true;
    }
    if (updateData.airConditioning !== undefined) {
      updateData.airConditioning = updateData.airConditioning === 'true' || updateData.airConditioning === true;
    }
    if (updateData.independent !== undefined) {
      updateData.independent = updateData.independent === 'true' || updateData.independent === true;
    }

    // Convert numeric fields
    if (updateData.numberOfRooms !== undefined) {
      updateData.numberOfRooms = Number(updateData.numberOfRooms);
    }
    if (updateData.rentAmount !== undefined) {
      updateData.rentAmount = Number(updateData.rentAmount);
    }

    const updatedListing = await PGListing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (err) {
    console.error('Error updating PG listing:', err);
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
