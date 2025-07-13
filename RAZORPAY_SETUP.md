# Razorpay Integration & Verification Setup Guide

## 🚀 Overview

This guide provides step-by-step instructions for setting up Razorpay integration and meeting verification requirements for FinDoorz.

## 📋 Prerequisites

- Razorpay account (test/live)
- Business registration documents
- GST number (if applicable)
- Business bank account
- Domain ownership

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install razorpay nodemailer
```

### 2. Environment Variables

Add these to your `.env` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration (for payment confirmations)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Configuration
ALLOWED_ORIGINS=https://findoorz-3fbn.onrender.com,http://localhost:3000
```

### 3. Razorpay Dashboard Setup

1. **Create Razorpay Account:**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Sign up for a business account
   - Complete KYC verification

2. **Get API Keys:**
   - Navigate to Settings → API Keys
   - Generate new key pair
   - Copy Key ID and Key Secret

3. **Configure Webhooks:**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-backend-domain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`
   - Copy webhook secret

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install razorpay
```

### 2. Environment Variables

Add to your `.env` file:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### 3. Payment Integration

The payment flow is already implemented in:
- `src/services/razorpayService.js` - Payment processing
- `src/pages/PaymentManagement/PaymentForm.jsx` - Payment UI
- `src/pages/Legal/` - Required legal pages

## 📄 Legal Pages Setup

### Required Pages (Already Created)

1. **Privacy Policy** - `/privacy`
2. **Terms of Service** - `/terms`
3. **Refund Policy** - `/refund-policy`
4. **Cancellation Policy** - `/cancellation-policy`
5. **Business Information** - `/business-info`

### Update Business Information

Edit `src/pages/Legal/BusinessInfo.jsx` with your actual business details:

```jsx
// Replace placeholder values with your actual information
const businessInfo = {
  companyName: "Your Company Name",
  gstNumber: "Your GST Number",
  panNumber: "Your PAN Number",
  address: "Your Business Address",
  phone: "Your Phone Number",
  email: "your-email@domain.com"
};
```

## 🔒 Security Requirements

### 1. SSL Certificate
- Ensure your domain has valid SSL certificate
- HTTPS is required for production

### 2. CORS Configuration
- Backend CORS is already configured
- Update `ALLOWED_ORIGINS` with your frontend domain

### 3. Environment Variables
- Never commit API keys to version control
- Use environment variables for all sensitive data

## 📊 Testing

### 1. Test Mode
- Use Razorpay test keys for development
- Test payment flow with test cards

### 2. Test Cards
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
Name: Any name
```

### 3. Test UPI
```
UPI ID: success@razorpay
```

## 🚀 Production Deployment

### 1. Backend Deployment (Render)

1. **Set Environment Variables:**
   - Go to your Render service dashboard
   - Navigate to Environment tab
   - Add all required environment variables

2. **Deploy:**
   ```bash
   git add .
   git commit -m "Add Razorpay integration"
   git push origin main
   ```

### 2. Frontend Deployment (Netlify)

1. **Set Environment Variables:**
   - Go to Netlify dashboard
   - Navigate to Site settings → Environment variables
   - Add `VITE_RAZORPAY_KEY_ID`

2. **Deploy:**
   ```bash
   npm run build
   # Deploy the dist folder
   ```

## 📋 Razorpay Verification Checklist

### ✅ Technical Requirements
- [ ] Razorpay SDK integrated
- [ ] Payment flow working
- [ ] Webhook handling implemented
- [ ] SSL certificate active
- [ ] CORS properly configured

### ✅ Legal Requirements
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Refund Policy page
- [ ] Cancellation Policy page
- [ ] Business information page

### ✅ Business Requirements
- [ ] Company registration details
- [ ] GST number (if applicable)
- [ ] Business address
- [ ] Contact information
- [ ] Bank account details

### ✅ User Experience
- [ ] Clear pricing display
- [ ] Payment confirmation emails
- [ ] Order tracking
- [ ] Customer support system
- [ ] Error handling

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Check `ALLOWED_ORIGINS` in backend
   - Ensure frontend domain is included
   - Redeploy backend after changes

2. **Payment Failures:**
   - Verify API keys are correct
   - Check webhook configuration
   - Ensure SSL certificate is valid

3. **Webhook Issues:**
   - Verify webhook URL is accessible
   - Check webhook secret matches
   - Monitor webhook logs

### Support

For technical issues:
- Email: support@findoorz.com
- Phone: +91-XXXXXXXXXX
- Documentation: [Razorpay Docs](https://razorpay.com/docs/)

## 📞 Contact Information

**FinDoorz Support:**
- Email: support@findoorz.com
- Phone: +91-XXXXXXXXXX
- Business Hours: Monday - Friday, 9:00 AM - 6:00 PM IST

**Razorpay Support:**
- Email: help@razorpay.com
- Phone: 1800-123-4567
- Live Chat: Available on dashboard

---

## 🎯 Next Steps

1. **Complete Business Verification:**
   - Submit required documents to Razorpay
   - Complete KYC process
   - Wait for approval

2. **Test Payment Flow:**
   - Test with real cards (small amounts)
   - Verify webhook functionality
   - Test refund process

3. **Go Live:**
   - Switch to live Razorpay keys
   - Monitor transactions
   - Provide customer support

---

**Note:** This setup guide assumes you have basic knowledge of React, Node.js, and deployment platforms. For additional help, refer to the official documentation or contact support. 