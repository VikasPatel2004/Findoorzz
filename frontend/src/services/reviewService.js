import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getReviews(listingType, listingId) {
  const response = await axios.get(`${API_BASE_URL}/review/${listingType}/${listingId}`);
  return response.data;
}

async function createReview(listingType, listingId, reviewData, token) {
  const response = await axios.post(`${API_BASE_URL}/review/${listingType}/${listingId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function updateReview(reviewId, reviewData, token) {
  const response = await axios.put(`${API_BASE_URL}/review/${reviewId}`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function deleteReview(reviewId, token) {
  const response = await axios.delete(`${API_BASE_URL}/review/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};