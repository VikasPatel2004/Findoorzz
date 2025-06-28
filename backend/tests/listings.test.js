const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const FlatListing = require('../models/FlatListing');
const PGListing = require('../models/PGListing');

jest.mock('../config/cloudinary', () => ({
  uploader: {
    upload_stream: (options, callback) => {
      // Simulate successful upload with a fixed URL
      process.nextTick(() => callback(null, { secure_url: 'http://mocked.url/image.jpg' }));
      return {
        end: () => {}
      };
    }
  }
}));

let token;
let userId;

describe('Listings API', () => {
  let flatListingId;
  let pgListingId;

  beforeAll(async () => {
    jest.setTimeout(30000);
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
      .field('landlordName', 'John Doe')
      .field('contactNumber', '1234567890')
      .field('houseNumber', '123')
      .field('colony', 'Test Colony')
      .field('city', 'Test City')
      .field('numberOfRooms', 3)
      .field('furnishingStatus', 'Furnished')
      .field('wifi', true)
      .field('airConditioning', true)
      .field('rentAmount', 15000)
      .field('independent', false)
      .field('description', 'A nice flat')
      .attach('propertyImages', Buffer.from('test file content'), 'image1.jpg')
      .attach('propertyImages', Buffer.from('test file content'), 'image2.jpg')
      .field('owner', userId.toString());
    expect(res.statusCode).toEqual(201);
    expect(res.body.owner).toBe(userId.toString());
    flatListingId = res.body._id;
  });

  test('Get all flat listings', async () => {
    const res = await request(app)
      .get('/api/listings/flat');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.listings)).toBe(true);
  });

  test('Update flat listing by owner', async () => {
    if (!flatListingId) {
      // Create flat listing if not exists
      const resCreate = await request(app)
        .post('/api/listings/flat')
        .set('Authorization', `Bearer ${token}`)
        .field('landlordName', 'John Doe')
        .field('contactNumber', '1234567890')
        .field('houseNumber', '123')
        .field('colony', 'Test Colony')
        .field('city', 'Test City')
        .field('numberOfRooms', 3)
        .field('furnishingStatus', 'Furnished')
        .field('wifi', true)
        .field('airConditioning', true)
        .field('rentAmount', 15000)
        .field('independent', false)
        .field('description', 'A nice flat')
        .attach('propertyImages', Buffer.from('test file content'), 'image1.jpg')
        .attach('propertyImages', Buffer.from('test file content'), 'image2.jpg')
        .field('owner', userId.toString());
      flatListingId = resCreate.body._id;
    }

    const res = await request(app)
      .put(`/api/listings/flat/${flatListingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rentAmount: 16000 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.rentAmount).toBe(16000);
  });

  test('Delete flat listing by owner', async () => {
    if (!flatListingId) {
      // Create flat listing if not exists
      const resCreate = await request(app)
        .post('/api/listings/flat')
        .set('Authorization', `Bearer ${token}`)
        .field('landlordName', 'John Doe')
        .field('contactNumber', '1234567890')
        .field('houseNumber', '123')
        .field('colony', 'Test Colony')
        .field('city', 'Test City')
        .field('numberOfRooms', 3)
        .field('furnishingStatus', 'Furnished')
        .field('wifi', true)
        .field('airConditioning', true)
        .field('rentAmount', 15000)
        .field('independent', false)
        .field('description', 'A nice flat')
        .attach('propertyImages', Buffer.from('test file content'), 'image1.jpg')
        .attach('propertyImages', Buffer.from('test file content'), 'image2.jpg')
        .field('owner', userId.toString());
      flatListingId = resCreate.body._id;
    }

    const res = await request(app)
      .delete(`/api/listings/flat/${flatListingId}`)
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
        .field('landlordName', 'Jane Smith')
        .field('contactNumber', '0987654321')
        .field('houseNumber', '456')
        .field('colony', 'PG Colony')
        .field('city', 'PG City')
        .field('numberOfRooms', 2)
        .field('furnishingStatus', 'Semi-Furnished')
        .field('wifi', false)
        .field('airConditioning', false)
        .field('rentAmount', 12000)
        .field('independent', true)
        .field('description', 'A nice PG')
        .attach('propertyImages', Buffer.from('test file content'), 'pg1.jpg')
        .attach('propertyImages', Buffer.from('test file content'), 'pg2.jpg')
        .field('owner', userId.toString());
      expect(res.statusCode).toEqual(201);
      expect(res.body.owner).toBe(userId.toString());
      pgListingId = res.body._id;
    });

    test('Get all PG listings', async () => {
      const res = await request(app)
        .get('/api/listings/pg');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

  test('Update PG listing by owner', async () => {
    if (!pgListingId) {
      // Create PG listing if not exists
      const resCreate = await request(app)
        .post('/api/listings/pg')
        .set('Authorization', `Bearer ${token}`)
        .field('landlordName', 'Jane Smith')
        .field('contactNumber', '0987654321')
        .field('houseNumber', '456')
        .field('colony', 'PG Colony')
        .field('city', 'PG City')
        .field('numberOfRooms', 2)
        .field('furnishingStatus', 'Semi-Furnished')
        .field('wifi', false)
        .field('airConditioning', false)
        .field('rentAmount', 12000)
        .field('independent', true)
        .field('description', 'A nice PG')
        .attach('propertyImages', Buffer.from('test file content'), 'pg1.jpg')
        .attach('propertyImages', Buffer.from('test file content'), 'pg2.jpg')
        .field('owner', userId.toString());
      console.log('Created PG listing:', resCreate.body);
      pgListingId = resCreate.body._id;
    }

    const res = await request(app)
      .put(`/api/listings/pg/${pgListingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ rentAmount: 13000 });
    console.log('Update PG listing response:', res.statusCode, res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.rentAmount).toBe(13000);
  });

    test('Delete PG listing by owner', async () => {
      if (!pgListingId) {
        // Create PG listing if not exists
        const resCreate = await request(app)
          .post('/api/listings/pg')
          .set('Authorization', `Bearer ${token}`)
          .field('landlordName', 'Jane Smith')
          .field('contactNumber', '0987654321')
          .field('houseNumber', '456')
          .field('colony', 'PG Colony')
          .field('city', 'PG City')
          .field('numberOfRooms', 2)
          .field('furnishingStatus', 'Semi-Furnished')
          .field('wifi', false)
          .field('airConditioning', false)
          .field('rentAmount', 12000)
          .field('independent', true)
          .field('description', 'A nice PG')
          .attach('propertyImages', Buffer.from('test file content'), 'pg1.jpg')
          .attach('propertyImages', Buffer.from('test file content'), 'pg2.jpg')
          .field('owner', userId.toString());
        pgListingId = resCreate.body._id;
      }

      const res = await request(app)
        .delete(`/api/listings/pg/${pgListingId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Listing deleted');
    });
  });
});
