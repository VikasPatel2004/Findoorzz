const mongoose = require('mongoose');

const flatListingSchema = new mongoose.Schema({
  landlordName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  houseNumber: { type: String, required: true },
  colony: { type: String, required: true },
  city: { type: String, required: true },
  bhk: { type: String, enum: ['1BHK', '2BHK', '3BHK'], required: true },
  furnishingStatus: { 
    type: String, 
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'], 
    required: true 
  },
  wifi: { type: Boolean, default: false },
  airConditioning: { type: Boolean, default: false },
  independent: { type: Boolean, default: false },
  rentAmount: { type: Number, required: true, min: 0 },
  propertyImages: [{ type: String }], // store image URLs or paths
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booked: { type: Boolean, default: false }, // Indicates if the listing is booked
  reviewStatus: { type: String, enum: ['available', 'under_review', 'broker_assigned', 'confirmed'], default: 'available' },
  assignedBroker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Add indexes for better query performance
flatListingSchema.index({ city: 1 });
flatListingSchema.index({ colony: 1 });
flatListingSchema.index({ rentAmount: 1 });
flatListingSchema.index({ bhk: 1 });
flatListingSchema.index({ owner: 1 });
flatListingSchema.index({ createdAt: -1 });
flatListingSchema.index({ city: 1, colony: 1 });
flatListingSchema.index({ city: 1, rentAmount: 1 });

module.exports = mongoose.model('FlatListing', flatListingSchema);
