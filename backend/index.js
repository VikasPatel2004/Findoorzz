require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection setup
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/findoorz';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(express.json());

// Import auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Import listings routes
const listingsRoutes = require('./routes/listings');
app.use('/api/listings', listingsRoutes);

// Import bookings routes
const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);

// Import payment routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

// Import review routes
const reviewRoutes = require('./routes/review');
app.use('/api/reviews', reviewRoutes);

// Import notification routes
const notificationRoutes = require('./routes/notification');
app.use('/api/notifications', notificationRoutes);

// Placeholder route
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
