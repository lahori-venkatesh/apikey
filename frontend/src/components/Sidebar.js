import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
        </svg>
      )
    },
    {
      name: 'API Keys',
      path: '/dashboard/api-keys',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    {
      name: 'Rotation Schedule',
      path: '/dashboard/rotation',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      path: '/dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Monitoring',
      path: '/dashboard/monitoring',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-end h-16 px-6 border-b border-gray-200 flex-shrink-0 lg:hidden">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 px-5 flex-1 overflow-y-auto lg:mt-20">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={`flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-4 ${isActive(item.path) ? 'text-blue-700' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Upgrade section */}
        <div className="p-5 flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-5 text-white">
            <h4 className="text-base font-semibold mb-2">Upgrade to Pro</h4>
            <p className="text-sm text-blue-100 mb-4">
              Unlock advanced features and get unlimited API keys.
            </p>
            <Link 
              to="/pricing" 
              className="w-full bg-white text-blue-600 text-sm font-medium py-3 px-4 rounded-md hover:bg-blue-50 transition-colors block text-center"
              onClick={() => window.innerWidth < 1024 && onClose()}
            >
              Upgrade to Pro - $9/month
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;