import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WebSocketManager from './components/WebSocketManager';
import { ToastProvider } from './contexts/ToastContext';
import { WebSocketProvider } from './contexts/WebSocketContext';

// Pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Token verification response:', data);
        if (data.user) {
          console.log('Setting user from token verification:', data.user);
          setUser(data.user);
        } else {
          console.log('No user data in verification response');
          localStorage.removeItem('token');
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    console.log('Login - User data received:', userData);
    setUser(userData);
  };

  const handleSignup = (userData) => {
    console.log('Signup - User data received:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <WebSocketProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <WebSocketManager user={user} />
            <Navbar isAuthenticated={!!user} onLogout={handleLogout} user={user} />
            
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing isAuthenticated={!!user} />} />
                
                {/* Auth Routes */}
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
                />
                <Route 
                  path="/signup" 
                  element={user ? <Navigate to="/dashboard" /> : <Signup onSignup={handleSignup} />} 
                />
                
                {/* Protected Routes */}
                <Route 
                  path="/dashboard/*" 
                  element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            {!user && <Footer />}
          </div>
        </Router>
      </WebSocketProvider>
    </ToastProvider>
  );
}

export default App;