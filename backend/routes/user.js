const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

// GET /api/user/profile - Get current user's profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile', error: err.message });
  }
});

module.exports = router; 