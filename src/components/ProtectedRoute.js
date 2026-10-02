import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')); // Get user data from localStorage

  if (!user) {
    return <Navigate to="/" />; // Redirect to login if no user is logged in
  }

  return children;
};

export default ProtectedRoute;
