import React, { useContext, useEffect, useState } from 'react';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { AuthContext } from '../context/AuthContext';

export default function RenterDashboard() {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [bookingData, paymentData] = await Promise.all([
          bookingService.getUserBookings(token),
          paymentService.getUserPayments(token),
        ]);
        setBookings(bookingData || []);
        setPayments(paymentData || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  // Calculate stats
  const totalBookings = bookings.length;
  const activeRentals = bookings.filter(b => b.status === 'active' || b.status === 'ongoing').length;
  const totalSpent = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  // Recent activity (combine bookings and payments, sort by date desc)
  const recentActivity = [
    ...bookings.map(b => ({
      type: 'Booking',
      description: `Booking for ${b.listingTitle || b.listing || 'a property'}`,
      date: b.createdAt,
      status: b.status,
    })),
    ...payments.map(p => ({
      type: 'Payment',
      description: `${p.status === 'completed' ? 'Payment made' : 'Payment pending'} for ${p.listingTitle || p.listing || 'a property'}`,
      date: p.createdAt,
      status: p.status,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <main className="min-h-screen p-8 bg-blue-50">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8">Renter Dashboard</h1>

      {loading ? (
        <div className="text-center text-lg text-blue-700">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Total Bookings</h2>
              <p className="text-4xl font-bold text-blue-600">{totalBookings}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Active Rentals</h2>
              <p className="text-4xl font-bold text-blue-600">{activeRentals}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Total Spent</h2>
              <p className="text-4xl font-bold text-blue-600">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-2xl font-semibold text-gray-700">Pending Payments</h2>
              <p className="text-4xl font-bold text-blue-600">{pendingPayments}</p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-3xl font-semibold text-blue-900 mb-4">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <div className="text-gray-500">No recent activity.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentActivity.map((item, idx) => (
                  <li key={idx} className="py-3 flex justify-between items-center">
                    <span>
                      <span className="font-semibold text-blue-700 mr-2">[{item.type}]</span>
                      {item.description}
                      {item.status && (
                        <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 capitalize">{item.status}</span>
                      )}
                    </span>
                    <span className="text-gray-500 text-sm">{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
