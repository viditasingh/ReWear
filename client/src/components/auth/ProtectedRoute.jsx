import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but should not access this route (like login/signup)
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && (!user || user.role !== 'admin')) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
