const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

let token;
let userId;
let bookingId;

describe('Payments API', () => {
  beforeAll(async () => {
    await connectTestDB();

    // Create a user and get token
    const user = new User({ name: 'Payment User', email: 'paymentuser@example.com' });
    await user.setPassword('password123');
    await user.save();
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'paymentuser@example.com', password: 'password123' });
    token = res.body.token;

    // Create a booking for payment
    const booking = new Booking({
      listingType: 'FlatListing',
      listingId: userId, // For test, using userId as dummy listingId
      user: userId,
      bookingStartDate: '2024-07-01',
      bookingEndDate: '2024-07-10',
    });
    await booking.save();
    bookingId = booking._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await closeTestDB();
  });

  test('Create payment', async () => {
    const res = await request(app)
      .post('/api/payments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        booking: bookingId,
        amount: 1000,
        paymentMethod: 'credit_card',
        paymentStatus: 'completed',
        transactionId: 'txn_123456',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.amount).toBe(1000);
    expect(res.body.user).toBe(userId.toString());
  });

  test('Get user payments', async () => {
    const res = await request(app)
      .get('/api/payments')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
