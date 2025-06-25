const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');

// Middleware to check ownership of a listing before allowing edit/delete
async function checkListingOwnership(req, res, next) {
  try {
    const userId = req.user.userId || req.user.id;
    console.log('Ownership middleware - baseUrl:', req.baseUrl);
    // Infer listingType from req.path
    let listingType;
    if (req.path.startsWith('/flat')) {
      listingType = 'flat';
    } else if (req.path.startsWith('/pg')) {
      listingType = 'pg';
    } else {
      console.log('Ownership middleware - invalid listing type');
      return res.status(400).json({ message: 'Invalid listing type' });
    }
    console.log('Ownership middleware - listingType:', listingType);

    const listingId = req.params.id;

    let listing;
    if (listingType === 'flat') {
      listing = await FlatListing.findById(listingId);
    } else if (listingType === 'pg') {
      listing = await PGListing.findById(listingId);
    }

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to modify this listing' });
    }

    next();
  } catch (error) {
    console.error('Ownership check error:', error);
    res.status(500).json({ message: 'Server error during ownership check' });
  }
}

module.exports = { checkListingOwnership };
