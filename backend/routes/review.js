const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Review = require('../models/Review');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules for review creation
const reviewValidationRules = [
  body('listingType').notEmpty().withMessage('Listing type is required'),
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
    const { listingType, listingId, rating, comment } = req.body;
    
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
    
    // Populate user information
    await review.populate('user', 'name');
    
    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
});

// Get reviews for a listing with user information
router.get('/:listingType/:listingId', async (req, res) => {
  try {
    const { listingType, listingId } = req.params;
    const reviews = await Review.find({ listingType, listingId })
      .populate('user', 'name')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
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
