import React from 'react';

export default function RenterDashboard() {
  // Hardcoded mock data for renter analytics
  const totalBookings = 8;
  const activeRentals = 3;
  const totalSpent = 45000; // in currency units
  const pendingPayments = 1;

  return (
    <main className="min-h-screen p-8 bg-blue-50">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8">Renter Dashboard</h1>

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
        <ul className="divide-y divide-gray-200">
          <li className="py-3 flex justify-between">
            <span>Payment received for Flat #101</span>
            <span className="text-gray-500">3 days ago</span>
          </li>
          <li className="py-3 flex justify-between">
            <span>Booking confirmed: Cozy 2BHK</span>
            <span className="text-gray-500">1 week ago</span>
          </li>
          <li className="py-3 flex justify-between">
            <span>Payment due for Flat #203</span>
            <span className="text-gray-500">2 weeks ago</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
