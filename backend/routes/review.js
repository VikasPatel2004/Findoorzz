const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Review = require('../models/Review');

const router = express.Router();

// Create a new review
router.post('/', authenticateToken, async (req, res) => {
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
