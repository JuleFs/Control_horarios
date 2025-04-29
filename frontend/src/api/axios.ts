import axios from 'axios';
import { getAuth } from '../utils/localStorage.ts';

const API_URL = 'http://localhost:3000'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Removemos la lógica de token y simplificamos el interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // No incluimos Authorization header ya que no usamos tokens
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simplificamos el interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si hay error de autenticación, limpiamos el storage y redirigimos
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;