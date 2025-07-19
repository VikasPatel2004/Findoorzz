const mongoose = require('mongoose');

const pgListingSchema = new mongoose.Schema({
  landlordName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  houseNumber: { type: String, required: true },
  colony: { type: String, required: true },
  city: { type: String, required: true },
  numberOfRooms: { type: String, required: true, min: 1 },
  furnishingStatus: { 
    type: String, 
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], 
    required: true 
  },
  wifi: { type: Boolean, default: false },
  airConditioning: { type: Boolean, default: false },
  rentAmount: { type: Number, required: true, min: 0 },
  independent: { type: Boolean, default: false },
  propertyImages: [{ type: String }], // store image URLs or paths
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Add indexes for better query performance
pgListingSchema.index({ type: 1 });
pgListingSchema.index({ city: 1 });
pgListingSchema.index({ colony: 1 });
pgListingSchema.index({ rentAmount: 1 });
pgListingSchema.index({ gender: 1 });
pgListingSchema.index({ owner: 1 });
pgListingSchema.index({ createdAt: -1 });
pgListingSchema.index({ city: 1, colony: 1 });
pgListingSchema.index({ city: 1, rentAmount: 1 });
pgListingSchema.index({ type: 1, city: 1, rentAmount: 1 });

module.exports = mongoose.model('PGListing', pgListingSchema);
