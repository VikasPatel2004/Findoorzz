const mongoose = require('mongoose');

const flatListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  landlordName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  houseNumber: { type: String, required: true },
  colony: { type: String, required: true },
  city: { type: String, required: true },
  numberOfRooms: { type: Number, required: true, min: 1 },
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
  idProof: { type: String }, // store file path or URL
  ownershipProof: { type: String }, // store file path or URL
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Indexes for performance
flatListingSchema.index({ owner: 1 });
flatListingSchema.index({ city: 1 });
flatListingSchema.index({ rentAmount: 1 });

module.exports = mongoose.model('FlatListing', flatListingSchema);
