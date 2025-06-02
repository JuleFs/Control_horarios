// frontend/src/api/axios.ts
import axios from 'axios';
import { getAuth } from '../utils/localStorage.ts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple request interceptor without token
axiosInstance.interceptors.request.use(
  (config) => {
    // In a token-less approach, we don't add Authorization headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor that handles authentication errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get an unauthorized response, redirect to login
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;