import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Schedules from './pages/Schedules';
import Attendance from './pages/Attendance';
import Unauthorized from './pages/Unauthorized';
import Users from './pages/Users';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navigation />
          <Container className="mt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Rutas protegidas para administradores */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teachers"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Teachers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/classes"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Classes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedules"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Schedules />
                  </ProtectedRoute>
                }
              />

              {/* Ruta de asistencia accesible para todos los usuarios autenticados */}
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Attendance />
                  </ProtectedRoute>
                }
              />

              {/* Redirección por defecto */}
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;