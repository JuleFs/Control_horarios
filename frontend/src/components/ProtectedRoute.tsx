// frontend/src/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { UserRole } from '../types/auth.types.ts';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { authState } = useAuth();
  const location = useLocation();
  
  // Ensure the authentication state persists between page navigations
  useEffect(() => {
    // This is just to trigger a re-render when the location changes,
    // ensuring the auth state is checked for each route
  }, [location]);
  
  // If not authenticated, redirect to login
  if (!authState.isAuthenticated || !authState.user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user doesn't have an allowed role, redirect to their appropriate dashboard
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
  
  // User is authenticated and has permission, show the protected route
  return <Outlet />;
};

export default ProtectedRoute;