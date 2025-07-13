import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import razorpayService from '../../services/razorpayService';
import bookingService from '../../services/bookingService';

const PaymentForm = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { bookingId } = useParams();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    fetchBookingDetails();
  }, [bookingId, token]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const bookingData = await bookingService.getUserBookings(token);
      const currentBooking = bookingData.find(b => b._id === bookingId);
      
      if (!currentBooking) {
        setError('Booking not found');
        return;
      }
      
      setBooking(currentBooking);
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    try {
      setProcessing(true);
      setError(null);

      const amount = calculateAmount();
      const description = `Payment for ${booking.listingTitle || 'property booking'}`;

      const result = await razorpayService.processPayment(
        bookingId,
        amount,
        description,
        {
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || ''
        },
        token
      );

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setError(result.message || 'Payment failed');
      }

    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const calculateAmount = () => {
    if (!booking) return 0;
    
    // Calculate based on booking duration and listing price
    const startDate = new Date(booking.bookingStartDate);
    const endDate = new Date(booking.bookingEndDate);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Assuming booking has rentAmount or similar field
    const dailyRate = booking.rentAmount || 1000; // Default daily rate
    return days * dailyRate;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
            <p className="text-blue-100 mt-1">Secure payment powered by Razorpay</p>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property:</span>
                  <span className="font-medium">{booking?.listingTitle || 'Property'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{formatDate(booking?.bookingStartDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{formatDate(booking?.bookingEndDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    booking?.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking?.status === 'confirmed' ? 'Confirmed' : 'Pending Payment'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-xl text-blue-600">₹{calculateAmount()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Payment Method:</span>
                  <span>Razorpay (Cards, UPI, Net Banking)</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="text-blue-600 text-xl mr-3">🔒</div>
                <div>
                  <h3 className="font-medium text-blue-900">Secure Payment</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Your payment information is encrypted and secure. We use industry-standard 
                    security measures to protect your data.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="text-red-600 text-xl mr-3">⚠️</div>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <div className="space-y-4">
              <button
                onClick={handlePayment}
                disabled={processing || booking?.status === 'confirmed'}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                  processing || booking?.status === 'confirmed'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </div>
                ) : booking?.status === 'confirmed' ? (
                  'Payment Already Completed'
                ) : (
                  'Pay Now'
                )}
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 px-6 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By proceeding, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
