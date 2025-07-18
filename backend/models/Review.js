const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  listingType: { type: String, enum: ['flat', 'pg'], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
