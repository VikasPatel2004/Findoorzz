import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getFlatListings({ page = 1, limit = 10, city, furnishingStatus, minRent, maxRent } = {}) {
  const params = { page, limit, city, furnishingStatus, minRent, maxRent };
  const response = await axios.get(`${API_BASE_URL}/listings/flat`, { params });
  return response.data;
}

async function getPGListings() {
  const response = await axios.get(`${API_BASE_URL}/listings/pg`);
  return response.data;
}

async function getListingById(type, id) {
  const response = await axios.get(`${API_BASE_URL}/listings/${type}/${id}`);
  return response.data;
}

async function createListing(type, listingData, token) {
  const headers = { Authorization: `Bearer ${token}` };
  if (listingData instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await axios.post(`${API_BASE_URL}/listings/${type}`, listingData, {
    headers
  });
  return response.data;
}

async function updateListing(type, id, listingData, token) {
  const headers = { Authorization: `Bearer ${token}` };
  if (listingData instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  const response = await axios.put(`${API_BASE_URL}/listings/${type}/${id}`, listingData, {
    headers
  });
  return response.data;
}

async function deleteListing(type, id, token) {
  const response = await axios.delete(`${API_BASE_URL}/listings/${type}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  getFlatListings,
  getPGListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
};