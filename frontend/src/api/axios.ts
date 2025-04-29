import { getToken } from '../utils/localStorage.ts';
import axios, {AxiosHeaders} from 'axios';

// Update with your actual backend URL
const API_URL = 'http://localhost:3000'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Make sure config.headers is defined
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url);
    } else {
      console.log('Request without token:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error?.response?.status, error?.response?.data);
    
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      console.log('Authentication error (401), redirecting to login');
      localStorage.removeItem('auth');
      // Use a more reliable way to redirect
      if (window.location.pathname !== '/login') {
       // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Add CORS headers if needed
// axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default axiosInstance;