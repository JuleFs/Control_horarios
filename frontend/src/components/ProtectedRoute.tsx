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
  
  // Log authentication state for debugging
  useEffect(() => {
    console.log('ProtectedRoute - Current path:', location.pathname);
    console.log('ProtectedRoute - Auth state:', {
      isAuthenticated: authState.isAuthenticated,
      userType: authState.user?.userType,
      allowedRoles
    });
  }, [authState, allowedRoles, location.pathname]);
  
  // Check if user is authenticated
  if (!authState.isAuthenticated || !authState.user) {
    console.log('User not authenticated, redirecting to login');
    // Redirect to login page and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has the required role
  if (!allowedRoles.includes(authState.user.userType)) {
    console.log('User does not have required role, redirecting to appropriate dashboard');
    
    // User is logged in but doesn't have permission
    // Redirect to their appropriate dashboard
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
  
  // User is authenticated and has the correct role, render the routes
  console.log('User authorized, rendering content');
  return <Outlet />;
};

export default ProtectedRoute;