import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getReviews(listingType, listingId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/${listingType}/${listingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}

async function createReview(reviewData, token) {
  try {
    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

async function updateReview(reviewId, reviewData, token) {
  try {
    const response = await axios.put(`${API_BASE_URL}/reviews/${reviewId}`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

async function deleteReview(reviewId, token) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/reviews/${reviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

export default {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};