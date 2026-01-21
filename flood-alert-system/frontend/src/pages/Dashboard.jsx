import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapView from '../components/MapView';
import StatusCard from '../components/StatusCard';
import StatsOverview from '../components/StatsOverview';
import WeatherWidget from '../components/WeatherWidget';
import RecentActivity from '../components/RecentActivity';
import RiskAssessment from '../components/RiskAssessment';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStations = async () => {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      setStations(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchStations, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading flood monitoring data..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchStations} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <span className="mr-2">🌊</span>
                Sri Lanka Flood Alert System
              </h1>
              <p className="text-sm text-blue-100">Real-time water level monitoring across Sri Lanka</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-4">
                <div className="text-sm text-blue-100">Last Updated</div>
                <div className="text-lg font-semibold">{new Date().toLocaleTimeString()}</div>
              </div>
              <a
                href="/analytics"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
              >
                <span className="mr-2">📊</span>
                Analytics
              </a>
              <a
                href="/admin"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
              >
                <span className="mr-2">⚙️</span>
                Admin Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 pt-4">
        <StatsOverview stations={stations} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden container mx-auto px-4 pb-4">
        {/* Map Section */}
        <div className="flex-1 relative rounded-lg overflow-hidden shadow-lg mr-4">
          <MapView stations={stations} />
        </div>

        {/* Sidebar - Scrollable */}
        <div className="w-96 overflow-y-auto space-y-4">
          <WeatherWidget />
          <RiskAssessment stations={stations} />
          <StatusCard stations={stations} />
          <RecentActivity stations={stations} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
