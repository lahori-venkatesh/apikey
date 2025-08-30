import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const profileMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 px-24">
        {/* Logo - 16px from left */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <span className="text-xl font-bold text-gray-900">APIKey Pro</span>
          </Link>
        </div>

        {/* Desktop Navigation - 16px from right */}
        <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className={`${isActive('/') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className={`${isActive('/features') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                >
                  Features
                </Link>
                <Link 
                  to="/pricing" 
                  className={`${isActive('/pricing') ? 'text-blue-600' : 'text-gray-700'} hover:text-blue-600 transition-colors`}
                >
                  Pricing
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="text-gray-400 hover:text-gray-600 relative p-2 rounded-lg hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM16 3H4v2h12V3zM4 7h12v2H4V7zM4 11h12v2H4v-2z" />
                  </svg>
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Profile Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-10 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user?.plan || 'Free Plan'}
                          </span>
                        </div>
                      </div>
                      <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
                        </svg>
                        Dashboard
                      </Link>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </a>
                      <Link to="/pricing" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Billing & Usage
                      </Link>
                      <Link to="/pricing" className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade to Pro
                      </Link>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        API Documentation
                      </a>
                      <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Help & Support
                      </a>
                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={onLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        {/* Mobile menu button - 16px from right */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-gray-50">
              {!isAuthenticated ? (
                <>
                  <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
                  <Link to="/features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</Link>
                  <Link to="/pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pricing</Link>
                  <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Login</Link>
                  <Link to="/signup" className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-center">Sign Up</Link>
                </>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                  <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Dashboard</Link>
                  <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Profile Settings</a>
                  <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Billing & Usage</a>
                  <button onClick={onLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700">Sign out</button>
                </div>
              )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;