import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useOrganizationsStore } from './stores/organizationsStore';

// Components
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { user, loading, initialize } = useAuthStore();
  const { setAuthToken, reset } = useOrganizationsStore();

  useEffect(() => {
    // Initialize authentication
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Set auth token for API requests when user changes
    if (user) {
      const token = useAuthStore.getState().getAccessToken();
      setAuthToken(token);
    } else {
      setAuthToken(null);
      reset(); // Clear organizations when user logs out
    }
  }, [user, setAuthToken, reset]);

  if (loading) {
    return (
      <div className="auth-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Header />}
        
        <Routes>
          {user ? (
            // Authenticated routes
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            // Unauthenticated routes
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;