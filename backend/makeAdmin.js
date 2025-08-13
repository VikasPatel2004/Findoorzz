const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const makeUserAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://vp0552850:patel2004@findoorz.3vcacwq.mongodb.net/test?retryWrites=true&w=majority&appName=Findoorz');
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();
    
    console.log(`Successfully made ${email} an admin user`);
    console.log(`User ID: ${user._id}`);
    console.log(`Admin Status: ${user.isAdmin}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

makeUserAdmin('vp0552850@gmail.com');
