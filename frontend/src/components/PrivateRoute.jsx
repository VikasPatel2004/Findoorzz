import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // You can return a loading spinner here if desired
    return null;
  }

  if (!user) {
    return <Navigate to="/LoginPage" replace />;
  }

  return children;
};

export default PrivateRoute;
