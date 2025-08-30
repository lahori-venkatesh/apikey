import React, { useState } from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-72 flex flex-col min-h-screen">
        {/* Mobile menu button for sidebar */}
        <div className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-50">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;