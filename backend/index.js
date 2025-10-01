const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));
app.use(compression()); // Enable gzip compression
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
  'https://findoorz-3fbn.onrender.com', // Render frontend
  'http://localhost:3000', // local React dev
  'http://localhost:5000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cache control middleware
app.use((req, res, next) => {
  // Cache static assets for 1 day
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payment');
const razorpayRoutes = require('./routes/razorpay');
const brokerRoutes = require('./routes/broker');

const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/broker', brokerRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files from the frontend build (adjust path if needed)
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Optimize MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
