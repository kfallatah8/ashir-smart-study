
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-primary">404</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Sorry, we couldn't find the page you're looking for: {location.pathname}
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
