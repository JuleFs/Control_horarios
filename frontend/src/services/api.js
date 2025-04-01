import axios from 'axios';

// Importante: Asegúrate que esta URL coincida con tu servidor backend
const API_URL = 'http://localhost:3001';

// Crear una instancia de axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Habilitar envío de cookies
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
    console.error('Error en interceptor de request:', error);
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
      // Comentado para evitar redireccionamientos automáticos que puedan causar problemas
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const API = {
  // Autenticación
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Usuarios
  getUsers: () => axiosInstance.get('/auth/users'),
  createUser: async (userData) => {
    try {
      // Crear el usuario en el sistema de autenticación
      const userResponse = await axiosInstance.post('/auth/register', userData);
      
      // Si es un estudiante, también crear el registro en la tabla de estudiantes
      if (userData.role === 'student') {
        try {
          await API.createStudent({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || ''
          });
        } catch (error) {
          console.error('Error al crear estudiante asociado:', error);
        }
      }
      
      // Si es un profesor, también crear el registro en la tabla de profesores
      if (userData.role === 'teacher') {
        try {
          await API.createTeacher({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || ''
          });
        } catch (error) {
          console.error('Error al crear profesor asociado:', error);
        }
      }
      
      return userResponse;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },
  
  // Estudiantes
  getAllStudents: () => axiosInstance.get('/students'),
  getStudent: (id) => axiosInstance.get(`/students/${id}`),
  createStudent: (student) => axiosInstance.post('/students', student),
  updateStudent: (id, student) => axiosInstance.put(`/students/${id}`, student),
  deleteStudent: async (id) => {
    try {
      // Primero obtener el estudiante para su email
      const studentResponse = await axiosInstance.get(`/students/${id}`);
      const studentEmail = studentResponse.data.email;
      
      // Eliminar el estudiante
      await axiosInstance.delete(`/students/${id}`);
      
      // Opcional: intentar eliminar el usuario asociado
      // Nota: esta parte puede requerir un endpoint específico en el backend
      try {
        const usersResponse = await axiosInstance.get('/auth/users');
        const userToDelete = usersResponse.data.find(user => user.email === studentEmail);
        
        if (userToDelete) {
          await axiosInstance.delete(`/auth/users/${userToDelete.id}`);
        }
      } catch (error) {
        console.error('Advertencia: No se pudo eliminar el usuario asociado:', error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      throw error;
    }
  },

  // Profesores
  getAllTeachers: () => axiosInstance.get('/teachers'),
  getTeacher: (id) => axiosInstance.get(`/teachers/${id}`),
  createTeacher: (teacher) => axiosInstance.post('/teachers', teacher),
  updateTeacher: (id, teacher) => axiosInstance.put(`/teachers/${id}`, teacher),
  deleteTeacher: async (id) => {
    try {
      // Primero obtener el profesor para su email
      const teacherResponse = await axiosInstance.get(`/teachers/${id}`);
      const teacherEmail = teacherResponse.data.email;
      
      // Eliminar el profesor
      await axiosInstance.delete(`/teachers/${id}`);
      
      // Opcional: intentar eliminar el usuario asociado
      // Nota: esta parte puede requerir un endpoint específico en el backend
      try {
        const usersResponse = await axiosInstance.get('/auth/users');
        const userToDelete = usersResponse.data.find(user => user.email === teacherEmail);
        
        if (userToDelete) {
          await axiosInstance.delete(`/auth/users/${userToDelete.id}`);
        }
      } catch (error) {
        console.error('Advertencia: No se pudo eliminar el usuario asociado:', error);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error al eliminar profesor:', error);
      throw error;
    }
  },

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