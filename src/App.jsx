// App.jsx - Enforcing Profile Setup without loops
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// Loading Screen
const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// 1. Basic Auth Check
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

// 2. Profile Completion Check (New!)
const RequireProfile = ({ children }) => {
  const { userProfile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Check if profile exists and has required fields
  const isProfileComplete = userProfile?.department && userProfile?.year;

  if (!isProfileComplete) {
    // Redirect to setup if incomplete
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, loading, userProfile } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login />
        }
      />

      {/* Profile Setup - Protected by Auth, but NOT by Profile Check */}
      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />

      {/* Main App Routes - Protected by Auth AND Profile Check */}
      <Route path="/dashboard" element={<ProtectedRoute><RequireProfile><Dashboard /></RequireProfile></ProtectedRoute>} />
      <Route path="/browse-skills" element={<ProtectedRoute><RequireProfile><BrowseSkills /></RequireProfile></ProtectedRoute>} />
      <Route path="/post-skill" element={<ProtectedRoute><RequireProfile><PostSkill /></RequireProfile></ProtectedRoute>} />
      <Route path="/skill/:id" element={<ProtectedRoute><RequireProfile><SkillDetails /></RequireProfile></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><RequireProfile><Chat /></RequireProfile></ProtectedRoute>} />
      <Route path="/submit-work" element={<ProtectedRoute><RequireProfile><SubmitWork /></RequireProfile></ProtectedRoute>} />
      <Route path="/review/:id" element={<ProtectedRoute><RequireProfile><Review /></RequireProfile></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><RequireProfile><Profile /></RequireProfile></ProtectedRoute>} />

      {/* Catch all */}
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
