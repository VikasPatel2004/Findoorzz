const User = require('../models/User');
const authenticateToken = require('./authMiddleware');

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the token
    await new Promise((resolve, reject) => {
      authenticateToken(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user exists and is admin
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.isAdmin && user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        requiredRole: 'admin',
        userRole: user.role 
      });
    }
    
    // Add admin user info to request
    req.admin = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = requireAdmin;
