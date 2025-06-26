const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');

let token;
let userId;

describe('Listings API', () => {
  beforeAll(async () => {
    await connectTestDB();

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
    await closeTestDB();
  });

  test('Create flat listing', async () => {
    const res = await request(app)
      .post('/api/listings/flat')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Flat',
        landlordName: 'John Doe',
        contactNumber: '1234567890',
        houseNumber: '123',
        colony: 'Test Colony',
        city: 'Test City',
        numberOfRooms: 3,
        furnishingStatus: 'Furnished',
        wifi: true,
        airConditioning: true,
        rentAmount: 15000,
        independent: false,
        propertyImages: ['image1.jpg', 'image2.jpg'],
        description: 'A nice flat',
        idProof: 'idproof.jpg',
        ownershipProof: 'ownershipproof.jpg',
        owner: userId,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Test Flat');
    expect(res.body.owner).toBe(userId.toString());
  });

  test('Get all flat listings', async () => {
    const res = await request(app)
      .get('/api/listings/flat');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.listings)).toBe(true);
  });

  test('Update flat listing by owner', async () => {
    const listings = await FlatListing.find({ owner: userId });
    const listingId = listings[0]._id;

    const res = await request(app)
      .put(`/api/listings/flat/${listingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rentAmount: 16000 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.rentAmount).toBe(16000);
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

  // Tests for PG listings
  describe('PG Listings', () => {
    test('Create PG listing', async () => {
      const res = await request(app)
        .post('/api/listings/pg')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test PG',
          landlordName: 'Jane Smith',
          contactNumber: '0987654321',
          houseNumber: '456',
          colony: 'PG Colony',
          city: 'PG City',
          numberOfRooms: 2,
          furnishingStatus: 'Semi-Furnished',
          wifi: false,
          airConditioning: false,
          rentAmount: 12000,
          independent: true,
          propertyImages: ['pg1.jpg', 'pg2.jpg'],
          description: 'A nice PG',
          idProof: 'idproof_pg.jpg',
          ownershipProof: 'ownershipproof_pg.jpg',
          owner: userId,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.title).toBe('Test PG');
      expect(res.body.owner).toBe(userId.toString());
    });

    test('Get all PG listings', async () => {
      const res = await request(app)
        .get('/api/listings/pg');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('Update PG listing by owner', async () => {
      const listings = await PGListing.find({ owner: userId });
      const listingId = listings[0]._id;

      const res = await request(app)
        .put(`/api/listings/pg/${listingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rentAmount: 13000 });
      expect(res.statusCode).toEqual(200);
      expect(res.body.rentAmount).toBe(13000);
    });

    test('Delete PG listing by owner', async () => {
      const listings = await PGListing.find({ owner: userId });
      const listingId = listings[0]._id;

      const res = await request(app)
        .delete(`/api/listings/pg/${listingId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Listing deleted');
    });
  });
});
