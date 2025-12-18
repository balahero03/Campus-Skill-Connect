// App.jsx - Main application with routing and profile setup redirect
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import BrowseSkills from './pages/BrowseSkills';
import PostSkill from './pages/PostSkill';
import SkillDetails from './pages/SkillDetails';
import Chat from './pages/Chat';
import SubmitWork from './pages/SubmitWork';
import Review from './pages/Review';
import Profile from './pages/Profile';

// Loading Component
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Protected Route Component - Checks if profile is complete
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if profile needs completion (no department or year set)
  const needsSetup = !userProfile?.department || !userProfile?.year;

  // Allow profile-setup page itself
  if (window.location.pathname === '/profile-setup') {
    return children;
  }

  // Redirect to setup if profile incomplete
  if (needsSetup) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Public Route - Login */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Profile Setup - Semi-protected (only for authenticated users) */}
      <Route
        path="/profile-setup"
        element={
          isAuthenticated ? <ProfileSetup /> : <Navigate to="/" replace />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/browse-skills"
        element={
          <ProtectedRoute>
            <BrowseSkills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post-skill"
        element={
          <ProtectedRoute>
            <PostSkill />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill/:id"
        element={
          <ProtectedRoute>
            <SkillDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/submit-work"
        element={
          <ProtectedRoute>
            <SubmitWork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review/:id"
        element={
          <ProtectedRoute>
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to dashboard or login */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
