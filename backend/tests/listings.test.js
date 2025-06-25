const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const User = require('../models/User');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');

let token;
let userId;

describe('Listings API', () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/findoorz_test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user and get token
    const user = new User({ name: 'Listing User', email: 'listinguser@example.com' });
    await user.setPassword('password123');
    await user.save();
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'listinguser@example.com', password: 'password123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await FlatListing.deleteMany({});
    await PGListing.deleteMany({});
    await mongoose.connection.close();
  });

  test('Create flat listing', async () => {
    const res = await request(app)
      .post('/api/listings/flat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Flat',
        description: 'A nice flat',
        pricePerNight: 1000,
        location: 'Test City',
        gstPercentage: 18,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Test Flat');
    expect(res.body.owner).toBe(userId.toString());
  });

  test('Get all flat listings', async () => {
    const res = await request(app)
      .get('/api/listings/flat');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Update flat listing by owner', async () => {
    const listings = await FlatListing.find({ owner: userId });
    const listingId = listings[0]._id;

    const res = await request(app)
      .put(`/api/listings/flat/${listingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ pricePerNight: 1200 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.pricePerNight).toBe(1200);
  });

  test('Delete flat listing by owner', async () => {
    const listings = await FlatListing.find({ owner: userId });
    const listingId = listings[0]._id;

    const res = await request(app)
      .delete(`/api/listings/flat/${listingId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Listing deleted');
  });

  // Similar tests can be added for PG listings
});
