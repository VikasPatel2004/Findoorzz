const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/findoorz';

async function listUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find all users
    const users = await User.find({}, 'name email role isAdmin createdAt');
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      process.exit(1);
    }
    
    console.log(`\n📋 Found ${users.length} user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Role: ${user.role}`);
      console.log(`   🔑 Admin: ${user.isAdmin ? '✅ Yes' : '❌ No'}`);
      console.log(`   📅 Created: ${user.createdAt?.toLocaleDateString() || 'Unknown'}`);
      console.log('');
    });
    
    const adminUsers = users.filter(u => u.isAdmin || u.role === 'admin');
    console.log(`\n🛠️  Admin users: ${adminUsers.length}`);
    if (adminUsers.length > 0) {
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listUsers();
