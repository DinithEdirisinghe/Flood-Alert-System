import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Settings, Plus, Edit, Trash2, Play, AlertCircle, CheckCircle, ArrowLeft, Activity, MapPin, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminPanel = () => {
  const [stations, setStations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    stationId: '',
    name: '',
    lat: '',
    lng: '',
    warning: '',
    danger: ''
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await axios.get(`${API_URL}/stations`);
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/stations`, {
        stationId: formData.stationId,
        name: formData.name,
        location: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        },
        thresholds: {
          warning: parseFloat(formData.warning),
          danger: parseFloat(formData.danger)
        }
      });
      
      alert('✅ Station created successfully!');
      setShowAddModal(false);
      resetForm();
      fetchStations();
    } catch (error) {
      alert('❌ Error creating station: ' + error.response?.data?.error || error.message);
    }
  };

  const handleEditStation = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/stations/${editingStation.stationId}`, {
        thresholds: {
          warning: parseFloat(formData.warning),
          danger: parseFloat(formData.danger)
        }
      });
      
      alert('✅ Station updated successfully!');
      setShowEditModal(false);
      setEditingStation(null);
      resetForm();
      fetchStations();
    } catch (error) {
      alert('❌ Error updating station: ' + error.message);
    }
  };

  const openEditModal = (station) => {
    setEditingStation(station);
    setFormData({
      stationId: station.stationId,
      name: station.name,
      lat: station.location.lat,
      lng: station.location.lng,
      warning: station.thresholds.warning,
      danger: station.thresholds.danger
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      stationId: '',
      name: '',
      lat: '',
      lng: '',
      warning: '',
      danger: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl border-b border-purple-700 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <Link to="/" className="text-purple-50 hover:text-white mb-3 inline-flex items-center gap-2 text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
              <p className="text-xs text-purple-50 font-medium">Manage stations and simulate device data</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 relative z-10">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 px-6 rounded-xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-green-500"
          >
            <Plus className="w-6 h-6" />
            <span>Add New Station</span>
          </button>
          
          <button
            onClick={() => setShowSimulator(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-5 px-6 rounded-xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-blue-500"
          >
            <Play className="w-6 h-6" />
            <span>Device Simulator</span>
          </button>
          
          <button
            onClick={fetchStations}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-5 px-6 rounded-xl shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-slate-500"
          >
            <Activity className="w-6 h-6" />
            <span>Refresh Stations</span>
          </button>
        </div>

        {/* Stations List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-slate-800">All Stations ({stations.length})</h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Station ID</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Warning</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Danger</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, index) => (
                  <tr key={station.stationId} className={`transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-teal-50`}>
                    <td className="px-4 py-3 text-sm font-mono">{station.stationId}</td>
                    <td className="px-4 py-3 text-sm">{station.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {station.location.lat.toFixed(4)}, {station.location.lng.toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-sm text-orange-600 font-semibold">{station.thresholds.warning}m</td>
                    <td className="px-4 py-3 text-sm text-red-600 font-semibold">{station.thresholds.danger}m</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${
                        station.currentReading?.status === 'DANGER' ? 'bg-red-200 text-red-800' :
                        station.currentReading?.status === 'WARNING' ? 'bg-orange-200 text-orange-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {station.currentReading?.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditModal(station)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs mr-2 inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <Link
                        to={`/station/${station.stationId}`}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs inline-flex items-center gap-1 transition-colors"
                      >
                        <Activity className="w-3 h-3" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Station Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-800">Add New Station</h2>
            </div>
            <form onSubmit={handleAddStation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Station ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., my-device-01"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                    value={formData.stationId}
                    onChange={(e) => setFormData({...formData, stationId: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold mb-2 text-slate-700">Station Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., My Device - Lab"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Latitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="6.9271"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                      value={formData.lat}
                      onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Longitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="79.9831"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white"
                      value={formData.lng}
                      onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Warning Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="5.0"
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-orange-50/50"
                      value={formData.warning}
                      onChange={(e) => setFormData({...formData, warning: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Danger Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="7.0"
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-red-50/50"
                      value={formData.danger}
                      onChange={(e) => setFormData({...formData, danger: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Station
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Station Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <Edit className="w-7 h-7 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-800">Edit Station Thresholds</h2>
            </div>
            <form onSubmit={handleEditStation}>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border-l-4 border-teal-500">
                  <p className="text-sm text-slate-600 font-medium mb-1">Station ID</p>
                  <p className="font-mono font-bold text-slate-800">{formData.stationId}</p>
                </div>

                <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border-l-4 border-cyan-500">
                  <p className="text-sm text-slate-600 font-medium mb-1">Name</p>
                  <p className="font-bold text-slate-800">{formData.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Warning Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-orange-50/50"
                      value={formData.warning}
                      onChange={(e) => setFormData({...formData, warning: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-700">Danger Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-red-50/50"
                      value={formData.danger}
                      onChange={(e) => setFormData({...formData, danger: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  Update Station
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingStation(null); resetForm(); }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Simulator Modal */}
      {showSimulator && (
        <DeviceSimulator 
          stations={stations} 
          onClose={() => setShowSimulator(false)} 
        />
      )}
    </div>
  );
};

// Device Simulator Component
const DeviceSimulator = ({ stations, onClose }) => {
  const [selectedStation, setSelectedStation] = useState('');
  const [waterLevel, setWaterLevel] = useState('4.5');
  const [batteryLevel, setBatteryLevel] = useState('95');
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [log, setLog] = useState([]);

  const sendData = async () => {
    try {
      const response = await axios.post(`${API_URL}/readings`, {
        stationId: selectedStation,
        waterLevel: parseFloat(waterLevel),
        batteryLevel: parseInt(batteryLevel)
      });
      
      const timestamp = new Date().toLocaleTimeString();
      setLog(prev => [`[${timestamp}] ✅ Sent: ${waterLevel}m, Battery: ${batteryLevel}% - Alert: ${response.data.alert}`, ...prev.slice(0, 9)]);
      
      // Vary the data slightly for next reading
      setWaterLevel((parseFloat(waterLevel) + (Math.random() - 0.5) * 0.3).toFixed(2));
      setBatteryLevel(Math.max(70, parseInt(batteryLevel) - Math.floor(Math.random() * 2)));
    } catch (error) {
      const timestamp = new Date().toLocaleTimeString();
      setLog(prev => [`[${timestamp}] ❌ Error: ${error.message}`, ...prev.slice(0, 9)]);
    }
  };

  const startSimulation = () => {
    setIsRunning(true);
    sendData(); // Send immediately
    const id = setInterval(() => {
      sendData();
    }, 10000); // Every 10 seconds
    setIntervalId(id);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-7 h-7 text-teal-600" />
          <h2 className="text-2xl font-bold text-slate-800">Device Simulator</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-xl border-l-4 border-cyan-500">
          <strong className="text-slate-800">Simulate IoT device data transmission</strong> without physical hardware. Perfect for testing and development!
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700">Select Station *</label>
            <select
              required
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all bg-white disabled:opacity-50"
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              disabled={isRunning}
            >
              <option value="">-- Choose a station --</option>
              {stations.map(s => (
                <option key={s.stationId} value={s.stationId}>
                  {s.stationId} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Water Level (m)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-blue-50/50 disabled:opacity-50"
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">Battery Level (%)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-green-50/50 disabled:opacity-50"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                disabled={!selectedStation}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Simulation (Every 10s)
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Stop Simulation
              </button>
            )}
            
            <button
              onClick={sendData}
              disabled={!selectedStation || isRunning}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Send Once
            </button>
          </div>

          {/* Log */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="font-bold text-slate-800">Activity Log</h3>
            </div>
            <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-xs h-48 overflow-y-auto border-2 border-slate-700 shadow-inner">
              {log.length === 0 ? (
                <div className="text-slate-500 italic">Waiting for data transmission...</div>
              ) : (
                log.map((entry, i) => <div key={i} className="mb-1">{entry}</div>)
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
