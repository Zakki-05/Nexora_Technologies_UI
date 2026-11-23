import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/Modal';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // User does not have the required role
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/employee" replace />;
  }

  return <Outlet />;
};
