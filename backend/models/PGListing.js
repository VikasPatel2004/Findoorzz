const mongoose = require('mongoose');

const pgListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pricePerNight: Number,
  location: String,
  gstPercentage: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PGListing', pgListingSchema);
