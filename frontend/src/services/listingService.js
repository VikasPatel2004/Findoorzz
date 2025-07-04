import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get flat listings with optional filters
async function getFlatListings(token, query = '') {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await axios.get(`${API_BASE_URL}/listings/flat${query}`, { headers });
  return response.data;
}

// Get all flat listings (no filters)
async function getAllFlatListings() {
  const response = await axios.get(`${API_BASE_URL}/listings/flat/list-all`);
  return response.data;
}

// Get PG listings for owner
async function getPGListings(token) {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await axios.get(`${API_BASE_URL}/listings/pg`, { headers });
  return response.data;
}

// Get all PG listings (for students)
async function getAllPGListings() {
  const response = await axios.get(`${API_BASE_URL}/listings/pg/list-all`);
  return response.data;
}

// Get listing by type and id
async function getListingById(type, id) {
  const response = await axios.get(`${API_BASE_URL}/listings/${type}/${id}`);
  return response.data;
}

// Create a new listing
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

// Update a listing
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

// Delete a listing
async function deleteListing(type, id, token) {
  const response = await axios.delete(`${API_BASE_URL}/listings/${type}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

/* ----------- Saved Listings for PG ----------- */

// Save a PG listing (POST)
async function saveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${API_BASE_URL}/listings/pg/${listingId}/save`, null, { headers });
  return response.data;
}

// Unsave a PG listing (DELETE)
async function unsaveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/listings/pg/${listingId}/save`, { headers });
  return response.data;
}

// Get all saved PG listings for user
async function getSavedListings(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${API_BASE_URL}/listings/pg/saved`, { headers });
  return response.data;
}

/* ----------- Saved Listings for Flat (Renter) ----------- */

// Save a flat listing (POST)
async function saveFlatListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${API_BASE_URL}/listings/flat/${listingId}/save`, null, { headers });
  return response.data;
}

// Unsave a flat listing (DELETE)
async function unsaveFlatListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/listings/flat/${listingId}/save`, { headers });
  return response.data;
}

// Get all saved flat listings for user
async function getSavedFlatListings(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${API_BASE_URL}/listings/flat/saved`, { headers });
  return response.data;
}

export default {
  getFlatListings,
  getAllFlatListings,
  getPGListings,
  getAllPGListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  saveListing,
  unsaveListing,
  getSavedListings,
  saveFlatListing,
  unsaveFlatListing,
  getSavedFlatListings
};