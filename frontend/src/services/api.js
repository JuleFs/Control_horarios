import axios from 'axios';

const API_URL = 'http://localhost:3000';

const API = {
  // Estudiantes
  getAllStudents: () => axios.get(`${API_URL}/students`),
  createStudent: (student) => axios.post(`${API_URL}/students`, student),

  // Profesores
  getAllTeachers: () => axios.get(`${API_URL}/teachers`),
  createTeacher: (teacher) => axios.post(`${API_URL}/teachers`, teacher),

  // Clases
  getAllClasses: () => axios.get(`${API_URL}/classes`),
  createClass: (classData) => axios.post(`${API_URL}/classes`, classData),

  // Horarios
  getAllSchedules: () => axios.get(`${API_URL}/schedule`),
  getSchedule: (id) => axios.get(`${API_URL}/schedule/${id}`),
  createSchedule: (schedule) => axios.post(`${API_URL}/schedule`, schedule),
  updateSchedule: (id, schedule) => axios.put(`${API_URL}/schedule/${id}`, schedule),

  // Asistencia
  getAllAttendance: () => axios.get(`${API_URL}/attendance`),
  markAttendance: (attendance) => axios.post(`${API_URL}/attendance`, attendance),
};

export default API;