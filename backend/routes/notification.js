const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const Notification = require('../models/Notification');
const { param, validationResult } = require('express-validator');

const router = express.Router();

// Get notifications for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
});

// Mark notification as read
router.put('/:id/read',
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid notification ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const notification = await Notification.findById(req.params.id);
      if (!notification) return res.status(404).json({ message: 'Notification not found' });
      if (notification.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      notification.read = true;
      await notification.save();
      res.json(notification);
    } catch (err) {
      res.status(500).json({ message: 'Error updating notification', error: err.message });
    }
  }
);

module.exports = router;
