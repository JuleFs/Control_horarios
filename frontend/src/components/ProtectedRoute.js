import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const hasPermission = () => {
    if (requiredRole === 'admin') {
      return isAdmin();
    } else if (requiredRole === 'teacher') {
      return isAdmin() || isTeacher();
    } else if (requiredRole === 'student') {
      return isAdmin() || isTeacher() || isStudent();
    }
    return false;
  };

  if (!hasPermission()) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute; 