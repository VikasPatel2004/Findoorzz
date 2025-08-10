const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const { checkListingOwnership } = require('../middleware/ownershipMiddleware');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const SavedListing = require('../models/SavedListing');
const Notification = require('../models/Notification');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

/* ---------------------- FLAT LISTINGS ---------------------- */

// Get all flat listings (no filters, all) - PUBLIC ROUTE
router.get('/flat/list-all', async (req, res) => {
  try {
    console.log('Fetching all flat listings...');
    const listings = await FlatListing.find({ booked: false });
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
    console.log('Fetching my-created flat listings for user:', req.user);
    const filter = { owner: req.user.id }; // Use req.user.id instead of userId
    const listings = await FlatListing.find(filter).select('+booked');
    console.log(`Found ${listings.length} flat listings for user ${req.user.id}`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching my-created flat listings:', err);
    res.status(500).json({ message: 'Error fetching your created flat listings', error: err.message });
  }
});

// Get flat listings for authenticated user (lender) - only their own listings
router.get('/flat/my-listings', authenticateToken, async (req, res) => {
  try {
    const filter = { owner: req.user.id };
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
    const { city, colony, minPrice, maxPrice, bedrooms, amenities } = req.query;
    let filter = { type: 'Flat', booked: false };
    const exprFilters = [];
    // City filter (ignore all spaces and case, exact match)
    if (city) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$city" }, find: " ", replacement: "" } },
            regex: `^${city.trim().toLowerCase().replace(/\s+/g, '')}$`,
          }
        }
      });
    }
    // Colony filter (ignore all spaces and case, exact match)
    if (colony) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$colony" }, find: " ", replacement: "" } },
            regex: `^${colony.trim().toLowerCase().replace(/\s+/g, '')}$`,
          }
        }
      });
    }
    // Other filters (unchanged)
    if (minPrice || maxPrice) {
      filter.rentAmount = {};
      if (minPrice) filter.rentAmount.$gte = Number(minPrice);
      if (maxPrice) filter.rentAmount.$lte = Number(maxPrice);
      filter.rentAmount.$ne = null;
    }
    if (bedrooms) {
      filter.bedrooms = parseInt(bedrooms);
    }
    if (amenities) {
      filter.amenities = { $in: amenities.split(',') };
    }
    // Combine exprFilters with $and if needed
    let finalFilter = filter;
    if (exprFilters.length > 0) {
      finalFilter = { ...filter, $and: exprFilters };
    }
    // Use lean() for better performance
    const listings = await FlatListing.find(finalFilter)
      .select('title description rentAmount city colony bedrooms amenities images createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .limit(50);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching Flat listings:', error);
    res.status(500).json({ message: 'Error fetching listings' });
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

    // Upload images to Cloudinary or convert to base64
    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} images...`);
      
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
        console.log('Images uploaded to Cloudinary successfully');
      } else {
        // Convert to base64 as fallback - with size optimization
        console.log('Converting images to base64...');
        propertyImages = req.files.map((file, index) => {
          try {
            // Limit file size to prevent memory issues
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              console.warn(`Image ${index + 1} is too large (${file.size} bytes), skipping...`);
              return null;
            }
            
            const base64 = file.buffer.toString('base64');
            const mimeType = file.mimetype;
            console.log(`Converted image ${index + 1} to base64 (${base64.length} characters)`);
            return `data:${mimeType};base64,${base64}`;
          } catch (error) {
            console.error(`Error converting image ${index + 1}:`, error);
            return null;
          }
        }).filter(img => img !== null); // Remove failed conversions
        
        console.log(`Successfully converted ${propertyImages.length} images to base64`);
      }
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
      owner: req.user.id
    });

    await newListing.save();

    // Create notification for the listing owner
    await Notification.create({
      user: req.user.userId,
      message: `Your flat listing "${landlordName} - ${houseNumber}" has been created successfully!`,
      type: 'Lender',
      relatedListing: newListing._id
    });

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
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
      } else {
        // Convert to base64 as fallback
        const newImages = req.files.map(file => {
          const base64 = file.buffer.toString('base64');
          const mimeType = file.mimetype;
          return `data:${mimeType};base64,${base64}`;
        });
        updateData.propertyImages = newImages;
      }
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
    const allListings = await PGListing.find({ booked: false });
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
    const { city, colony, rentAmount, numberOfRooms, furnishingStatus, wifi, airConditioning, independent } = req.query;
    const filter = { booked: false };
    const exprFilters = [];
    
    // City filter (ignore all spaces and case)
    if (city) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$city" }, find: " ", replacement: "" } },
            regex: city.trim().toLowerCase().replace(/\s+/g, ''),
          }
        }
      });
    }
    // Colony filter (ignore all spaces and case)
    if (colony) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$colony" }, find: " ", replacement: "" } },
            regex: colony.trim().toLowerCase().replace(/\s+/g, ''),
          }
        }
      });
    }
    // Rent filter
    if (rentAmount) {
      filter.rentAmount = { $lte: Number(rentAmount) };
    }
    if (numberOfRooms) {
      if (numberOfRooms === '4+') {
        filter.numberOfRooms = { $gte: '4' };
      } else {
        filter.numberOfRooms = numberOfRooms;
      }
    }
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    if (wifi === 'true' || wifi === true) {
      filter.wifi = true;
    }
    if (airConditioning === 'true' || airConditioning === true) {
      filter.airConditioning = true;
    }
    if (independent === 'true' || independent === true) {
      filter.independent = true;
    }
    // Combine exprFilters with $and if needed
    let finalFilter = filter;
    if (exprFilters.length > 0) {
      finalFilter = { ...filter, $and: exprFilters };
    }
    console.log('Applied PG filters:', finalFilter);
    const listings = await PGListing.find(finalFilter);
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
    const { city, colony, rentAmount, numberOfRooms, furnishingStatus, wifi, airConditioning, independent } = req.query;
    const userId = req.user.userId;
    const filter = { booked: false };
    const exprFilters = [];
    // City filter (ignore all spaces and case)
    if (city) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$city" }, find: " ", replacement: "" } },
            regex: city.trim().toLowerCase().replace(/\s+/g, ''),
          }
        }
      });
    }
    // Colony filter (ignore all spaces and case)
    if (colony) {
      exprFilters.push({
        $expr: {
          $regexMatch: {
            input: { $replaceAll: { input: { $toLower: "$colony" }, find: " ", replacement: "" } },
            regex: colony.trim().toLowerCase().replace(/\s+/g, ''),
          }
        }
      });
    }
    // Rent filter
    if (rentAmount) {
      filter.rentAmount = { $lte: Number(rentAmount) };
    }
    if (numberOfRooms) {
      if (numberOfRooms === '4+') {
        filter.numberOfRooms = { $gte: '4' };
      } else {
        filter.numberOfRooms = numberOfRooms;
      }
    }
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    if (wifi === 'true' || wifi === true) {
      filter.wifi = true;
    }
    if (airConditioning === 'true' || airConditioning === true) {
      filter.airConditioning = true;
    }
    if (independent === 'true' || independent === true) {
      filter.independent = true;
    }
    // Combine exprFilters with $and if needed
    let finalFilter = filter;
    if (exprFilters.length > 0) {
      finalFilter = { ...filter, $and: exprFilters };
    }
    console.log('Applied PG student filters:', finalFilter);
    const listings = await PGListing.find(finalFilter);
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
    console.log('Fetching my-created PG listings for user:', req.user);
    const filter = { owner: req.user.id }; // Use req.user.id instead of userId
    const listings = await PGListing.find(filter).select('+booked');
    console.log(`Found ${listings.length} PG listings for user ${req.user.id}`);
    res.json(listings);
  } catch (err) {
    console.error('Error fetching my-created PG listings:', err);
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

// Get all PG listings with optimized query
router.get('/pg', async (req, res) => {
  try {
    const { city, colony, minPrice, maxPrice, gender, amenities } = req.query;
    
    let query = { type: 'PG' };
    
    // Build filter object
    if (city) {
      query.city = { $regex: city.replace(/\s+/g, '\\s*'), $options: 'i' };
    }
    if (colony) {
      query.colony = { $regex: colony.replace(/\s+/g, '\\s*'), $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.rentAmount = {};
      if (minPrice) query.rentAmount.$gte = minPrice.toString();
      if (maxPrice) query.rentAmount.$lte = maxPrice.toString();
    }
    if (gender) {
      query.gender = gender;
    }
    if (amenities) {
      query.amenities = { $in: amenities.split(',') };
    }

    // Use lean() for better performance when you don't need Mongoose documents
    const listings = await PGListing.find(query)
      .select('title description rentAmount city colony gender amenities images createdAt')
      .sort({ createdAt: -1 })
      .lean()
      .limit(50); // Limit results for better performance

    res.json(listings);
  } catch (error) {
    console.error('Error fetching PG listings:', error);
    res.status(500).json({ message: 'Error fetching listings' });
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

    // Upload images to Cloudinary or convert to base64
    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} images...`);
      
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
        console.log('Images uploaded to Cloudinary successfully');
      } else {
        // Convert to base64 as fallback - with size optimization
        console.log('Converting images to base64...');
        propertyImages = req.files.map((file, index) => {
          try {
            // Limit file size to prevent memory issues
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              console.warn(`Image ${index + 1} is too large (${file.size} bytes), skipping...`);
              return null;
            }
            
            const base64 = file.buffer.toString('base64');
            const mimeType = file.mimetype;
            console.log(`Converted image ${index + 1} to base64 (${base64.length} characters)`);
            return `data:${mimeType};base64,${base64}`;
          } catch (error) {
            console.error(`Error converting image ${index + 1}:`, error);
            return null;
          }
        }).filter(img => img !== null); // Remove failed conversions
        
        console.log(`Successfully converted ${propertyImages.length} images to base64`);
      }
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
      owner: req.user.id
    });

    await newListing.save();

    // Create notification for the listing owner
    await Notification.create({
      user: req.user.userId,
      message: `Your PG listing "${landlordName} - ${houseNumber}" has been created successfully!`,
      type: 'Landlord',
      relatedListing: newListing._id
    });

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
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
      } else {
        // Convert to base64 as fallback
        const newImages = req.files.map(file => {
          const base64 = file.buffer.toString('base64');
          const mimeType = file.mimetype;
          return `data:${mimeType};base64,${base64}`;
        });
        updateData.propertyImages = newImages;
      }
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

// Generic listing creation route
router.post('/', authenticateToken, upload.array('propertyImages', 10), async (req, res) => {
  try {
    const { type, ...listingData } = req.body;
    
    if (!type || !['PG', 'Flat'].includes(type)) {
      return res.status(400).json({ message: 'Invalid listing type. Must be "PG" or "Flat"' });
    }

    // Validate required fields
    const requiredFields = [
      'landlordName', 'contactNumber', 'houseNumber', 'colony', 'city', 
      'numberOfRooms', 'furnishingStatus', 'rentAmount', 'description'
    ];

    for (const field of requiredFields) {
      if (!listingData[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Upload images to Cloudinary or convert to base64
    let propertyImages = [];
    if (req.files && req.files.length > 0) {
      console.log(`Processing ${req.files.length} images...`);
      
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
        console.log('Images uploaded to Cloudinary successfully');
      } else {
        // Convert to base64 as fallback - with size optimization
        console.log('Converting images to base64...');
        propertyImages = req.files.map((file, index) => {
          try {
            // Limit file size to prevent memory issues
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
              console.warn(`Image ${index + 1} is too large (${file.size} bytes), skipping...`);
              return null;
            }
            
            const base64 = file.buffer.toString('base64');
            const mimeType = file.mimetype;
            console.log(`Converted image ${index + 1} to base64 (${base64.length} characters)`);
            return `data:${mimeType};base64,${base64}`;
          } catch (error) {
            console.error(`Error converting image ${index + 1}:`, error);
            return null;
          }
        }).filter(img => img !== null); // Remove failed conversions
        
        console.log(`Successfully converted ${propertyImages.length} images to base64`);
      }
    }

    // Prepare listing data
    const listingDataToSave = {
      ...listingData,
      propertyImages,
      owner: req.user.id,
      type
    };

    // Convert boolean strings to actual booleans
    ['wifi', 'airConditioning', 'independent'].forEach(field => {
      if (listingDataToSave[field] !== undefined) {
        listingDataToSave[field] = listingDataToSave[field] === 'true' || listingDataToSave[field] === true;
      }
    });

    // Convert numeric fields
    if (listingDataToSave.numberOfRooms !== undefined) {
      listingDataToSave.numberOfRooms = Number(listingDataToSave.numberOfRooms);
    }
    if (listingDataToSave.rentAmount !== undefined) {
      listingDataToSave.rentAmount = Number(listingDataToSave.rentAmount);
    }

    // Create listing based on type
    let newListing;
    if (type === 'PG') {
      newListing = new PGListing(listingDataToSave);
    } else if (type === 'Flat') {
      newListing = new FlatListing(listingDataToSave);
    }

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).json({ message: 'Error creating listing', error: err.message });
  }
});

// Generic route to update a listing by ID
router.put('/:id', authenticateToken, upload.array('propertyImages', 10), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in PG listings first
    let listing = await PGListing.findById(id);
    let isPG = true;
    
    // If not found in PG, try Flat listings
    if (!listing) {
      listing = await FlatListing.findById(id);
      isPG = false;
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }
    
    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle image uploads if new images are provided
    if (req.files && req.files.length > 0) {
      // Check if Cloudinary is configured
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        // Use Cloudinary
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
      } else {
        // Convert to base64 as fallback
        const newImages = req.files.map(file => {
          const base64 = file.buffer.toString('base64');
          const mimeType = file.mimetype;
          return `data:${mimeType};base64,${base64}`;
        });
        updateData.propertyImages = newImages;
      }
    }
    
    // Convert boolean strings to actual booleans
    ['wifi', 'airConditioning', 'independent'].forEach(field => {
      if (updateData[field] !== undefined) {
        updateData[field] = updateData[field] === 'true' || updateData[field] === true;
      }
    });
    
    // Convert numeric fields
    if (updateData.numberOfRooms !== undefined) {
      updateData.numberOfRooms = Number(updateData.numberOfRooms);
    }
    if (updateData.rentAmount !== undefined) {
      updateData.rentAmount = Number(updateData.rentAmount);
    }
    
    // Update the listing
    let updatedListing;
    if (isPG) {
      updatedListing = await PGListing.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      updatedListing = await FlatListing.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    }
    
    res.json(updatedListing);
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).json({ message: 'Error updating listing', error: err.message });
  }
});

// Generic route to delete a listing by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find in PG listings first
    let listing = await PGListing.findById(id);
    let isPG = true;
    
    // If not found in PG, try Flat listings
    if (!listing) {
      listing = await FlatListing.findById(id);
      isPG = false;
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check ownership
    if (listing.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    
    // Delete the listing
    if (isPG) {
      await PGListing.findByIdAndDelete(id);
    } else {
      await FlatListing.findByIdAndDelete(id);
    }
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).json({ message: 'Error deleting listing', error: err.message });
  }
});

// Route to get saved PG listings only (for students)
router.get('/saved/pg', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching saved PG listings for user:', userId);
    
    // Get only saved PG listings
    const savedListings = await SavedListing.find({ 
      user: userId, 
      listingType: 'PGListing' 
    }).sort({ createdAt: -1 });
    
    console.log('Found saved PG listings:', savedListings.length);
    
    // Manually populate PG listings
    const populatedListings = [];
    
    for (const savedListing of savedListings) {
      const listing = await PGListing.findById(savedListing.listing);
      if (listing) {
        console.log('Adding PG listing to response:', listing._id, listing.houseNumber);
        populatedListings.push(listing);
      } else {
        console.log('PG listing not found, skipping:', savedListing.listing);
      }
    }
    
    console.log('Final populated PG listings count:', populatedListings.length);
    res.json(populatedListings);
  } catch (err) {
    console.error('Error fetching saved PG listings:', err);
    res.status(500).json({ message: 'Error fetching saved PG listings', error: err.message });
  }
});

// Route to get saved Flat listings only (for renters)
router.get('/saved/flat', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching saved Flat listings for user:', userId);
    
    // Get only saved Flat listings
    const savedListings = await SavedListing.find({ 
      user: userId, 
      listingType: 'FlatListing' 
    }).sort({ createdAt: -1 });
    
    console.log('Found saved Flat listings:', savedListings.length);
    
    // Manually populate Flat listings
    const populatedListings = [];
    
    for (const savedListing of savedListings) {
      const listing = await FlatListing.findById(savedListing.listing);
      if (listing) {
        console.log('Adding Flat listing to response:', listing._id, listing.houseNumber);
        populatedListings.push(listing);
      } else {
        console.log('Flat listing not found, skipping:', savedListing.listing);
      }
    }
    
    console.log('Final populated Flat listings count:', populatedListings.length);
    res.json(populatedListings);
  } catch (err) {
    console.error('Error fetching saved Flat listings:', err);
    res.status(500).json({ message: 'Error fetching saved Flat listings', error: err.message });
  }
});

// Generic route to get all saved listings for the logged-in user
router.get('/saved', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching saved listings for user:', userId);
    
    // Get all saved listings (both PG and Flat)
    const savedListings = await SavedListing.find({ user: userId })
      .sort({ createdAt: -1 });
    
    console.log('Found saved listings:', savedListings.length);
    console.log('Saved listings data:', savedListings);
    
    // Manually populate listings from both collections
    const populatedListings = [];
    
    for (const savedListing of savedListings) {
      let listing = null;
      
      console.log('Processing saved listing:', savedListing.listingType, savedListing.listing);
      
      if (savedListing.listingType === 'PGListing') {
        listing = await PGListing.findById(savedListing.listing);
        console.log('PG listing found:', listing ? 'Yes' : 'No');
      } else if (savedListing.listingType === 'FlatListing') {
        listing = await FlatListing.findById(savedListing.listing);
        console.log('Flat listing found:', listing ? 'Yes' : 'No');
      }
      
      if (listing) {
        console.log('Adding listing to response:', listing._id, listing.houseNumber);
        populatedListings.push(listing);
      } else {
        console.log('Listing not found, skipping:', savedListing.listing);
      }
    }
    
    console.log('Final populated listings count:', populatedListings.length);
    res.json(populatedListings);
  } catch (err) {
    console.error('Error fetching saved listings:', err);
    res.status(500).json({ message: 'Error fetching saved listings', error: err.message });
  }
});

// Generic route to get a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Backend: Fetching listing with ID:', id);
    
    // Try to find in PG listings first
    let listing = await PGListing.findById(id);
    console.log('Backend: PG listing found:', listing ? 'Yes' : 'No');
    
    // If not found in PG, try Flat listings
    if (!listing) {
      listing = await FlatListing.findById(id);
      console.log('Backend: Flat listing found:', listing ? 'Yes' : 'No');
    }
    
    if (!listing) {
      console.log('Backend: No listing found with ID:', id);
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    console.log('Backend: Sending listing data:', listing._id, listing.houseNumber);
    res.json(listing);
  } catch (err) {
    console.error('Backend: Error fetching listing:', err);
    res.status(500).json({ message: 'Error fetching listing', error: err.message });
  }
});

// Generic route to save/unsave a listing
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    
    // Check if listing exists in either collection
    let listing = await PGListing.findById(listingId);
    let listingType = 'PGListing';
    
    if (!listing) {
      listing = await FlatListing.findById(listingId);
      listingType = 'FlatListing';
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if already saved
    const existing = await SavedListing.findOne({ 
      user: userId, 
      listing: listingId, 
      listingType 
    });
    
    if (existing) {
      // Unsave the listing
      await SavedListing.findOneAndDelete({ 
        user: userId, 
        listing: listingId, 
        listingType 
      });
      res.json({ message: 'Listing unsaved successfully', saved: false });
    } else {
      // Save the listing
      const savedListing = new SavedListing({ 
        user: userId, 
        listing: listingId, 
        listingType 
      });
      await savedListing.save();
      res.status(201).json({ message: 'Listing saved successfully', saved: true });
    }
  } catch (err) {
    console.error('Error toggling saved listing:', err);
    res.status(500).json({ message: 'Error toggling saved listing', error: err.message });
  }
});

// Generic route to get saved status of a listing
router.get('/:id/save', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const listingId = req.params.id;
    
    // Check in both collections
    const savedListing = await SavedListing.findOne({ 
      user: userId, 
      listing: listingId 
    });
    
    if (savedListing) {
      res.json({ saved: true });
    } else {
      res.json({ saved: false });
    }
  } catch (err) {
    console.error('Error fetching saved listing status:', err);
    res.status(500).json({ message: 'Error fetching saved listing status', error: err.message });
  }
});

module.exports = router;
