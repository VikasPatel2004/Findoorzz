import React, { useContext, useEffect, useState } from 'react';
import listingService from '../../../services/listingService';
import paymentService from '../../../services/paymentService';
import userService from '../../../services/userService';
import { AuthContext } from '../../../context/AuthContext';

const ClipboardListIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8M8 15h8M4 7h.01M4 11h.01M4 15h.01M4 19h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const CashIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6v6H9z" />
  </svg>
);

export default function LenderDashboardPage() {
  const { token } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [userListings, userPayments, userProfile] = await Promise.all([
          listingService.getMyCreatedFlatListings(token),
          paymentService.getUserPayments(token),
          userService.getUserProfile(token),
        ]);
        setListings(userListings || []);
        setPayments(userPayments || []);
        setProfile(userProfile || null);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error('Lender Dashboard data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  // Stats
  const totalListings = listings.length;
  const completedListings = listings.filter(l => l.status === 'completed').length;
  // Earnings: sum of payments for listings owned by this user
  const myListingIds = new Set(listings.map(l => l._id));
  const earnings = payments
    .filter(p => p.status === 'completed' && myListingIds.has(p.listing))
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // Recent activities: recent listings and payments
  const recentActivities = [
    ...listings.map(l => ({
      id: l._id,
      type: 'Listing',
      description: l.title || l.name || 'Untitled Listing',
      time: l.createdAt,
    })),
    ...payments.filter(p => myListingIds.has(p.listing)).map(p => ({
      id: p._id,
      type: 'Payment',
      description: `${p.status === 'completed' ? 'Payment received' : 'Payment pending'} for ${p.listingTitle || p.listing || 'a property'}`,
      time: p.createdAt,
    })),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Lender Dashboard</h1>
        {loading ? (
          <div className="text-center text-lg text-blue-700">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <>
            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5 flex items-center">
                  <div className="flex-shrink-0"><ClipboardListIcon /></div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Listings</dt>
                      <dd><div className="text-lg font-medium text-gray-900">{totalListings}</div></dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5 flex items-center">
                  <div className="flex-shrink-0"><CashIcon /></div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed Listings</dt>
                      <dd><div className="text-lg font-medium text-gray-900">{completedListings}</div></dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5 flex items-center">
                  <div className="flex-shrink-0"><CashIcon /></div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Earnings</dt>
                      <dd><div className="text-lg font-medium text-gray-900">₹{earnings.toLocaleString()}</div></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Recent Activities */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg lg:col-span-2">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activities</h3>
                </div>
                {recentActivities.length === 0 ? (
                  <div className="text-gray-500 p-4">No recent activity.</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {recentActivities.map((activity) => (
                      <li key={activity.id + activity.type} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-yellow-600 truncate">{activity.type}</p>
                            <p className="mt-1 text-sm text-gray-500">{activity.description}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {activity.time ? new Date(activity.time).toLocaleDateString() : ''}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Lender ID Card */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Lender ID</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {profile ? (
                    <div className="border-2 border-yellow-500 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold">Findoorz Certified Lender</h4>
                          <p className="text-sm text-gray-500">ID: {profile._id || 'N/A'}</p>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                          {/* Lender photo would go here */}
                          <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-yellow-600">
                              {profile.name ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="font-medium">{profile.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">{profile.location || 'Location not set'}</p>
                        <p className="text-sm text-gray-600">Mobile: {profile.phone || 'N/A'}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Valid until: 31/12/2023</p>
                        <p className="text-xs text-gray-500">Verified by Findoorz</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">No profile info.</div>
                  )}
                  <div className="mt-4 flex justify-center">
                    <button className="text-sm font-medium text-yellow-600 hover:text-yellow-500">
                      Download ID Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 