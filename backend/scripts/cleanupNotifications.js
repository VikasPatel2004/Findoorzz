// Script to delete notifications older than 21 days
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const dotenv = require('dotenv');
dotenv.config();

async function cleanupOldNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const cutoffDate = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000); // 21 days ago
    const result = await Notification.deleteMany({ createdAt: { $lt: cutoffDate } });
    console.log(`Deleted ${result.deletedCount} notifications older than 21 days.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error cleaning up notifications:', err);
    process.exit(1);
  }
}

cleanupOldNotifications(); 