const mongoose = require('mongoose');

const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/findoorz_test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
};

module.exports = { connectTestDB, closeTestDB };
