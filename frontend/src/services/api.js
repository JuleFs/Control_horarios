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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Usuarios
  getUsers: () => axiosInstance.get('/auth/users'),
  createUser: (userData) => axiosInstance.post('/auth/register', userData),
  
  // Estudiantes
  getAllStudents: () => axiosInstance.get('/students'),
  getStudent: (id) => axiosInstance.get(`/students/${id}`),
  createStudent: (student) => axiosInstance.post('/students', student),
  updateStudent: (id, student) => axiosInstance.put(`/students/${id}`, student),
  deleteStudent: (id) => axiosInstance.delete(`/students/${id}`),

  // Profesores
  getAllTeachers: () => axiosInstance.get('/teachers'),
  getTeacher: (id) => axiosInstance.get(`/teachers/${id}`),
  createTeacher: (teacher) => axiosInstance.post('/teachers', teacher),
  updateTeacher: (id, teacher) => axiosInstance.put(`/teachers/${id}`, teacher),
  deleteTeacher: (id) => axiosInstance.delete(`/teachers/${id}`),

  // Clases
  getAllClasses: () => axiosInstance.get('/classes'),
  getClass: (id) => axiosInstance.get(`/classes/${id}`),
  createClass: (classData) => axiosInstance.post('/classes', classData),
  updateClass: (id, classData) => axiosInstance.put(`/classes/${id}`, classData),
  deleteClass: (id) => axiosInstance.delete(`/classes/${id}`),

  // Horarios
  getAllSchedules: () => axiosInstance.get('/schedule'),
  getSchedule: (id) => axiosInstance.get(`/schedule/${id}`),
  createSchedule: (schedule) => axiosInstance.post('/schedule', schedule),
  updateSchedule: (id, schedule) => axiosInstance.put(`/schedule/${id}`, schedule),
  deleteSchedule: (id) => axiosInstance.delete(`/schedule/${id}`),

  // Asistencia
  getAllAttendance: () => axiosInstance.get('/attendance'),
  getAttendance: (id) => axiosInstance.get(`/attendance/${id}`),
  markAttendance: (attendance) => axiosInstance.post('/attendance', attendance),
  updateAttendance: (id, attendance) => axiosInstance.put(`/attendance/${id}`, attendance),
  deleteAttendance: (id) => axiosInstance.delete(`/attendance/${id}`),
};

export default API;