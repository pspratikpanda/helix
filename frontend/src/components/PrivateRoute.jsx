import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
        {/* Animated compass loader spinner */}
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-heading text-gold tracking-widest animate-pulse">
          Charting the waters...
        </p>
      </div>
    );
  }

  // Redirect if no session token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
