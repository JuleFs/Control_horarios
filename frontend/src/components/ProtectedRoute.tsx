import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { UserRole } from '../types/auth.types.ts';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  
  console.log("Protected Route Auth State:", authState);
  
  if (!authState.isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    //return <Navigate to="/login" replace />;
  }
  
  if (authState.user && !allowedRoles.includes(authState.user.userType)) {
    console.log("Usuario no permitido:", authState.user.userType);
    // Redirect to appropriate dashboard
    switch (authState.user.userType) {
      case UserRole.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case UserRole.ALUMNO:
        return <Navigate to="/alumno/dashboard" replace />;
      case UserRole.MAESTRO:
        return <Navigate to="/maestro/dashboard" replace />;
      case UserRole.CHECADOR:
        return <Navigate to="/checador/dashboard" replace />;
    }
  }
  
  console.log("Access granted to protected route");
  return <Outlet />;
};

export default ProtectedRoute;
