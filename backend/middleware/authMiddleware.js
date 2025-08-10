const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header received:', authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('Access token missing in request');
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Token verified successfully for user:', decoded);

    // Normalize user object to always include req.user.id and req.user.userId
    req.user = {
      id: decoded.userId || decoded.id,
      userId: decoded.userId || decoded.id, // For compatibility with booking routes
      email: decoded.email, // optional, if you include email in token
      role: decoded.role    // optional, if you include role in token
    };

    next();
  });
}

module.exports = authenticateToken;