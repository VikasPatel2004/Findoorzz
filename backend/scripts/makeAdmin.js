const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/findoorz';

async function makeUserAdmin(email) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ User with email "${email}" not found!`);
      console.log('\n📋 Available users:');
      const allUsers = await User.find({}, 'name email role isAdmin');
      allUsers.forEach(u => {
        console.log(`   - ${u.name} (${u.email}) - Role: ${u.role}, Admin: ${u.isAdmin}`);
      });
      process.exit(1);
    }
    
    console.log(`📧 Found user: ${user.name} (${user.email})`);
    console.log(`   Current role: ${user.role}`);
    console.log(`   Current isAdmin: ${user.isAdmin}`);
    
    // Update user to admin
    await User.findByIdAndUpdate(user._id, {
      role: 'admin',
      isAdmin: true
    });
    
    console.log(`✅ Successfully made ${user.name} an admin!`);
    console.log(`   New role: admin`);
    console.log(`   New isAdmin: true`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js admin@example.com');
  process.exit(1);
}

makeUserAdmin(email);
