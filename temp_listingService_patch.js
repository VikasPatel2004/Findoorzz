async function saveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${API_BASE_URL}/listings/pg/${listingId}/save`, null, { headers });
  return response.data;
}

async function unsaveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/listings/pg/${listingId}/save`, { headers });
  return response.data;
}

async function getSavedListings(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${API_BASE_URL}/listings/pg/saved`, { headers });
  return response.data;
}

/* New methods for saved listings for PG */
async function saveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${API_BASE_URL}/listings/pg/${listingId}/save`, null, { headers });
  return response.data;
}

async function unsaveListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/listings/pg/${listingId}/save`, { headers });
  return response.data;
}

async function getSavedListings(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${API_BASE_URL}/listings/pg/saved`, { headers });
  return response.data;
}

/* New methods for saved listings for Flat */
async function saveFlatListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.post(`${API_BASE_URL}/listings/flat/${listingId}/save`, null, { headers });
  return response.data;
}

async function unsaveFlatListing(listingId, token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.delete(`${API_BASE_URL}/listings/flat/${listingId}/save`, { headers });
  return response.data;
}

async function getSavedFlatListings(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const response = await axios.get(`${API_BASE_URL}/listings/flat/saved`, { headers });
  return response.data;
}
a