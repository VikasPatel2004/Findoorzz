const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticateToken = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const upload = require('../middleware/multer');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register new user
router.post('/register',
  [
    body('name')
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
      .isLength({ max: 20 }).withMessage('Username must be less than 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character (!@#$%^&*)'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = {};
      errors.array().forEach(error => {
        if (!formattedErrors[error.path]) {
          formattedErrors[error.path] = [];
        }
        formattedErrors[error.path].push(error.msg);
      });
      return res.status(400).json({ errors: formattedErrors });
    }
    try {
      const { name, email, password } = req.body;
      
      // Check for existing user by email
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(409).json({ 
          errors: { email: ['This email is already registered'] }
        });
      }
      
      // Check for existing user by username
      const existingUserByName = await User.findOne({ name });
      if (existingUserByName) {
        return res.status(409).json({ 
          errors: { name: ['This username is already taken'] }
        });
      }
      
      const user = new User({ name, email });
      await user.setPassword(password);
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// Social login endpoint
router.post('/social-login', async (req, res) => {
  const { token } = req.body;
  console.log('Received social login token:', token);
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('Google token payload:', payload);
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, profilePicture: picture });
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Social login error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Login user
router.post('/login', 
  [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = {};
      errors.array().forEach(error => {
        if (!formattedErrors[error.path]) {
          formattedErrors[error.path] = [];
        }
        formattedErrors[error.path].push(error.msg);
      });
      return res.status(400).json({ errors: formattedErrors });
    }
    
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);
      
      const user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('No user found with email:', email);
        return res.status(401).json({ 
          errors: { email: ['No account found with this email address'] }
        });
      }
      
      const isValidPassword = await user.validatePassword(password);
      console.log('Password validation result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ 
          errors: { password: ['Incorrect password'] }
        });
      }
      
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.json({
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          profilePicture: user.profilePicture 
        } 
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash -salt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePicture: user.profilePicture
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { name, email, phone, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) {
      await user.setPassword(password);
    }

    // Handle profile picture upload
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'auto',
              folder: 'profile-pictures',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        user.profilePicture = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading profile picture:', uploadError);
        return res.status(500).json({ message: 'Error uploading profile picture' });
      }
    }

    await user.save();
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
