const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const FlatListing = require('../models/FlatListing');
const Booking = require('../models/Booking');

let token;
let userId;
let listingId;

describe('Bookings API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/findoorz_test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user and get token
    const user = new User({ name: 'Booking User', email: 'bookinguser@example.com' });
    await user.setPassword('password123');
    await user.save();
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bookinguser@example.com', password: 'password123' });
    token = res.body.token;

    // Create a flat listing for booking
    const listing = new FlatListing({
      title: 'Booking Test Flat',
      description: 'Flat for booking test',
      pricePerNight: 1000,
      location: 'Test City',
      gstPercentage: 18,
      owner: userId,
    });
    await listing.save();
    listingId = listing._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await FlatListing.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  test('Create booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        listingType: 'flat',
        listingId: listingId,
        bookingStartDate: '2024-07-01',
        bookingEndDate: '2024-07-10',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.listingType).toBe('flat');
    expect(res.body.user).toBe(userId.toString());
  });

  test('Get user bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Cancel booking', async () => {
    const bookings = await Booking.find({ user: userId });
    const bookingId = bookings[0]._id;

    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Booking cancelled');
  });
});
