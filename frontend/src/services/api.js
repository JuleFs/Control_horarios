import axios from 'axios';

const API_URL = 'http://localhost:3001';

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
    console.error('Error en la respuesta:', error.response);
    if (error.response?.status === 401) {
      console.log('Error de autenticación, redirigiendo a login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
      console.log('Respuesta de login:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
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
  createUser: (userData) => axiosInstance.post('/auth/register', userData),
  
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
  updateStudent: (id, student) => axiosInstance.patch(`/students/${id}`, student),
  deleteStudent: (id) => axiosInstance.delete(`/students/${id}`),

  // Profesores
  getAllTeachers: async () => {
    try {
      console.log('Obteniendo profesores...');
      const response = await axiosInstance.get('/teachers');
      console.log('Respuesta de getAllTeachers:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllTeachers:', error);
      throw error;
    }
  },
  getTeacher: (id) => axiosInstance.get(`/teachers/${id}`),
  createTeacher: (teacher) => axiosInstance.post('/teachers', teacher),
  updateTeacher: (id, teacher) => axiosInstance.put(`/teachers/${id}`, teacher),
  deleteTeacher: (id) => axiosInstance.delete(`/teachers/${id}`),

  // Clases
  getAllClasses: async () => {
    try {
      console.log('Obteniendo clases...');
      const response = await axiosInstance.get('/classes');
      console.log('Respuesta de getAllClasses:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllClasses:', error);
      throw error;
    }
  },
  getClass: (id) => axiosInstance.get(`/classes/${id}`),
  createClass: (classData) => axiosInstance.post('/classes', classData),
  updateClass: (id, classData) => axiosInstance.put(`/classes/${id}`, classData),
  deleteClass: (id) => axiosInstance.delete(`/classes/${id}`),

  // Horarios
  getAllSchedules: async () => {
    try {
      console.log('Obteniendo horarios...');
      const response = await axiosInstance.get('/schedule');
      console.log('Respuesta de getAllSchedules:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllSchedules:', error);
      throw error;
    }
  },
  getSchedule: (id) => axiosInstance.get(`/schedule/${id}`),
  createSchedule: (schedule) => axiosInstance.post('/schedule', schedule),
  updateSchedule: (id, schedule) => axiosInstance.put(`/schedule/${id}`, schedule),
  deleteSchedule: (id) => axiosInstance.delete(`/schedule/${id}`),

  // Asistencia
  getAllAttendance: async () => {
    try {
      console.log('Obteniendo asistencias...');
      const response = await axiosInstance.get('/attendance');
      console.log('Respuesta de getAllAttendance:', response.data);
      return response;
    } catch (error) {
      console.error('Error en getAllAttendance:', error);
      throw error;
    }
  },
  getAttendance: (id) => axiosInstance.get(`/attendance/${id}`),
  markAttendance: (attendance) => axiosInstance.post('/attendance', attendance),
  updateAttendance: (id, attendance) => axiosInstance.put(`/attendance/${id}`, attendance),
  deleteAttendance: (id) => axiosInstance.delete(`/attendance/${id}`),
};

export default API;