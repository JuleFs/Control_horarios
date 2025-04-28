import axios from 'axios';
import { getToken } from '../utils/localStorage.ts';

const API_URL = 'http://localhost:3000'; 

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Asegúrate que las cabeceras se establecen correctamente
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Axios response error:", error.response);
    if (error.response && error.response.status === 401) {
      console.log("Received 401 unauthorized, redirecting to login");
      localStorage.removeItem('auth');
      //window.location.href = '/login';
      console.error ("Error de Autenticacion, pero NO Direccionado")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;