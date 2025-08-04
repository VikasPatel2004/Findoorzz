const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listingType: { type: String, enum: ['FlatListing', 'PGListing'], required: true },
  listingId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'listingType' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingStartDate: { type: Date, required: true },
  bookingEndDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentId: { type: String },
  orderId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
