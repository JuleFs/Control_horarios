import axios from 'axios';

const API_URL = 'http://localhost:3000';
<<<<<<< Updated upstream

const API = {
  // Estudiantes
  getAllStudents: () => axios.get(`${API_URL}/students`),
  createStudent: (student) => axios.post(`${API_URL}/students`, student),
=======

// Crear una instancia de axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token en interceptor:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers de la petición:', config.headers);
    } else {
      console.warn('No hay token disponible');
    }
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Respuesta exitosa:', response);
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', error);
    console.error('Detalles del error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    if (error.response?.status === 401) {
      console.log('Error de autenticación detectado');
      if (!error.config.url.includes('/auth/login')) {
        console.log('Redirigiendo a login por error de autenticación');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const API = {
  // Autenticación
  login: async (credentials) => {
    try {
      console.log('Intentando login con:', credentials);
      const response = await axiosInstance.post('/auth/login', credentials);
      console.log('Respuesta completa de login:', response);
      
      if (!response.data || !response.data.token) {
        throw new Error('No se recibió el token del servidor');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error detallado en login:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  },

  // Usuarios
  getUsers: async () => {
    try {
      console.log('Obteniendo usuarios...');
      const response = await axiosInstance.get('/auth/users');
      console.log('Respuesta de getUsers:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getUsers:', error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      console.log('Creando usuario:', userData);
      const response = await axiosInstance.post('/auth/register', userData);
      console.log('Respuesta de createUser:', response.data);
      return response;
    } catch (error) {
      console.error('Error en createUser:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al crear el usuario. Por favor, inténtalo de nuevo.');
    }
  },
  getAllStudents2: async () => {
    try {
      console.log('Obteniendo estudiantes...');
      const response = await axiosInstance.get('/students');
      console.log('Respuesta de getAllStudents:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllStudents:', error);
      throw error;
    }
  },
  
  // Estudiantes
  getAllStudents: async () => {
    try {
      console.log('Obteniendo estudiantes...');
      const response = await axiosInstance.get('/students');
      console.log('Respuesta de getAllStudents:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllStudents:', error);
      throw error;
    }
  },
  getStudent: (id) => axiosInstance.get(`/students/${id}`),
  createStudent: (student) => axiosInstance.post('/students', student),
  updateStudent: (id, student) => axiosInstance.put(`/students/${id}`, student),
  deleteStudent: (id) => axiosInstance.delete(`/students/${id}`),
>>>>>>> Stashed changes

  // Profesores
  getAllTeachers: () => axios.get(`${API_URL}/teachers`),
  createTeacher: (teacher) => axios.post(`${API_URL}/teachers`, teacher),

  // Clases
  getAllClasses: () => axios.get(`${API_URL}/classes`),
  createClass: (classData) => axios.post(`${API_URL}/classes`, classData),

  // Horarios
<<<<<<< Updated upstream
  getAllSchedules: () => axios.get(`${API_URL}/schedule`),
  getSchedule: (id) => axios.get(`${API_URL}/schedule/${id}`),
  createSchedule: (schedule) => axios.post(`${API_URL}/schedule`, schedule),
  updateSchedule: (id, schedule) => axios.put(`${API_URL}/schedule/${id}`, schedule),
=======
  getAllSchedules: async () => {
    try {
      console.log('Obteniendo horarios...');
      const response = await axiosInstance.get('/schedules');
      console.log('Respuesta de getAllSchedules:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllSchedules:', error);
      throw error;
    }
  },
  getSchedule: (id) => axiosInstance.get(`/schedules/${id}`),
  createSchedule: (schedule) => axiosInstance.post('/schedules', schedule),
  updateSchedule: (id, schedule) => axiosInstance.put(`/schedules/${id}`, schedule),
  deleteSchedule: (id) => axiosInstance.delete(`/schedules/${id}`),
>>>>>>> Stashed changes

  // Asistencia
  getAllAttendance: () => axios.get(`${API_URL}/attendance`),
  markAttendance: (attendance) => axios.post(`${API_URL}/attendance`, attendance),
};

export default API;