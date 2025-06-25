const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const Review = require('../models/Review');

let token;
let userId;
let reviewId;

describe('Reviews API', () => {
  beforeAll(async () => {
    await connectTestDB();

    // Create a user and get token
    const user = new User({ name: 'Review User', email: 'reviewuser@example.com' });
    await user.setPassword('password123');
    await user.save();
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'reviewuser@example.com', password: 'password123' });
    token = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Review.deleteMany({});
    await closeTestDB();
  });

  test('Create review', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({
        listingType: 'flat',
        listingId: userId, // Using userId as dummy listingId for test
        rating: 5,
        comment: 'Great place!',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.rating).toBe(5);
    expect(res.body.user).toBe(userId.toString());
    reviewId = res.body._id;
  });

  test('Get reviews for listing', async () => {
    const res = await request(app)
      .get(`/api/reviews/flat/${userId}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
