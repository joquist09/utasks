import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api/auth';
import Header from '../common/Header';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default ProtectedRoute;