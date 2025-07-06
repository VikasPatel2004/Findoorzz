const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [emailRegex, 'Please fill a valid email address'] 
  },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String }, // URL to the profile picture
}, { timestamps: true });

// Method to set password hash
userSchema.methods.setPassword = async function(password) {
  const saltRounds = 10;
  this.passwordHash = await bcrypt.hash(password, saltRounds);
};

// Method to validate password
userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.passwordHash);
};

// Create index on email for uniqueness and performance
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
