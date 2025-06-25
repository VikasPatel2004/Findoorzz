const request = require('supertest');
const app = require('../index');
const { connectTestDB, closeTestDB } = require('./setupTestDB');
const User = require('../models/User');
const Notification = require('../models/Notification');

let token;
let userId;
let notificationId;

describe('Notifications API', () => {
  beforeAll(async () => {
    await connectTestDB();

    // Create a user and get token
    const user = new User({ name: 'Notification User', email: 'notificationuser@example.com' });
    await user.setPassword('password123');
    await user.save();
    userId = user._id;

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'notificationuser@example.com', password: 'password123' });
    token = res.body.token;

    // Create a notification for user
    const notification = new Notification({
      user: userId,
      message: 'Test notification',
      read: false,
    });
    await notification.save();
    notificationId = notification._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Notification.deleteMany({});
    await closeTestDB();
  });

  test('Get user notifications', async () => {
    const res = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Mark notification as read', async () => {
    const res = await request(app)
      .put(`/api/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.read).toBe(true);
  });
});
