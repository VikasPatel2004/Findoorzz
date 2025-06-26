import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function createPayment(paymentData, token) {
  const response = await axios.post(`${API_BASE_URL}/payments`, paymentData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

async function getUserPayments(token) {
  const response = await axios.get(`${API_BASE_URL}/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export default {
  createPayment,
  getUserPayments,
};