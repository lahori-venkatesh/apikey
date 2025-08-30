import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Go Back
          </button>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/contact" className="text-blue-600 hover:text-blue-500">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;