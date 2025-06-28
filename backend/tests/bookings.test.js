const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const FlatListing = require('../models/FlatListing');
const Booking = require('../models/Booking');

let token;
let userId;
let listingId;

describe('Bookings API', () => {
  let bookingId;

  beforeAll(async () => {
    await connectTestDB();

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
      rentAmount: 15000,
      furnishingStatus: 'Furnished',
      numberOfRooms: 3,
      city: 'Test City',
      colony: 'Test Colony',
      houseNumber: '123',
      contactNumber: '1234567890',
      landlordName: 'John Doe',
      owner: userId,
    });
    await listing.save();
    listingId = listing._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await FlatListing.deleteMany({});
    await Booking.deleteMany({});
    await closeTestDB();
  });

  test('Create booking', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        listingType: 'FlatListing',
        listingId: listingId,
        bookingStartDate: '2024-07-01',
        bookingEndDate: '2024-07-10',
      });
    console.log('Create booking response:', res.statusCode, res.body);
    expect(res.statusCode).toEqual(201);
    expect(res.body.listingType).toBe('FlatListing');
    expect(res.body.user).toBe(userId.toString());
    bookingId = res.body._id;
  });

  test('Get user bookings', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Cancel booking', async () => {
    if (!bookingId) {
      // Create a booking if not exists
      const resCreate = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          listingType: 'FlatListing',
          listingId: listingId,
          bookingStartDate: '2024-07-01',
          bookingEndDate: '2024-07-10',
        });
      bookingId = resCreate.body._id;
    }

    const res = await request(app)
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Booking cancelled');
  });
});
