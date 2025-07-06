import { apiService } from './apiService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment variables:', import.meta.env);

export const listingService = {
  // Get all listings with caching
  getAllListings: (filters = {}) => 
    apiService.get('/listings', filters, true),
  
  // Get PG listings with caching
  getPGListings: (filters = {}) => 
    apiService.get('/listings/pg', filters, true),
  
  // Get Flat listings with caching
  getFlatListings: (filters = {}) => 
    apiService.get('/listings/flat', filters, true),
  
  // Get single listing (no cache for real-time data)
  getListingById: (id) => 
    apiService.get(`/listings/${id}`, {}, false),
  
  // Get user's listings
  getUserListings: () => 
    apiService.get('/listings/user', {}, false),
  
  // Create new listing - handle both FormData and regular data
  createListing: (listingData) => {
    // Check if listingData is FormData (for file uploads)
    if (listingData instanceof FormData) {
      return apiService.upload('/listings', listingData);
    } else {
      return apiService.post('/listings', listingData);
    }
  },
  
  // Update listing
  updateListing: (id, listingData) => {
    // Check if listingData is FormData (for file uploads)
    if (listingData instanceof FormData) {
      return apiService.upload(`/listings/${id}`, listingData, null, 'put');
    } else {
      return apiService.put(`/listings/${id}`, listingData);
    }
  },
  
  // Delete listing
  deleteListing: (id) => 
    apiService.delete(`/listings/${id}`),
  
  // Upload listing images
  uploadImages: (formData, onProgress) => 
    apiService.upload('/listings/upload-images', formData, onProgress),
  
  // Search listings
  searchListings: (query, filters = {}) => 
    apiService.get('/listings/search', { query, ...filters }, true),
  
  // Get saved listings
  getSavedListings: () => 
    apiService.get('/listings/saved', {}, false),
  
  // Get saved PG listings only (for students)
  getSavedPGListings: () => 
    apiService.get('/listings/saved/pg', {}, false),
  
  // Get saved Flat listings only (for renters)
  getSavedFlatListings: () => 
    apiService.get('/listings/saved/flat', {}, false),
  
  // Save/unsave listing
  toggleSavedListing: (listingId) => 
    apiService.post(`/listings/${listingId}/save`),
  
  // Clear cache when needed
  clearCache: () => {
    apiService.clearCacheEntry('/listings');
    apiService.clearCacheEntry('/listings/pg');
    apiService.clearCacheEntry('/listings/flat');
  },

  // Legacy methods for backward compatibility
  getAllFlatListings: async () => {
    try {
      const response = await apiService.get('/listings/flat/list-all', {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching flat listings:', error);
      throw error;
    }
  },

  getAllPGListings: async () => {
    try {
      const response = await apiService.get('/listings/pg/list-all', {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching PG listings:', error);
      throw error;
    }
  },

  getFilteredPGListings: async (query = '') => {
    try {
      const response = await apiService.get(`/listings/pg/filtered${query}`, {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching filtered PG listings:', error);
      throw error;
    }
  },

  getStudentPGListings: async (token) => {
    try {
      const response = await apiService.get('/listings/pg/student-listings', {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching student PG listings:', error);
      throw error;
    }
  },

  getFilteredStudentPGListings: async (query = '', token) => {
    try {
      const response = await apiService.get(`/listings/pg/student-filtered${query}`, {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching filtered student PG listings:', error);
      throw error;
    }
  },

  getMyCreatedFlatListings: async (token) => {
    try {
      const response = await apiService.get('/listings/flat/my-created', {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching my created flat listings:', error);
      throw error;
    }
  },

  getMyCreatedPGListings: async (token) => {
    try {
      const response = await apiService.get('/listings/pg/my-created', {}, false);
      return response;
    } catch (error) {
      console.error('Error fetching my created PG listings:', error);
      throw error;
    }
  },
};

export default listingService;
