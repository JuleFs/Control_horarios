import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { UserRole } from '../types/auth.types.ts';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  
  // Si no está autenticado, redirigir al login
  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado pero no tiene el rol correcto, redirigir a su dashboard correspondiente
  if (!allowedRoles.includes(authState.user.userType)) {
    switch (authState.user.userType) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.ALUMNO:
        return <Navigate to="/alumno/dashboard" replace />;
      case UserRole.MAESTRO:
        return <Navigate to="/maestro/dashboard" replace />;
      case UserRole.CHECADOR:
        return <Navigate to="/checador/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }
  
  // Si está autenticado y tiene el rol correcto, mostrar las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;