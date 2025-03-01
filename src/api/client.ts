import axios from 'axios';

// Use environment to determine which API to use
const isDevelopment = import.meta.env.DEV;
const API_URL = isDevelopment 
  ? "http://localhost:5000/api/v1" 
  : 'https://safebike.onrender.com/api/v1';

console.log('Using API URL:', API_URL); // Debug output

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error logging
client.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default client;