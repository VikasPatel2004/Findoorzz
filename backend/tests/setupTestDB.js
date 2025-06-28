const mongoose = require('mongoose');

const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/findoorz_test';
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB test database');
    } catch (error) {
      console.error('Error connecting to MongoDB test database:', error);
      throw error;
    }
  }
};

const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      console.log('Disconnected from MongoDB test database');
    } catch (error) {
      console.error('Error disconnecting from MongoDB test database:', error);
      throw error;
    }
  }
};

module.exports = { connectTestDB, closeTestDB };
