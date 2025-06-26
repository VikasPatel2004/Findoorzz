import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getUserProfile(token) {
  const response = await axios.get(`${API_BASE_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function updateUserProfile(profileData, token) {
  const response = await axios.put(`${API_BASE_URL}/user/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  getUserProfile,
  updateUserProfile,
};