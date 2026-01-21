import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, Database, Droplets, Activity, AlertTriangle, TrendingUp, TrendingDown, Minus, Link2, ArrowLeft, Target } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white shadow-xl border-b border-teal-700 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="text-teal-50 hover:text-white mb-3 inline-flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Advanced Analytics & Predictions
              </h1>
              <p className="text-xs text-teal-50 font-medium">AI-powered insights and forecasting system</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 relative z-10">
        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg border border-teal-600">
              <Database className="w-6 h-6 mb-2 opacity-90" />
              <div className="text-xs opacity-90 font-medium mb-1">Total Data Points</div>
              <div className="text-3xl font-bold">{statistics.totalReadings}</div>
              <div className="text-xs mt-1 opacity-80">Last 24 hours</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg border border-blue-600">
              <Droplets className="w-6 h-6 mb-2 opacity-90" />
              <div className="text-xs opacity-90 font-medium mb-1">Avg Water Level</div>
              <div className="text-3xl font-bold">{statistics.avgWaterLevel}m</div>
              <div className="text-xs mt-1 opacity-80">System-wide</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg border border-green-600">
              <Activity className="w-6 h-6 mb-2 opacity-90" />
              <div className="text-xs opacity-90 font-medium mb-1">Active Stations</div>
              <div className="text-3xl font-bold">{statistics.dataQuality.activeStations}</div>
              <div className="text-xs mt-1 opacity-80">of {statistics.totalStations}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg border border-purple-600">
              <Activity className="w-6 h-6 mb-2 opacity-90" />
              <div className="text-xs opacity-90 font-medium mb-1">Avg Battery</div>
              <div className="text-3xl font-bold">{statistics.dataQuality.avgBattery}%</div>
              <div className="text-xs mt-1 opacity-80">System health</div>
            </div>
          </div>
        )}

        {/* Risk Forecast */}
        {riskForecast && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-800">Risk Forecast - Next 6 Hours</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* High Risk */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-700" />
                  <h3 className="font-bold text-red-800">
                    High Risk ({riskForecast.highRisk.length})
                  </h3>
                </div>
                {riskForecast.highRisk.length === 0 ? (
                  <p className="text-sm text-red-600">No high-risk stations</p>
                ) : (
                  <div className="space-y-2">
                    {riskForecast.highRisk.map(station => (
                      <div key={station.stationId} className="bg-white p-3 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
                        <div className="font-semibold text-sm text-slate-800">{station.name}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          Current: {station.currentLevel}m → {station.predictedLevel}m
                        </div>
                        {station.timeToWarning && (
                          <div className="text-xs text-red-700 font-semibold mt-2 flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Alert in ~{station.timeToWarning}h
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Medium Risk */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-700" />
                  <h3 className="font-bold text-orange-800">
                    Medium Risk ({riskForecast.mediumRisk.length})
                  </h3>
                </div>
                {riskForecast.mediumRisk.length === 0 ? (
                  <p className="text-sm text-orange-600">No medium-risk stations</p>
                ) : (
                  <div className="space-y-2">
                    {riskForecast.mediumRisk.map(station => (
                      <div key={station.stationId} className="bg-white p-3 rounded-lg border border-orange-200 hover:shadow-md transition-shadow">
                        <div className="font-semibold text-sm text-slate-800">{station.name}</div>
                        <div className="text-xs text-slate-600 mt-1">
                          Current: {station.currentLevel}m
                        </div>
                        {station.timeToWarning && (
                          <div className="text-xs text-orange-700 font-semibold mt-2">
                            Monitor: Alert in ~{station.timeToWarning}h
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Low Risk */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-green-700" />
                  <h3 className="font-bold text-green-800">
                    Low Risk ({riskForecast.lowRisk.length})
                  </h3>
                </div>
                <p className="text-sm text-green-700 font-medium">
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-lg text-slate-800">Select Station</h3>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {predictions.map(station => {
                const TrendIcon = station.trend === 'rising' ? TrendingUp : 
                                 station.trend === 'falling' ? TrendingDown : Minus;
                return (
                  <button
                    key={station.stationId}
                    onClick={() => setSelectedStation(station)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedStation?.stationId === station.stationId
                        ? 'bg-teal-50 border-2 border-teal-500 shadow-md'
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-semibold text-sm text-slate-800">{station.name}</div>
                    <div className="text-xs text-slate-600 mt-2 flex items-center gap-2">
                      Current: <span className="font-bold">{station.currentLevel}m</span>
                      <span className={`flex items-center gap-1 font-semibold ${
                        station.trend === 'rising' ? 'text-red-600' :
                        station.trend === 'falling' ? 'text-green-600' :
                        'text-slate-600'
                      }`}>
                        <TrendIcon className="w-3 h-3" />
                        {station.trend === 'rising' ? 'Rising' :
                         station.trend === 'falling' ? 'Falling' :
                         'Stable'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prediction Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-lg text-slate-800">
                6-Hour Prediction: {selectedStation?.name}
              </h3>
            </div>
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
                    <div key={idx} className={`p-4 rounded-lg border-2 ${
                      pred.status === 'DANGER' ? 'bg-red-50 border-red-300' :
                      pred.status === 'WARNING' ? 'bg-orange-50 border-orange-300' :
                      'bg-green-50 border-green-300'
                    }`}>
                      <div className="text-xs text-slate-600 font-medium">+{pred.hoursAhead}h</div>
                      <div className="text-xl font-bold text-slate-800 my-1">{pred.level}m</div>
                      <div className="text-xs font-semibold text-slate-700">{pred.confidence}% confident</div>
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-lg text-slate-800">System-Wide Trends</h3>
              </div>
              
              <div className={`p-5 rounded-xl mb-5 border-2 ${
                trends.systemTrend === 'rising' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' :
                trends.systemTrend === 'falling' ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300' :
                'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
              }`}>
                <div className="text-sm font-semibold text-slate-700 mb-1">Overall Trend</div>
                <div className={`text-2xl font-bold capitalize flex items-center gap-2 ${
                  trends.systemTrend === 'rising' ? 'text-red-700' :
                  trends.systemTrend === 'falling' ? 'text-green-700' :
                  'text-blue-700'
                }`}>
                  {trends.systemTrend === 'rising' ? <TrendingUp className="w-6 h-6" /> :
                   trends.systemTrend === 'falling' ? <TrendingDown className="w-6 h-6" /> :
                   <Minus className="w-6 h-6" />}
                  {trends.systemTrend}
                </div>
                <div className="text-xs mt-2 text-slate-600">
                  Avg change: {trends.avgChangeRate.toFixed(3)} m/hour
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-red-700" />
                    <span className="text-sm font-semibold text-red-700">Rising ({trends.rising.length})</span>
                  </div>
                  {trends.rising.slice(0, 3).map(s => (
                    <div key={s.stationId} className="text-xs bg-red-50 p-2.5 rounded-lg mb-2 border border-red-100">
                      <span className="font-medium text-slate-700">{s.name}:</span> +{s.changeRate.toFixed(3)} m/h
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-semibold text-green-700">Falling ({trends.falling.length})</span>
                  </div>
                  {trends.falling.slice(0, 3).map(s => (
                    <div key={s.stationId} className="text-xs bg-green-50 p-2.5 rounded-lg mb-2 border border-green-100">
                      <span className="font-medium text-slate-700">{s.name}:</span> {s.changeRate.toFixed(3)} m/h
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Minus className="w-4 h-4 text-slate-700" />
                    <span className="text-sm font-semibold text-slate-700">Stable ({trends.stable.length})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Correlations */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-lg text-slate-800">Station Correlations</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
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
                    <div className="text-xs text-slate-600 font-medium">
                      Correlation: {corr.correlation > 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                    </div>
                    <div className="mt-3 bg-slate-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-lg text-slate-800">Alert History (24 Hours)</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Normal', count: statistics.alertHistory.normal, fill: '#10b981' },
                { name: 'Warning', count: statistics.alertHistory.warning, fill: '#f59e0b' },
                { name: 'Danger', count: statistics.alertHistory.danger, fill: '#ef4444' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
