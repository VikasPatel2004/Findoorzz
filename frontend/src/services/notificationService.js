import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function getNotifications(token) {
  const response = await axios.get(`${API_BASE_URL}/notification`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function markNotificationAsRead(notificationId, token) {
  const response = await axios.put(`${API_BASE_URL}/notification/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  getNotifications,
  markNotificationAsRead,
};