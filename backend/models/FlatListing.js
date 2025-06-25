const mongoose = require('mongoose');

const flatListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pricePerNight: Number,
  location: String,
  gstPercentage: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FlatListing', flatListingSchema);
