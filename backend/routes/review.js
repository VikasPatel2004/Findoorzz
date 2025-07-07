const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const User = require('../models/User');
const PGListing = require('../models/PGListing');
const FlatListing = require('../models/FlatListing');
const Notification = require('../models/Notification');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules for review creation
const reviewValidationRules = [
  body('listingId').notEmpty().withMessage('Listing ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a string'),
];

// Create a new review
router.post('/', authenticateToken, reviewValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { listingId, rating, comment } = req.body;
    
    // Determine listing type by checking both collections
    let listingType = null;
    let listing = await PGListing.findById(listingId);
    if (listing) {
      listingType = 'pg';
    } else {
      listing = await FlatListing.findById(listingId);
      if (listing) {
        listingType = 'flat';
      }
    }
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({
      listingType,
      listingId,
      user: req.user.userId
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this listing' });
    }
    
    const reviewData = {
      listingType,
      listingId,
      user: req.user.userId,
      rating,
      comment
    };
    
    const review = new Review(reviewData);
    await review.save();

    // Notification logic
    let ownerId;
    let type;
    if (listingType === 'pg') {
      const pg = await PGListing.findById(listingId);
      if (pg) {
        ownerId = pg.owner;
        type = 'Landlord';
      }
    } else if (listingType === 'flat') {
      const flat = await FlatListing.findById(listingId);
      if (flat) {
        ownerId = flat.owner;
        type = 'Lender';
      }
    }
    if (ownerId && type) {
      await Notification.create({
        user: ownerId,
        message: `New review posted for your ${listingType.toUpperCase()} listing!`,
        type: type
      });
    }
    
    // Populate user information
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
});

// Get reviews for a listing with user information
router.get('/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Find reviews for this listing (check both PG and Flat listings)
    const reviews = await Review.find({ listingId })
      .populate('user', 'name')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

// Get average rating for a listing
router.get('/:listingId/average', async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const result = await Review.aggregate([
      { $match: { listingId } },
      { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);
    
    if (result.length === 0) {
      return res.json({ averageRating: 0, totalReviews: 0 });
    }
    
    res.json({
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      totalReviews: result[0].totalReviews
    });
  } catch (err) {
    console.error('Error fetching average rating:', err);
    res.status(500).json({ message: 'Error fetching average rating', error: err.message });
  }
});

// Get user's reviews
router.get('/user/reviews', authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.userId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ message: 'Error fetching user reviews', error: err.message });
  }
});

// Update a review (only by the review author)
router.put('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only edit your own reviews' });
    }
    
    review.rating = rating;
    review.comment = comment;
    await review.save();
    
    await review.populate('user', 'name');
    res.json(review);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
});

// Delete a review (only by the review author)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }
    
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
});

module.exports = router;
