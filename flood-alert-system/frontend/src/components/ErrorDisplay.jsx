import React from 'react';
import { Link } from 'react-router-dom';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 text-sm">Unable to connect to the server</p>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-sm text-red-700 font-mono break-all">{error}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            🔄 Retry Connection
          </button>
          
          <Link
            to="/"
            className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-sm text-blue-900 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Make sure the backend server is running on port 5000</li>
            <li>• Check your internet connection</li>
            <li>• Verify MongoDB connection in backend/.env</li>
            <li>• Check if data has been seeded (run: npm run seed)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
