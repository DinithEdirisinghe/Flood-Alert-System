import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Droplets, Activity, Battery, MapPin, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import HistoryChart from '../components/HistoryChart';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StationDetail = () => {
  const { id } = useParams();
  const [station, setStation] = useState(null);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch station details
        const stationRes = await axios.get(`${API_URL}/stations/${id}`);
        setStation(stationRes.data);

        // Fetch readings
        const readingsRes = await axios.get(`${API_URL}/readings/${id}`);
        setReadings(readingsRes.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return <LoadingSpinner message={`Loading ${id} station data...`} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <p className="font-bold text-lg">Error</p>
            </div>
            <p>{error}</p>
          </div>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const latestReading = readings[0];
  const currentStatus = latestReading?.status || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-xl border-b border-blue-700 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="text-blue-50 hover:text-white mb-3 inline-flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <MapPin className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{station.name}</h1>
              <p className="text-xs text-blue-50 font-medium">Station ID: {station.stationId}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              <div className="text-slate-600 text-sm font-medium">Current Level</div>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {latestReading?.waterLevel || 'N/A'}m
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {latestReading && latestReading.waterLevel < station.thresholds.warning 
                ? `${(station.thresholds.warning - latestReading.waterLevel).toFixed(2)}m below warning` 
                : 'Above threshold'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-600" />
              <div className="text-slate-600 text-sm font-medium">Status</div>
            </div>
            <div
              className={`text-2xl font-bold flex items-center gap-2 ${
                currentStatus === 'NORMAL'
                  ? 'text-green-600'
                  : currentStatus === 'WARNING'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            >
              {currentStatus === 'NORMAL' && <Activity className="w-5 h-5" />}
              {currentStatus === 'WARNING' && <AlertTriangle className="w-5 h-5" />}
              {currentStatus === 'DANGER' && <AlertTriangle className="w-5 h-5" />}
              {currentStatus}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              {currentStatus === 'NORMAL' ? 'All Clear' : 'Alert Active'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-4 h-4 text-green-600" />
              <div className="text-slate-600 text-sm font-medium">Battery Level</div>
            </div>
            <div className="text-3xl font-bold text-slate-800">
              {latestReading?.batteryLevel || 'N/A'}%
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {latestReading && latestReading.batteryLevel > 80 ? 'Good' : 'Low Battery'}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <div className="text-slate-600 text-sm font-medium">Warning Level</div>
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {station.thresholds.warning}m
            </div>
            <div className="text-xs text-slate-500 mt-2">First threshold</div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border-l-4 border-red-500">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div className="text-slate-600 text-sm font-medium">Danger Level</div>
            </div>
            <div className="text-3xl font-bold text-red-500">
              {station.thresholds.danger}m
            </div>
            <div className="text-xs text-slate-500 mt-2">Critical threshold</div>
          </div>
        </div>

        {/* Grid Layout for Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart - Spans 2 columns */}
          <div className="lg:col-span-2">
            {readings.length > 0 ? (
              <HistoryChart readings={readings} thresholds={station.thresholds} />
            ) : (
              <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-slate-200 text-center">
                <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No historical data available</p>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Threshold Info */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-800">Alert Thresholds</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Normal</div>
                    <div className="text-xs text-slate-600">Below warning level</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    &lt; {station.thresholds.warning}m
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-l-4 border-orange-500">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Warning</div>
                    <div className="text-xs text-slate-600">Monitor closely</div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {station.thresholds.warning}m
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border-l-4 border-red-500">
                  <div>
                    <div className="font-semibold text-sm text-slate-800">Danger</div>
                    <div className="text-xs text-slate-600">Immediate action</div>
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {station.thresholds.danger}m
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-800">Location Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Coordinates</div>
                    <div className="text-xs text-slate-600">
                      {station.location.lat.toFixed(4)}°N, {station.location.lng.toFixed(4)}°E
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Activity className="w-4 h-4 text-teal-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Station ID</div>
                    <div className="text-xs text-slate-600">{station.stationId}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <Clock className="w-4 h-4 text-teal-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-slate-800">Last Update</div>
                    <div className="text-xs text-slate-600">
                      {new Date(station.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Statistics */}
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-800">24-Hour Statistics</h3>
              </div>
              {readings.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg border-l-4 border-red-500">
                    <span className="text-sm font-medium text-slate-800">Maximum:</span>
                    <span className="font-bold text-lg text-red-600">
                      {Math.max(...readings.map(r => r.waterLevel)).toFixed(2)}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                    <span className="text-sm font-medium text-slate-800">Minimum:</span>
                    <span className="font-bold text-lg text-green-600">
                      {Math.min(...readings.map(r => r.waterLevel)).toFixed(2)}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
                    <span className="text-sm font-medium text-slate-800">Average:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {(readings.reduce((sum, r) => sum + r.waterLevel, 0) / readings.length).toFixed(2)}m
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Data Points:</span>
                    <span className="font-bold">{readings.length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationDetail;
