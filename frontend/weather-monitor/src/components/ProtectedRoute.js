import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectPath = '/login', message = 'Please log in to continue' }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (isAuthenticated) return children;

  // Store the message in local storage to access it after redirect
  localStorage.setItem('loginMessage', message);
  
  return <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
