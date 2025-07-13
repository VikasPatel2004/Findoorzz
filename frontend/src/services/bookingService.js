import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function createBooking(bookingData, token) {
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('Request headers:', { Authorization: `Bearer ${token}` });
  console.log('Request data:', bookingData);
  
  const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function getUserBookings(token) {
  const response = await axios.get(`${API_BASE_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function cancelBooking(bookingId, token) {
  const response = await axios.delete(`${API_BASE_URL}/bookings/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  createBooking,
  getUserBookings,
  cancelBooking,
};