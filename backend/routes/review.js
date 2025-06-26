const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Review = require('../models/Review');
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
    const reviewData = { ...req.body, user: req.user.userId };
    const review = new Review(reviewData);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error creating review', error: err.message });
  }
});

// Get reviews for a listing
router.get('/:listingType/:listingId', async (req, res) => {
  try {
    const { listingType, listingId } = req.params;
    const reviews = await Review.find({ listingType, listingId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});

module.exports = router;
