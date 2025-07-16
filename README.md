## 1 · Project Overview

Findoorzz is a full-stack rental management platform that streamlines listing, booking, payment and review workflows for PGs and flats. It bridges landlords, brokers, students and long-term renters through a unified portal.

### Problems Addressed
- Fragmented listing channels with inconsistent availability  
- Manual booking coordination and payment reconciliation  
- Lack of transparent tenant reviews and ratings  
- Delayed notifications for inquiries and bookings  

### Key Features
- **PG & Flat Listings**  
  Create, search and filter multi-unit accommodations with photos, amenities and location map integration.  
- **Booking Management**  
  Instant booking requests, availability calendars and booking confirmation flows.  
- **Razorpay Payments**  
  Secure, PCI-compliant payment integration for rent, deposits and advance fees (see RAZORPAY_SETUP.md).  
- **Reviews & Ratings**  
  Tenant feedback collection and display to boost trust and transparency.  
- **Real-time Notifications**  
  Email and in-app alerts for new inquiries, booking status changes and payment receipts.  

### Tech Stack
- **Backend**: Node.js, Express, MongoDB with Mongoose ORM, PM2 process manager  
- **Frontend**: React, Vite, Tailwind CSS, ESLint & HMR support (see frontend/README.md)  
- **Deployment**: Netlify for frontend, PM2 on VPS for API, Nginx reverse proxy  
- **Performance**: Image optimization, API caching, DB indexing and gzip compression (see PERFORMANCE_OPTIMIZATION.md)  

### Primary Use Cases
- **Landlords** publish multiple properties, manage availability and collect online payments.  
- **Renters** search listings, compare amenities and book instantly.  
- **Students** find shared accommodations with roommate matching and review insights.  
- **Brokers** list client properties, track leads and receive commission payouts.
## 2 · Getting Started

Follow these steps to clone the repo, install dependencies, seed data, and run your first booking flow in the browser.

### 2.1 Prerequisites
• Node.js v14 or later  
• MongoDB (local or remote URI)  
• (Optional) Razorpay test account for payment simulation  

### 2.2 Clone & Install

1. Clone the repository  
```bash
git clone https://github.com/VikasPatel2004/Findoorzz.git
cd Findoorzz
```

2. Install backend dependencies  
```bash
cd backend
npm install
```

3. Install frontend dependencies  
```bash
cd ../frontend
npm install
```

### 2.3 Configure Environment

In `backend/`, create a `.env` file with:

```dotenv
MONGO_URI=<your MongoDB URI>
JWT_SECRET=<your JWT secret>
EMAIL_USER=<Gmail address for email>
EMAIL_PASS=<Gmail app password or OAuth token>
RAZORPAY_KEY_ID=<your Razorpay key ID>
RAZORPAY_KEY_SECRET=<your Razorpay key secret>
ALLOWED_ORIGINS=http://localhost:3000
```

### 2.4 Seed Sample Data

Populate MongoDB with users and listings for testing:

```bash
cd backend
npm run seed    # Runs scripts/addSampleData.js
```

You should see console logs confirming users and listings creation.

### 2.5 Run Development Servers

Open two terminal windows:

1. Backend  
   ```bash
   cd backend
   npm run dev    # nodemon index.js, watches for changes
   ```

2. Frontend  
   ```bash
   cd frontend
   npm start      # starts React app on http://localhost:3000
   ```

### 2.6 First Booking Flow

1. In your browser, open http://localhost:3000  
2. Register or log in with one of the seeded users (check console for credentials)  
3. Browse “PG Listings” or “Flats” on the home page  
4. Click **View Details** on any listing, then **Book Now**  
5. In the booking form:
   - Enter check-in/check-out dates  
   - Click **Proceed to Payment**  
6. Complete payment using Razorpay’s test card:
   • Card Number: 4111 1111 1111 1111  
   • Expiry: 12/25  CVV: 123  
7. On success you’ll see a confirmation page and receive an email receipt.

### 2.7 Troubleshooting

• CORS errors? Ensure `ALLOWED_ORIGINS` includes `http://localhost:3000` in `.env` and restart the backend.  
• Database connection fails? Verify `MONGO_URI` and that your MongoDB instance is running.  
• Seed script didn’t run? Check that `scripts/addSampleData.js` is executable and that your `.env` is loaded.  
• Payment errors? Confirm Razorpay test keys are correct and network access to api.razorpay.com is allowed.
## 3 · Architecture & Core Concepts

This section explains how Findoorzz’s backend and frontend pieces fit together, highlighting the Express server setup, core data models, authentication flow, payment integration, and optimized image delivery.

### Express Server Initialization and Middleware Configuration

Describe how `backend/index.js` boots the Express app, layers security/performance middleware, mounts routes, handles errors, and connects to MongoDB.

#### 1. Environment and App Setup  
Loads configuration and instantiates Express.

```js
// backend/index.js
require('dotenv').config();
const express = require('express');
const app = express();
```

#### 2. Security & Performance Middleware  
Uses Helmet for secure headers and gzip compression.

```js
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
```

#### 3. CORS Configuration  
Allows origins from `ALLOWED_ORIGINS` or defaults.

```js
const cors = require('cors');
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://yourapp.com', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

#### 4. Body Parsing Limits  
Caps JSON and URL-encoded payloads at 10 MB.

```js
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

#### 5. Static Asset Caching  
Sets one-day cache for common static files.

```js
app.use((req, res, next) => {
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
  next();
});
```

#### 6. Mounting API Routes  
Each feature exports a router. Example:

```js
// Add a new module ‘reports’
const reportsRoutes = require('./routes/reports');
app.use('/api/reports', reportsRoutes);

// Existing mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
// … bookings, payments, razorpay, reviews, notifications, user
```

#### 7. Health Check & Error Handling  
Defines `/api/health`, 500-handler, and 404-handler.

```js
// Health endpoint
app.get('/api/health', (_, res) =>
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
);

// 500-level error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// 404 handler
app.use('*', (req, res) =>
  res.status(404).json({ message: 'Route not found' })
);
```

#### 8. MongoDB Connection & Server Start  
Configures Mongoose and starts the server outside `test` env.

```js
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
```

---

### Booking Model & Polymorphic Listing References

Show how `Booking` references both `FlatListing` and `PGListing` via Mongoose’s `refPath`, and how to create/query bookings.

#### Schema Definition

```js
// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listingType: { 
    type: String, 
    enum: ['FlatListing','PGListing'], 
    required: true 
  },
  listingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'listingType' 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingStartDate: { type: Date, required: true },
  bookingEndDate:   { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending','confirmed','cancelled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
```

#### Creating a Booking

```js
const Booking = require('./models/Booking');

async function createBooking({ listingId, listingType, userId, startDate, endDate }) {
  const booking = new Booking({
    listingType,
    listingId,
    user: userId,
    bookingStartDate: startDate,
    bookingEndDate: endDate
  });
  return await booking.save();
}

// Usage
createBooking({
  listingId: '60e5f9a6c25e4f3f243a1b89',
  listingType: 'FlatListing',
  userId: '60e5fb22d4a2c23b14e3d4c5',
  startDate: new Date('2025-08-01'),
  endDate:   new Date('2025-08-31')
});
```

#### Querying & Populating

```js
async function getBookingWithDetails(bookingId) {
  return await Booking
    .findById(bookingId)
    .populate('user', 'name email')
    .populate('listingId') // resolves against listingType
    .lean();
}
```

#### Filtering by Listing Type

```js
async function getPgBookings(userId) {
  return await Booking
    .find({ user: userId, listingType: 'PGListing' })
    .populate('listingId')
    .exec();
}
```

#### Cascade on Listing Removal

```js
const FlatListing = require('./models/FlatListing');
const Booking     = require('./models/Booking');

flatListingSchema.pre('remove', async function(next) {
  await Booking.updateMany(
    { listingType: 'FlatListing', listingId: this._id },
    { status: 'cancelled' }
  );
  next();
});
```

---

### JWT Authentication Middleware

Verify and decode JWTs on incoming requests, attach `req.user`, and block unauthorized access.

#### Middleware Implementation

```js
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // { userId, email, ... }
    next();
  });
}

module.exports = authenticateToken;
```

#### Usage in Routes

```js
const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
  res.json({ userId: req.user.userId, email: req.user.email });
});
```

#### Issuing Tokens

```js
const token = jwt.sign(
  { userId: user._id, email: user.email },
  JWT_SECRET,
  { expiresIn: '2h' }
);
res.json({ token });
```

---

### Razorpay Integration: Order Creation and Payment Verification

Demonstrate backend order creation, signature verification, webhook handling, and a reusable frontend service.

#### 1. Backend Client Initialization

```js
// backend/config/razorpay.js
const Razorpay = require('razorpay');

module.exports = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

#### 2. Backend Routes

```js
// backend/routes/razorpay.js
const router = require('express').Router();
const { body } = require('express-validator');
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const authenticateToken = require('../middleware/authMiddleware');

// Create order
router.post('/create-order', authenticateToken, [
  body('bookingId').notEmpty(),
  body('amount').isNumeric()
], async (req, res) => {
  const options = {
    amount: req.body.amount * 100, // paise
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: { bookingId: req.body.bookingId, userId: req.user.userId }
  };
  const order = await razorpay.orders.create(options);
  // persist Payment record...
  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  });
});

// Verify payment
router.post('/verify-payment', authenticateToken, [
  body('razorpayOrderId').notEmpty(),
  body('razorpayPaymentId').notEmpty(),
  body('razorpaySignature').notEmpty()
], async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const payload = razorpayOrderId + '|' + razorpayPaymentId;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');
  if (expected !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid signature' });
  }
  // update Payment & Booking statuses...
  res.json({ message: 'Payment verified' });
});

// Webhook handler
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (signature !== expected) return res.status(400).end();

  const { event, payload } = req.body;
  if (event === 'payment.captured') {
    // mark completed
  }
  if (event === 'payment.failed') {
    // mark failed
  }
  res.json({ status: 'ok' });
});

module.exports = router;
```

#### 3. Frontend Service (`razorpayService.js`)

Encapsulates script loading, order creation, modal launch, and verification.

```js
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;

const loadRazorpay = () =>
  new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    document.body.appendChild(script);
  });

async function createOrder(bookingId, amount, token) {
  return (await axios.post(
    `${API}/razorpay/create-order`,
    { bookingId, amount },
    { headers: { Authorization: `Bearer ${token}` } }
  )).data;
}

async function verifyPayment(payload, token) {
  return (await axios.post(
    `${API}/razorpay/verify-payment`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  )).data;
}

async function processPayment(bookingId, amount, userData, token) {
  const { orderId, amount: amt, currency } = await createOrder(bookingId, amount, token);
  const Razorpay = await loadRazorpay();
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amt, currency, order_id: orderId,
    prefill: { name: userData.name, email: userData.email, contact: userData.phone },
    handler: resp => verifyPayment({
      razorpayOrderId: resp.razorpay_order_id,
      razorpayPaymentId: resp.razorpay_payment_id,
      razorpaySignature: resp.razorpay_signature
    }, token)
  };
  const rzp = new Razorpay(options);
  rzp.open();
  return new Promise(resolve => {
    rzp.on('payment.failed', e => resolve({ success: false, error: e.error }));
    rzp.on('payment.success', () => resolve({ success: true }));
  });
}

export default { processPayment };
```

#### 4. Usage in React

```jsx
import razorpayService from '../../services/razorpayService';

async function handlePayment() {
  setProcessing(true);
  const amount = calculateAmount();
  const result = await razorpayService.processPayment(
    bookingId, amount, { name: user.name, email: user.email, phone: user.phone }, token
  );
  if (result.success) {
    // success UI
  } else {
    // error UI
  }
  setProcessing(false);
}
```

---

### Using the OptimizedImage Component with Cloudinary

Combine Cloudinary URL transforms with a React component that lazy-loads, handles placeholders, and errors.

#### 1. Configure Cloudinary

```js
// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;
```

#### 2. Generating Transformed URLs

```js
// backend/routes/images.js
const express   = require('express');
const router    = express.Router();
const cloudinary = require('../config/cloudinary');

router.get('/gallery', async (req, res) => {
  const publicIds = ['user_avatar_123', 'product_456', 'banner_789'];
  const images = publicIds.map(id => ({
    id,
    url: cloudinary.url(id, {
      width: 800, height: 600, crop: 'fill',
      quality: 'auto', fetch_format: 'auto'
    })
  }));
  res.json({ images });
});

module.exports = router;
```

#### 3. Frontend Rendering

```jsx
// frontend/src/pages/Gallery.jsx
import React, { useEffect, useState } from 'react';
import OptimizedImage from '../components/OptimizedImage';

function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('/api/images/gallery')
      .then(r => r.json())
      .then(data => setImages(data.images));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map(({ id, url }) => (
        <OptimizedImage
          key={id}
          src={url}
          alt={`Image ${id}`}
          className="w-full h-48 object-cover rounded"
          placeholder={<div className="h-full bg-gradient-to-r from-gray-200 to-gray-300" />}
          onError={() => console.warn(`Failed to load ${id}`)}
        />
      ))}
    </div>
  );
}

export default Gallery;
```

#### 4. Practical Tips

- Use `quality: 'auto'` and `fetch_format: 'auto'` for smallest payloads.
- Match `width`/`height` to layout containers to avoid layout shifts.
- Provide low-fidelity placeholders or gradients for perceived performance.
- Leverage `loading="lazy"` and Intersection Observer for pre-loading.
- Handle `onError` to display fallback UI or retry logic.
## Select a Listings Routes Subsection

Please let me know which part of the listings functionality you’d like documented in Section 4:

• Filtering endpoints (e.g. GET /flat or POST /pg/filtered)  
• Image upload & Cloudinary/base64 handling on listings  
• Save/unsave listing workflows (bookmarks)  
• Generic listing CRUD routes (create, read, update, delete)  
• Ownership middleware integration (ensuring only owners can modify)

Reply with one of the above, and I’ll draft the focused subsection.
## 5 · Frontend Developer Guide

This guide covers reusable React components and utilities shipped with the SPA. Use these patterns to simplify lazy loading, authentication, API caching, and optimized images.

### LazyLoader Component

Wrap any `React.lazy` component (or nested Suspense children) in `<LazyLoader>` to get a consistent loading spinner without repeating boilerplate.

#### API

Props  
- `children` (ReactNode): components to render once loaded.  
- `fallback` (ReactNode, optional): override the default spinner.

#### Default Spinner

```html
<div className="flex items-center justify-center min-h-[200px]">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
</div>
```

#### Usage

1. Lazy-load a page or widget

```jsx
// src/App.jsx
import React, { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import LazyLoader from './components/LazyLoader.jsx'

const UserProfile = lazy(() => import('./features/UserProfile'))

export default function App() {
  return (
    <Routes>
      <Route
        path="/user/:id"
        element={
          <LazyLoader>
            <UserProfile />
          </LazyLoader>
        }
      />
    </Routes>
  )
}
```

2. Custom fallback UI

```jsx
// src/pages/Dashboard.jsx
import LazyLoader from '../components/LazyLoader.jsx'

export default function Dashboard() {
  return (
    <LazyLoader fallback={<div>🚀 Loading dashboard...</div>}>
      {/* nested lazy components */}
    </LazyLoader>
  )
}
```

#### Tips

- Wrap only the component that lazy-loads.  
- Ensure Tailwind is configured in `vite.config.js`.  
- You can nest multiple `<LazyLoader>` boundaries in your root `<App />`.  
- For SEO-critical routes, consider SSR instead of client Suspense.

---

### PrivateRoute: Enforcing Authentication

Protect routes by redirecting unauthenticated users to `/login`.

#### Component

```jsx
// src/components/PrivateRoute.jsx
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext.jsx'

export default function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return null // or <Spinner />
  }
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}
```

#### Usage

```jsx
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}
```

#### Tips

- Replace `return null` with a spinner for better UX.  
- Change `<Navigate to="/login" />` to customize the redirect.  
- Wrap a layout component to guard multiple nested routes.  
- Mount `AuthProvider` above your router.

---

### AuthContext: Managing Authentication State

Centralize user profile, JWT token, and auth actions.

#### Exposed Values

- `user: object|null` – authenticated user or null  
- `token: string|null` – JWT from `localStorage`  
- `loading: boolean` – true while checking token on mount  
- `login(email, password): Promise<{success: boolean, message?: string}>`  
- `logout(): void`  
- `updateUserProfile(data, token): Promise<object>`

#### Setup

```jsx
// src/index.jsx
import ReactDOM from 'react-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import App from './App.jsx'

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root'),
)
```

#### Consume Context

```jsx
// src/components/LoginForm.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function LoginForm() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const result = await login(email, password)
    if (!result.success) {
      setError(result.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
    </form>
  )
}
```

#### Global Loading State

```jsx
// src/App.jsx
import React, { useContext } from 'react'
import { AuthContext } from './context/AuthContext.jsx'
import Spinner from './components/Spinner.jsx'
import AppRoutes from './AppRoutes.jsx'
import PublicRoutes from './PublicRoutes.jsx'

export default function App() {
  const { loading, user } = useContext(AuthContext)
  if (loading) return <Spinner />
  return user ? <AppRoutes /> : <PublicRoutes />
}
```

#### Update Profile

```jsx
// src/components/ProfileEditor.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'

export default function ProfileEditor() {
  const { user, token, updateUserProfile } = useContext(AuthContext)
  const [formData, setFormData] = useState({ name: user.name, bio: user.bio })
  const [status, setStatus] = useState('')

  async function save() {
    try {
      await updateUserProfile(formData, token)
      setStatus('Profile updated successfully.')
    } catch {
      setStatus('Update failed.')
    }
  }

  return (
    <div>
      {/* form inputs bound to formData */}
      <button onClick={save}>Save</button>
      {status && <p>{status}</p>}
    </div>
  )
}
```

#### Best Practices

- Always check `loading` before accessing `user` or `token`.  
- Handle `login` errors via `result.message`.  
- Call `logout()` then `navigate('/login')` if needed.  
- Include `token` in subsequent API calls.

---

### Caching GET Requests with `apiService.get`

Fetch and cache GET responses for 5 minutes; retry transient errors up to 3 times with exponential backoff.

#### Signature

```ts
apiService.get(url: string, params?: object, useCache?: boolean): Promise<any>
```

#### Basic Usage

```js
// src/services/listingService.js
import { apiService } from './apiService.js'

async function fetchListings() {
  const filters = { city: 'Boston', minPrice: 500 }
  const listings = await apiService.get('/listings', filters)
  console.log(listings)
}
```

Disable cache for fresh data:

```js
import { apiService } from './services/apiService.js'

const listing = await apiService.get('/listings/12345', {}, false)
console.log(listing)
```

#### Clearing Cache

```js
import { apiService } from './services/apiService.js'

// Clear entire cache after CUD operations
apiService.clearCache()

// Clear specific entry
apiService.clearCacheEntry('/listings', { city: 'Boston' })
```

#### Advanced Patterns

- Include `page`/`limit` in `params` for paginated caching.  
- Use `useCache=false` for real-time consistency.  
- Leverage automatic retries on status ≥500.

---

### OptimizedImage: Lazy-Loaded Image with Placeholder

Defer off-screen image loading, show a low-fi placeholder or spinner, and fallback on error.

#### Props

- `src` (string, required)  
- `alt` (string, required)  
- `className` (string)  
- `placeholder` (ReactNode)  
- `onLoad` (function)  
- `onError` (function)  
- ...Any standard `<img>` attributes

#### Usage

```jsx
import OptimizedImage from './components/OptimizedImage.jsx'

// Blurred placeholder component
const BlurPlaceholder = () => (
  <div className="w-full h-full bg-gray-200 animate-pulse" />
)

export default function GalleryItem() {
  return (
    <OptimizedImage
      src="https://cdn.example.com/property-123.jpg"
      alt="Living room"
      className="w-full h-80 object-cover rounded-lg"
      placeholder={<BlurPlaceholder />}
      onLoad={() => console.log('Image loaded')}
      onError={() => console.warn('Failed to load image')}
    />
  )
}
```

#### Best Practices

- Always provide meaningful `alt` text.  
- Use a small blurred placeholder to reduce layout shift.  
- Forward `loading="lazy"` or `decoding="async"` via spread.  
- Set container dimensions via `className` to prevent jumps.  
- Wrap in `<picture>` externally for `srcSet` or art direction.
## 6 · Configuration & Deployment

This section covers configuring third-party services, building and deploying with zero downtime, securing HTTP headers, and integrating a real-time performance monitor.

### 6.1 Third-Party Service Configuration

Ensure you set the following environment variables in `.env` before starting the server.

#### 6.1.1 Cloudinary (Media Uploads)

Purpose: upload and manage images/files.

Environment variables:  
```
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Configuration: `backend/config/cloudinary.js`  
```javascript
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = cloudinary;
```

Usage example:
```javascript
const cloudinary = require('../config/cloudinary');

async function uploadImage(file, folder = 'user-uploads') {
  try {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: 'auto'
    });
    return { url, publicId: public_id };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
}
```

Tips:
- Use `resource_type: 'auto'` to handle images/videos.
- Persist `publicId` for deletes or transformations.

#### 6.1.2 Email Notifications (Payment Confirmation)

Purpose: send styled payment emails via Gmail.

Environment variables:  
```
EMAIL_USER
EMAIL_PASS
```

Configuration: `backend/config/email.js`  
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendPaymentConfirmation(to, name, details) {
  const html = `<h1>Hi ${name}</h1>
    <p>Payment ${details.transactionId} of ₹${details.amount/100} confirmed.</p>`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Payment Confirmation',
    html
  });
}

module.exports = { sendPaymentConfirmation };
```

Usage:
```javascript
const { sendPaymentConfirmation } = require('../config/email');

async function onPaymentSuccess(user, payment) {
  try {
    await sendPaymentConfirmation(user.email, user.name, {
      transactionId: payment.id,
      amount:        payment.amount,
      createdAt:     payment.created_at,
      status:        payment.status
    });
  } catch (err) {
    // log or retry
  }
}
```

Tips:
- For Gmail, enable “App Passwords” or less-secure apps.
- Customize the HTML template in `email.js`.

#### 6.1.3 Razorpay (Payment Gateway)

Purpose: create and manage orders via Razorpay API.

Environment variables:  
```
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

Configuration: `backend/config/razorpay.js`  
```javascript
const Razorpay = require('razorpay');
module.exports = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

Usage:
```javascript
const razorpay = require('../config/razorpay');

async function createOrder(amountInPaise, receiptId) {
  const options = {
    amount:          amountInPaise,
    currency:        'INR',
    receipt:         receiptId,
    payment_capture: 1
  };
  try {
    const order = await razorpay.orders.create(options);
    return order; // { id, amount, currency, ... }
  } catch (err) {
    console.error('Razorpay order creation failed:', err);
    throw err;
  }
}
```

Tips:
- Convert rupees to paise: ₹500 → 50000.
- Store both your `receiptId` and Razorpay’s `order.id` for reconciliation.

---

### 6.2 PM2 Deployment Configuration

Define automated, zero-downtime deployments in `ecosystem.config.js`.

```javascript
module.exports = {
  apps: [{
    name: 'findoorz-backend',
    script: 'server.js',
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip',
      ref: 'origin/main',
      repo: 'git@github.com:VikasPatel2004/Findoorzz.git',
      path: '/var/www/findoorz-backend',
      'pre-deploy-local':  'npm test',
      'post-deploy':       'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
```

Steps:
1. Add SSH key:  
   `ssh-copy-id ubuntu@your-server-ip`
2. Initial setup:  
   `pm2 deploy ecosystem.config.js production setup`
3. Deploy changes:  
   `git push origin main`  
   `pm2 deploy ecosystem.config.js production`
4. Rollback:  
   `pm2 deploy ecosystem.config.js production revert <revision>`

Best Practices:
- Use SSH repo URLs for passwordless pulls.
- Run tests in `pre-deploy-local`.
- Apply migrations in `post-deploy`.
- Monitor logs at `~/.pm2`.

Common Gotchas:
- Ensure remote user has write access to `path`.
- Match Node/NPM versions between local and server.
- For multi-server, set `host: ['app1', 'app2']`.

---

### 6.3 Custom HTTP Headers in netlify.toml

Define security and caching headers at build time.

```toml
[build]
  publish = "dist"
  command = "npm run build:prod"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options        = "DENY"
    X-XSS-Protection       = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy        = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Guidance:
- Apply security headers globally.
- Cache hashed assets for one year with `immutable`.
- Test with `netlify dev`.

---

### 6.4 Performance Monitor Component

Overlay real-time metrics in development.

#### Installation & Import
```bash
# No extra deps
```
```jsx
// src/App.jsx
import React from 'react';
import PerformanceMonitor from './components/PerformanceMonitor';

function App() {
  return (
    <>
      {/* your app */}
      <PerformanceMonitor />
    </>
  );
}
export default App;
```

#### Dev-Only Rendering
By default, hides in production. To force in staging:
```jsx
{process.env.REACT_APP_ENABLE_MONITOR === 'true' && <PerformanceMonitor />}
```

#### Metrics Captured
- Load Time: `loadEventEnd - navigationStart`
- DOM Ready: `domContentLoadedEventEnd - navigationStart`
- FCP: `PerformanceObserver` on `'paint'`
- LCP: `PerformanceObserver` on `'largest-contentful-paint'`

#### Styling & Positioning
```jsx
<div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50">…</div>
```
Override via custom CSS as needed.

#### Customization
Add CLS observer:
```javascript
const clsObserver = new PerformanceObserver(list => {
  const entry = list.getEntries()[0];
  setMetrics(prev => ({ ...prev, cls: entry.value }));
});
clsObserver.observe({ type: 'layout-shift', buffered: true });
```

#### Best Practices
- Include only in development bundles.
- Remove or gate before running benchmarks.
- For production, send metrics to an analytics endpoint.
## 7 · Testing & Quality Assurance

Ensure code correctness, prevent regressions, and surface performance issues during development and CI.

### 7.1 Setting up MongoDB Test Database with Jest

Ensure each integration test runs against a fresh, isolated MongoDB instance.

#### File: backend/tests/setupTestDB.js

```javascript
const mongoose = require('mongoose');

const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    const mongoURI = process.env.MONGO_URI_TEST
      || 'mongodb://localhost:27017/findoorz_test';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB test database');
  }
};

const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB test database');
  }
};

module.exports = { connectTestDB, closeTestDB };
```

#### Jest Integration

1. Increase timeout in `backend/jest.config.js`:
   ```javascript
   module.exports = { testTimeout: 30000 };
   ```
2. Use lifecycle hooks in your test suites:
   ```javascript
   const { connectTestDB, closeTestDB } = require('./setupTestDB');
   const request = require('supertest');
   const app = require('../src/app'); // Express app

   describe('Auth API', () => {
     beforeAll(async () => { await connectTestDB(); });
     afterAll(async () => { await closeTestDB(); });

     test('Register new user', async () => {
       const res = await request(app)
         .post('/api/auth/register')
         .send({ email: 'a@b.com', password: 'pass123' });
       expect(res.status).toBe(201);
     });
   });
   ```

#### Tips

- Set `MONGO_URI_TEST` in CI or local `.env`.
- Each suite drops the database on teardown—tests start clean.
- Adjust `testTimeout` if CI runs slowly.
- To preserve data across suites, skip `dropDatabase()` or call cleanup selectively.

---

### 7.2 ESLint Configuration: React Hooks & Fast Refresh

Enforce Hooks rules and catch invalid Fast Refresh exports in React code.

#### File: frontend/eslint.config.js

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]'}],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
```

#### Installation

```bash
npm install --save-dev eslint @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh
```

#### Usage

1. Place `eslint.config.js` in project root.
2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "lint": "eslint .",
       "lint:fix": "eslint . --fix"
     }
   }
   ```
3. Run `npm run lint` locally or in CI.

#### Notes

- For TypeScript, swap in `@typescript-eslint/parser` and plugin configs.
- Adjust `no-unused-vars.varsIgnorePattern` for other naming patterns.
- This setup targets React 17+ with the new JSX transform.

---

### 7.3 PerformanceMonitor Component

Render a live overlay showing page load metrics and Core Web Vitals in development.

#### File: frontend/src/components/PerformanceMonitor.jsx

```jsx
import React, { useEffect, useState } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    domContentLoaded: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
  });

  useEffect(() => {
    const measure = () => {
      if (window.performance?.timing) {
        const t = window.performance.timing;
        setMetrics(m => ({
          ...m,
          loadTime: t.loadEventEnd - t.navigationStart,
          domContentLoaded: t.domContentLoadedEventEnd - t.navigationStart,
        }));
      }
      if ('PerformanceObserver' in window) {
        new PerformanceObserver(list => {
          const entry = list.getEntries().pop();
          setMetrics(m => ({ ...m, firstContentfulPaint: entry.startTime }));
        }).observe({ entryTypes: ['paint'] });

        new PerformanceObserver(list => {
          const entry = list.getEntries().pop();
          setMetrics(m => ({ ...m, largestContentfulPaint: entry.startTime }));
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      }
    };

    if (document.readyState === 'complete') measure();
    else window.addEventListener('load', measure);

    return () => window.removeEventListener('load', measure);
  }, []);

  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        <div>Load Time: {metrics.loadTime}ms</div>
        <div>DOM Ready: {metrics.domContentLoaded}ms</div>
        <div>FCP: {metrics.firstContentfulPaint.toFixed(0)}ms</div>
        <div>LCP: {metrics.largestContentfulPaint.toFixed(0)}ms</div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
```

#### Usage

1. Ensure Tailwind CSS (or adapt styles).
2. Render early in your root component (`App.jsx`):

   ```jsx
   import React from 'react';
   import PerformanceMonitor from './components/PerformanceMonitor';
   import MainApp from './MainApp';

   function App() {
     return (
       <>
         <PerformanceMonitor />
         <MainApp />
       </>
     );
   }

   export default App;
   ```

3. Run in development. The overlay appears at bottom-right.
4. Use metrics to catch regressions during local testing.
## 8 · Contribution Guide

This guide describes how to propose changes, report bugs, and submit new features to the Findoorzz repository. Follow these norms to ensure a smooth review and integration process.

### 8.1 Forking & Cloning
1. Fork the repo on GitHub: https://github.com/VikasPatel2004/Findoorzz  
2. Clone your fork locally:
   
   ```bash
   git clone git@github.com:<your-username>/Findoorzz.git
   cd Findoorzz
   ```

### 8.2 Branch Naming
Use descriptive, type-prefixed branch names:
- `feat/<feature-name>` for new features  
- `fix/<bug-description>` for bug fixes  
- `docs/<area>` for documentation  
- `chore/<task>` for maintenance

Example:
```bash
git checkout -b feat/add-search-filter
```

### 8.3 Commit Message Guidelines
Follow a simple conventional style:
```
<type>(<scope>): <short description>

[optional body]
```
- type: feat, fix, docs, chore, test  
- scope: module or area (e.g., auth, api, ui)  
- short description: imperative, max 50 characters  

Example:
```bash
git commit -m "feat(api): add price range filter to /listings endpoint"
```

### 8.4 Coding Style & Linting
- JavaScript/TypeScript: Prettier + ESLint configuration in `.prettierrc` and `.eslintrc.js`  
- Run linters before pushing:
  ```bash
  npm install
  npm run lint       # ESLint
  npm run format     # Prettier
  ```

### 8.5 Testing
- Backend: Jest tests located under `backend/tests/`  
- Frontend: React Testing Library in `frontend/src/__tests__/`  
- Run tests locally:
  ```bash
  npm run test       # runs both frontend & backend suites
  npm run test:watch # watch mode
  ```

New features or bug fixes must include appropriate test coverage.

### 8.6 Documentation Updates
- Update `README.md` for high-level changes  
- Update inline JSDoc or TypeScript definitions  
- For new scripts (e.g., `addSampleData.js`), add usage instructions under `backend/scripts/README.md`

### 8.7 Pull Request Workflow
1. Push your branch to your fork:
   ```bash
   git push origin feat/add-search-filter
   ```
2. Open a PR against `main` with a clear title and description.  
3. Link related issue (e.g., “Closes #42”).  
4. Ensure all CI checks pass and reviewers are assigned.  
5. Address feedback promptly; squash “fixup” commits into logical units.

### 8.8 Review & Merge
- Reviewers check code style, test coverage, and documentation.  
- Once approved and CI passes, a maintainer merges via “Squash and merge.”  
- Delete your branch after merge.

Thank you for contributing to Findoorzz!
