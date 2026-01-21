import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
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
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const latestReading = readings[0];
  const currentStatus = latestReading?.status || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <Link to="/" className="text-blue-100 hover:text-white mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <p className="text-sm text-blue-100">Station ID: {station.stationId}</p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="text-gray-600 text-sm">Current Level</div>
            <div className="text-3xl font-bold text-blue-600">
              {latestReading?.waterLevel || 'N/A'}m
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {latestReading && latestReading.waterLevel < station.thresholds.warning 
                ? `${(station.thresholds.warning - latestReading.waterLevel).toFixed(2)}m below warning` 
                : 'Above threshold'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="text-gray-600 text-sm">Status</div>
            <div
              className={`text-2xl font-bold ${
                currentStatus === 'NORMAL'
                  ? 'text-green-600'
                  : currentStatus === 'WARNING'
                  ? 'text-orange-600'
                  : 'text-red-600'
              }`}
            >
              {currentStatus}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentStatus === 'NORMAL' ? '✅ All Clear' : '⚠️ Alert Active'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="text-gray-600 text-sm">Battery Level</div>
            <div className="text-3xl font-bold text-gray-800">
              {latestReading?.batteryLevel || 'N/A'}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {latestReading && latestReading.batteryLevel > 80 ? 'Good' : 'Low Battery'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
            <div className="text-gray-600 text-sm">Warning Level</div>
            <div className="text-3xl font-bold text-orange-500">
              {station.thresholds.warning}m
            </div>
            <div className="text-xs text-gray-500 mt-1">First threshold</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <div className="text-gray-600 text-sm">Danger Level</div>
            <div className="text-3xl font-bold text-red-500">
              {station.thresholds.danger}m
            </div>
            <div className="text-xs text-gray-500 mt-1">Critical threshold</div>
          </div>
        </div>

        {/* Grid Layout for Charts and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart - Spans 2 columns */}
          <div className="lg:col-span-2">
            {readings.length > 0 ? (
              <HistoryChart readings={readings} thresholds={station.thresholds} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                No historical data available
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="space-y-4">
            {/* Threshold Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-3">Alert Thresholds</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <div>
                    <div className="font-semibold text-sm">Normal</div>
                    <div className="text-xs text-gray-600">Below warning level</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    &lt; {station.thresholds.warning}m
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                  <div>
                    <div className="font-semibold text-sm">Warning</div>
                    <div className="text-xs text-gray-600">Monitor closely</div>
                  </div>
                  <div className="text-lg font-bold text-orange-600">
                    {station.thresholds.warning}m
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded border-l-4 border-red-500">
                  <div>
                    <div className="font-semibold text-sm">Danger</div>
                    <div className="text-xs text-gray-600">Immediate action</div>
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {station.thresholds.danger}m
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-3">Location Details</h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <span className="text-gray-600 text-sm mr-2">📍</span>
                  <div>
                    <div className="text-sm font-medium">Coordinates</div>
                    <div className="text-xs text-gray-600">
                      {station.location.lat.toFixed(4)}°N, {station.location.lng.toFixed(4)}°E
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 text-sm mr-2">🏷️</span>
                  <div>
                    <div className="text-sm font-medium">Station ID</div>
                    <div className="text-xs text-gray-600">{station.stationId}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 text-sm mr-2">⏱️</span>
                  <div>
                    <div className="text-sm font-medium">Last Update</div>
                    <div className="text-xs text-gray-600">
                      {new Date(station.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-3">24-Hour Statistics</h3>
              {readings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maximum:</span>
                    <span className="font-bold text-red-600">
                      {Math.max(...readings.map(r => r.waterLevel)).toFixed(2)}m
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Minimum:</span>
                    <span className="font-bold text-green-600">
                      {Math.min(...readings.map(r => r.waterLevel)).toFixed(2)}m
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average:</span>
                    <span className="font-bold text-blue-600">
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
