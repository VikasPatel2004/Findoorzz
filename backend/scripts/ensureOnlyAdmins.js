const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/findoorz';

const admins = [
  { name: 'VP055', email: 'vp0552850@gmail.com' },
  { name: 'Findoorz', email: 'findoorz@gmail.com' }
];

async function ensureOnlyAdmins() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Remove admin from all other users
  await User.updateMany(
    { email: { $nin: admins.map(a => a.email) } },
    { $set: { role: 'student', isAdmin: false } }
  );

  // Ensure both specified emails are admins
  for (const admin of admins) {
    let user = await User.findOne({ email: admin.email });
    if (!user) {
      user = new User({ name: admin.name, email: admin.email, role: 'admin', isAdmin: true });
      // Set a default password (should be changed later)
      await user.setPassword('DefaultPassword123!');
      await user.save();
      console.log(`Created admin user: ${admin.email}`);
    } else {
      await User.findByIdAndUpdate(user._id, { role: 'admin', isAdmin: true });
      console.log(`Updated admin user: ${admin.email}`);
    }
  }

  console.log('✅ Only specified emails are admins.');
  process.exit(0);
}

ensureOnlyAdmins().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
