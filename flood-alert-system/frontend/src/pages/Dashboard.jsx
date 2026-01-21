import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Waves, BarChart3, Settings, Clock } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white shadow-xl border-b border-teal-700 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Waves className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Sri Lanka Flood Alert System
                </h1>
                <p className="text-xs text-teal-50 font-medium">Real-time water level monitoring across Sri Lanka</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <div className="text-xs text-teal-50 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last Updated
                </div>
                <div className="text-sm font-semibold">{new Date().toLocaleTimeString()}</div>
              </div>
              <a
                href="/analytics"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </a>
              <a
                href="/admin"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-medium py-2 px-4 rounded-lg transition flex items-center gap-2 text-sm"
              >
                <Settings className="w-4 h-4" />
                Admin
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 pt-6 relative z-10">
        <StatsOverview stations={stations} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden container mx-auto px-6 pb-6 gap-6 relative z-10">
        {/* Map Section */}
        <div className="flex-1 relative rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
          <MapView stations={stations} />
        </div>

        {/* Sidebar - Scrollable */}
        <div className="w-96 overflow-y-auto space-y-4 pr-2">
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
