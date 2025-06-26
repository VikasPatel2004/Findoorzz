import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function login(email, password) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
}

async function register(userData) {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
  return response.data;
}

async function getUserProfile(token) {
  const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function updateUserProfile(profileData, token) {
  const response = await axios.put(`${API_BASE_URL}/auth/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  login,
  register,
  getUserProfile,
  updateUserProfile,
};