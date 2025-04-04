import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types/auth.types';

// Pages
import LoginPage from './pages/Login';
// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/UserManagement';
// Student Pages
import AlumnoDashboard from './pages/alumno/AlumnoDashboard';
import AlumnoHorarios from './pages/alumno/Horarios';
// Teacher Pages
import MaestroDashboard from './pages/maestro/MaestroDashboard';
// Checker Pages
import ChecadorDashboard from './pages/checador/ChecadorDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              {/* Add more admin routes here */}
            </Route>
            
            {/* Student routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ALUMNO]} />}>
              <Route path="/alumno/dashboard" element={<AlumnoDashboard />} />
              <Route path="/alumno/horarios" element={<AlumnoHorarios />} />
              {/* Add more student routes here */}
            </Route>
            
            {/* Teacher routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.MAESTRO]} />}>
              <Route path="/maestro/dashboard" element={<MaestroDashboard />} />
              {/* Add more teacher routes here */}
            </Route>
            
            {/* Checker routes */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.CHECADOR]} />}>
              <Route path="/checador/dashboard" element={<ChecadorDashboard />} />
              {/* Add more checker routes here */}
            </Route>
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
