import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [trends, setTrends] = useState(null);
  const [correlations, setCorrelations] = useState([]);
  const [riskForecast, setRiskForecast] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [predRes, trendRes, corrRes, riskRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/predictions`),
        axios.get(`${API_URL}/analytics/trends`),
        axios.get(`${API_URL}/analytics/correlations`),
        axios.get(`${API_URL}/analytics/risk-forecast`),
        axios.get(`${API_URL}/analytics/statistics`)
      ]);

      setPredictions(predRes.data);
      setTrends(trendRes.data);
      setCorrelations(corrRes.data);
      setRiskForecast(riskRes.data);
      setStatistics(statsRes.data);
      
      if (predRes.data.length > 0) {
        setSelectedStation(predRes.data[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Analyzing data and generating predictions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <Link to="/" className="text-indigo-100 hover:text-white mb-2 inline-block text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <span className="mr-2">📊</span>
            Advanced Analytics & Predictions
          </h1>
          <p className="text-sm text-indigo-100">AI-powered insights and forecasting system</p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-xs opacity-90 mb-1">Total Data Points</div>
              <div className="text-3xl font-bold">{statistics.totalReadings}</div>
              <div className="text-xs mt-1 opacity-75">Last 24 hours</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-xs opacity-90 mb-1">Avg Water Level</div>
              <div className="text-3xl font-bold">{statistics.avgWaterLevel}m</div>
              <div className="text-xs mt-1 opacity-75">System-wide</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-xs opacity-90 mb-1">Active Stations</div>
              <div className="text-3xl font-bold">{statistics.dataQuality.activeStations}</div>
              <div className="text-xs mt-1 opacity-75">of {statistics.totalStations}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-xs opacity-90 mb-1">Avg Battery</div>
              <div className="text-3xl font-bold">{statistics.dataQuality.avgBattery}%</div>
              <div className="text-xs mt-1 opacity-75">System health</div>
            </div>
          </div>
        )}

        {/* Risk Forecast */}
        {riskForecast && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">⚠️</span>
              Risk Forecast - Next 6 Hours
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* High Risk */}
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔴</span>
                  High Risk ({riskForecast.highRisk.length})
                </h3>
                {riskForecast.highRisk.length === 0 ? (
                  <p className="text-sm text-red-600">No high-risk stations</p>
                ) : (
                  <div className="space-y-2">
                    {riskForecast.highRisk.map(station => (
                      <div key={station.stationId} className="bg-white p-3 rounded border border-red-200">
                        <div className="font-semibold text-sm">{station.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Current: {station.currentLevel}m → {station.predictedLevel}m
                        </div>
                        {station.timeToWarning && (
                          <div className="text-xs text-red-700 font-semibold mt-1">
                            ⚡ Alert in ~{station.timeToWarning}h
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medium Risk */}
              <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🟠</span>
                  Medium Risk ({riskForecast.mediumRisk.length})
                </h3>
                {riskForecast.mediumRisk.length === 0 ? (
                  <p className="text-sm text-orange-600">No medium-risk stations</p>
                ) : (
                  <div className="space-y-2">
                    {riskForecast.mediumRisk.map(station => (
                      <div key={station.stationId} className="bg-white p-3 rounded border border-orange-200">
                        <div className="font-semibold text-sm">{station.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Current: {station.currentLevel}m
                        </div>
                        {station.timeToWarning && (
                          <div className="text-xs text-orange-700 font-semibold mt-1">
                            Monitor: Alert in ~{station.timeToWarning}h
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Risk */}
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🟢</span>
                  Low Risk ({riskForecast.lowRisk.length})
                </h3>
                <p className="text-sm text-green-700">
                  {riskForecast.lowRisk.length} stations operating normally
                </p>
                <div className="text-xs text-green-600 mt-2">
                  No immediate concerns detected
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Station Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-lg mb-3">📍 Select Station</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {predictions.map(station => (
                <button
                  key={station.stationId}
                  onClick={() => setSelectedStation(station)}
                  className={`w-full text-left p-3 rounded transition ${
                    selectedStation?.stationId === station.stationId
                      ? 'bg-indigo-100 border-2 border-indigo-500'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">{station.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Current: {station.currentLevel}m
                    <span className={`ml-2 font-semibold ${
                      station.trend === 'rising' ? 'text-red-600' :
                      station.trend === 'falling' ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {station.trend === 'rising' ? '↑ Rising' :
                       station.trend === 'falling' ? '↓ Falling' :
                       '→ Stable'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Prediction Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4">
              🔮 6-Hour Prediction: {selectedStation?.name}
            </h3>
            {selectedStation && (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedStation.predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hoursAhead" 
                      label={{ value: 'Hours Ahead', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="level" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      name="Predicted Level"
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  {selectedStation.predictions.slice(0, 3).map((pred, idx) => (
                    <div key={idx} className={`p-3 rounded ${
                      pred.status === 'DANGER' ? 'bg-red-100 border border-red-300' :
                      pred.status === 'WARNING' ? 'bg-orange-100 border border-orange-300' :
                      'bg-green-100 border border-green-300'
                    }`}>
                      <div className="text-xs text-gray-600">+{pred.hoursAhead}h</div>
                      <div className="text-lg font-bold">{pred.level}m</div>
                      <div className="text-xs font-semibold">{pred.confidence}% confident</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trends & Correlations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* System Trends */}
          {trends && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <span className="mr-2">📈</span>
                System-Wide Trends
              </h3>
              
              <div className={`p-4 rounded-lg mb-4 ${
                trends.systemTrend === 'rising' ? 'bg-red-100' :
                trends.systemTrend === 'falling' ? 'bg-green-100' :
                'bg-blue-100'
              }`}>
                <div className="text-sm font-semibold">Overall Trend</div>
                <div className="text-2xl font-bold capitalize">{trends.systemTrend}</div>
                <div className="text-xs mt-1">
                  Avg change: {trends.avgChangeRate.toFixed(3)} m/hour
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-red-700">↑ Rising ({trends.rising.length})</span>
                  </div>
                  {trends.rising.slice(0, 3).map(s => (
                    <div key={s.stationId} className="text-xs bg-red-50 p-2 rounded mb-1">
                      {s.name}: +{s.changeRate.toFixed(3)} m/h
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-green-700">↓ Falling ({trends.falling.length})</span>
                  </div>
                  {trends.falling.slice(0, 3).map(s => (
                    <div key={s.stationId} className="text-xs bg-green-50 p-2 rounded mb-1">
                      {s.name}: {s.changeRate.toFixed(3)} m/h
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-700">→ Stable ({trends.stable.length})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Correlations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <span className="mr-2">🔗</span>
              Station Correlations
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Stations that tend to rise and fall together (indicates connected water systems)
            </p>

            {correlations.length === 0 ? (
              <p className="text-sm text-gray-500">No strong correlations detected</p>
            ) : (
              <div className="space-y-3">
                {correlations.slice(0, 5).map((corr, idx) => (
                  <div key={idx} className="border border-gray-200 rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-semibold flex-1">
                        {corr.station1.name.split(' - ')[0]}
                        <span className="mx-2">↔️</span>
                        {corr.station2.name.split(' - ')[0]}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        corr.strength === 'Strong' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                      }`}>
                        {corr.strength}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Correlation: {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alert History */}
        {statistics && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-bold text-lg mb-4">📊 Alert History (24 Hours)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Normal', count: statistics.alertHistory.normal, fill: '#22c55e' },
                { name: 'Warning', count: statistics.alertHistory.warning, fill: '#f59e0b' },
                { name: 'Danger', count: statistics.alertHistory.danger, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
