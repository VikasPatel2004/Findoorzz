import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for admin requests
const adminAxios = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
adminAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Admin API Error:', error.response?.data || error.message);
    // Commented out redirect to prevent reload loop for debugging
    // if (error.response?.status === 403) {
    //   window.location.href = '/';
    // }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

const adminService = {
  // Dashboard Analytics
  getDashboardAnalytics: async () => {
    return await adminAxios.get('/dashboard/analytics');
  },

  // Listings Management
  getListings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminAxios.get(`/listings?${queryString}`);
  },

  updateListingStatus: async (listingId, status) => {
    return await adminAxios.patch(`/listings/${listingId}/status`, { status });
  },

  deleteListing: async (listingId) => {
    return await adminAxios.delete(`/listings/${listingId}`);
  },

  updateListing: async (listingId, updateData) => {
    return await adminAxios.put(`/listings/${listingId}`, updateData);
  },

  bulkAction: async (listingIds, action) => {
    return await adminAxios.post('/listings/bulk-action', { listingIds, action });
  },

  // User Management
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminAxios.get(`/users?${queryString}`);
  },

  updateUser: async (userId, updateData) => {
    return await adminAxios.patch(`/users/${userId}`, updateData);
  },

  // Convenience helpers for Users
  updateUserRole: async (userId, role) => {
    return await adminAxios.patch(`/users/${userId}`, { role });
  },

  updateUserStatus: async (userId, verificationStatus) => {
    return await adminAxios.patch(`/users/${userId}`, { verificationStatus });
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await adminAxios.get(`/audit-logs?${queryString}`);
  },

  // Utility Methods
  isAdmin: (user) => {
    // Allow specific email for admin access
    if (user && user.email === 'vp0552850@gmail.com') {
      return true;
    }
    return user && (user.isAdmin === true || user.role === 'admin');
  },

  // Statistics helpers
  formatAnalytics: (analytics) => {
    if (!analytics) return null;

    return {
      ...analytics,
      // Calculate growth rates
      todayGrowth: {
        listings: analytics.today.totalListings || 0,
        flats: analytics.today.flatListings || 0,
        pgs: analytics.today.pgListings || 0
      },
      monthlyGrowth: {
        listings: analytics.thisMonth.totalListings || 0,
        flats: analytics.thisMonth.flatListings || 0,
        pgs: analytics.thisMonth.pgListings || 0,
        users: analytics.thisMonth.users || 0
      },
      // Combine city data
      topCities: [
        ...((analytics.topCities?.flats || []).map(city => ({
          ...city,
          type: 'flat'
        }))),
        ...((analytics.topCities?.pgs || []).map(city => ({
          ...city,
          type: 'pg'
        })))
      ].reduce((acc, city) => {
        const existing = acc.find(c => c._id === city._id);
        if (existing) {
          existing.count += city.count;
          existing.types = [...(existing.types || [existing.type]), city.type];
        } else {
          acc.push({ ...city, types: [city.type] });
        }
        return acc;
      }, []).sort((a, b) => b.count - a.count).slice(0, 10)
    };
  },

  // Date formatting helper
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Status formatting
  getStatusBadgeColor: (status, type = 'listing') => {
    if (type === 'listing') {
      return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }
    
    if (type === 'user') {
      switch (status) {
        case 'verified': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'under_review': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    
    return 'bg-gray-100 text-gray-800';
  }
};

export default adminService;
