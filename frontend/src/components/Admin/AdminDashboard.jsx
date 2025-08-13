import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import LoadingSpinner from '../LoadingSpinner';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(adminService.formatAnalytics(data));
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading dashboard</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-3 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-md bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {change !== undefined && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change} today
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const CityCard = ({ city, types }) => (
    <div className="flex justify-between items-center py-2">
      <span className="font-medium">{city._id}</span>
      <div className="flex items-center space-x-2">
        <span className="text-gray-600">{city.count}</span>
        <div className="flex space-x-1">
          {city.types?.map((type, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs ${
                type === 'flat' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {type.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Listings"
            value={analytics.totals.totalListings}
            change={analytics.todayGrowth.listings}
            icon="🏠"
            color="blue"
          />
          <StatCard
            title="Active Listings"
            value={analytics.totals.activeListings}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Total Users"
            value={analytics.totals.users}
            change={analytics.thisMonth.users}
            icon="👥"
            color="purple"
          />
          <StatCard
            title="Pending Approval"
            value={analytics.totals.pendingApproval}
            icon="⏳"
            color="yellow"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Flat Listings"
            value={analytics.totals.flatListings}
            change={analytics.todayGrowth.flats}
            icon="🏢"
            color="blue"
          />
          <StatCard
            title="PG Listings"
            value={analytics.totals.pgListings}
            change={analytics.todayGrowth.pgs}
            icon="🏘️"
            color="green"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Cities by Listings</h3>
          </div>
          <div className="p-6">
            {analytics.topCities && analytics.topCities.length > 0 ? (
              <div className="space-y-3">
                {analytics.topCities.slice(0, 8).map((city, index) => (
                  <CityCard key={index} city={city} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No city data available</p>
            )}
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">This Month's Growth</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Listings</span>
                <span className="font-bold text-blue-600">
                  +{analytics.monthlyGrowth.listings}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Flat Listings</span>
                <span className="font-bold text-blue-600">
                  +{analytics.monthlyGrowth.flats}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">PG Listings</span>
                <span className="font-bold text-green-600">
                  +{analytics.monthlyGrowth.pgs}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Users</span>
                <span className="font-bold text-purple-600">
                  +{analytics.monthlyGrowth.users}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Activity Chart (simplified) */}
      {analytics.dailyTrends && (analytics.dailyTrends.flats.length > 0 || analytics.dailyTrends.pgs.length > 0) && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity (Last 30 Days)</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Flat Listings Added</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analytics.dailyTrends.flats.slice(-10).map((day, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{day._id}</span>
                      <span className="font-medium">{day.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">PG Listings Added</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analytics.dailyTrends.pgs.slice(-10).map((day, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{day._id}</span>
                      <span className="font-medium">{day.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">Manage Listings</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-center">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium">Manage Users</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">View Reports</div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">Settings</div>
            </button>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={fetchAnalytics}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
