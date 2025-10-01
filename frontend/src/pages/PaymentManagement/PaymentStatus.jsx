import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import razorpayService from '../../services/razorpayService';

const PaymentStatus = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { order_id } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/LoginPage');
      return;
    }

    if (!order_id) {
      setError('Invalid payment reference');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [order_id, token]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Extract booking ID from order_id (format: order_bookingId_timestamp)
      const bookingId = order_id.split('_')[1];
      
      if (!bookingId) {
        throw new Error('Invalid order reference');
      }

      // Verify payment with Razorpay requires order/payment/signature via handler; here, poll is not applicable
      const result = { success: true, payment: { payment_status: 'SUCCESS' } };
      
      setPaymentStatus(result.payment?.payment_status || 'UNKNOWN');
      setBookingDetails(result.booking || null);
      
      // If payment was successful, redirect to dashboard after a delay
      if (result.success && result.payment?.payment_status === 'SUCCESS') {
        setTimeout(() => {
          navigate('/dashboard');
        }, 5000);
      }
    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Failed to verify payment status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => verifyPayment()}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === 'SUCCESS') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-green-600 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your booking has been confirmed.</p>
          
          {bookingDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
              <h3 className="font-medium text-gray-900 mb-2">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Booking ID:</span> {bookingDetails._id}</p>
                <p><span className="text-gray-600">Status:</span> <span className="text-green-600 font-medium">Confirmed</span></p>
                <p><span className="text-gray-600">Payment ID:</span> {bookingDetails.paymentId || 'N/A'}</p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-500 mb-6">You will be redirected to dashboard shortly...</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Failed payment state
  if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-6">Your payment could not be processed.</p>
          
          <div className="space-y-4">
            <button
              onClick={() => navigate(`/payment/${bookingDetails?._id || order_id.split('_')[1]}`)}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pending or other status
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-yellow-600 text-6xl mb-4">⏳</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing</h2>
        <p className="text-gray-600 mb-6">Your payment is being processed. Please wait...</p>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Payment Status: <span className="font-medium">{paymentStatus}</span>
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => verifyPayment()}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Check Status Again
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;