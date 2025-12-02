import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegistrationPage from './RegistrationPage';
import LandingPage from './LandingPage';

// Component to protect routes that require authentication
const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Component to handle routes that should only be accessible when not authenticated
const PublicRoutes = () => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/landing" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes for unauthenticated users */}
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Route>

        {/* Protected routes for authenticated users */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/landing" element={<LandingPage />} />
        </Route>
        
        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
