const mongoose = require('mongoose');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');
const User = require('../models/User');
const Notification = require('../models/Notification');
const dotenv = require('dotenv');

dotenv.config();

async function addSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Create a sample user
    const user = new User({
      name: 'Sample User',
      email: 'sample@example.com'
    });
    await user.setPassword('password123');
    await user.save();
    console.log('Created sample user:', user._id);

    // Add sample flat listings
    const flatListings = [
      {
        landlordName: 'John Doe',
        contactNumber: '1234567890',
        houseNumber: 'A-101',
        colony: 'Green Park',
        city: 'Delhi',
        numberOfRooms: 2,
        furnishingStatus: 'Furnished',
        wifi: true,
        airConditioning: true,
        independent: false,
        rentAmount: 15000,
        propertyImages: ['https://example.com/image1.jpg'],
        description: 'Beautiful 2BHK apartment in Green Park',
        owner: user._id
      },
      {
        landlordName: 'Jane Smith',
        contactNumber: '0987654321',
        houseNumber: 'B-205',
        colony: 'Koramangala',
        city: 'Bangalore',
        numberOfRooms: 3,
        furnishingStatus: 'Semi-Furnished',
        wifi: true,
        airConditioning: false,
        independent: true,
        rentAmount: 25000,
        propertyImages: ['https://example.com/image2.jpg'],
        description: 'Spacious 3BHK independent house',
        owner: user._id
      }
    ];

    for (const listingData of flatListings) {
      const listing = new FlatListing(listingData);
      await listing.save();
      console.log('Created flat listing:', listing._id);
    }

    // Add sample PG listings
    const pgListings = [
      {
        landlordName: 'Ramesh Kumar',
        contactNumber: '1122334455',
        houseNumber: 'PG-1',
        colony: 'Indiranagar',
        city: 'Bangalore',
        numberOfRooms: '2',
        furnishingStatus: 'Furnished',
        wifi: true,
        airConditioning: true,
        independent: false,
        rentAmount: '8000',
        propertyImages: ['https://example.com/pg1.jpg'],
        description: 'Cozy PG accommodation for students',
        owner: user._id
      },
      {
        landlordName: 'Priya Sharma',
        contactNumber: '5566778899',
        houseNumber: 'PG-2',
        colony: 'HSR Layout',
        city: 'Bangalore',
        numberOfRooms: '1',
        furnishingStatus: 'Unfurnished',
        wifi: false,
        airConditioning: false,
        independent: true,
        rentAmount: '6000',
        propertyImages: ['https://example.com/pg2.jpg'],
        description: 'Budget-friendly PG accommodation',
        owner: user._id
      }
    ];

    for (const listingData of pgListings) {
      const listing = new PGListing(listingData);
      await listing.save();
      console.log('Created PG listing:', listing._id);
    }

    console.log('Sample data added successfully!');
    console.log('Sample user email: sample@example.com');
    console.log('Sample user password: password123');

  } catch (error) {
    console.error('Error adding sample data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

addSampleData(); 