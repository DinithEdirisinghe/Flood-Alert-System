import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 shadow-lg">
        <div className="container mx-auto">
          <Link to="/" className="text-purple-100 hover:text-white mb-2 inline-block text-sm">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">⚙️ Admin Panel</h1>
          <p className="text-sm text-purple-100">Manage stations and simulate device data</p>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition flex items-center justify-center"
          >
            <span className="text-2xl mr-2">➕</span>
            Add New Station
          </button>
          
          <button
            onClick={() => setShowSimulator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition flex items-center justify-center"
          >
            <span className="text-2xl mr-2">🎮</span>
            Device Simulator
          </button>
          
          <button
            onClick={fetchStations}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition flex items-center justify-center"
          >
            <span className="text-2xl mr-2">🔄</span>
            Refresh Stations
          </button>
        </div>

        {/* Stations List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📍 All Stations ({stations.length})</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Station ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Warning</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Danger</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((station, index) => (
                  <tr key={station.stationId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2"
                      >
                        Edit
                      </button>
                      <Link
                        to={`/station/${station.stationId}`}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs inline-block"
                      >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">➕ Add New Station</h2>
            <form onSubmit={handleAddStation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Station ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., my-device-01"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    value={formData.stationId}
                    onChange={(e) => setFormData({...formData, stationId: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-1">Station Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., My Device - Lab"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Latitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="6.9271"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                      value={formData.lat}
                      onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      placeholder="79.9831"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                      value={formData.lng}
                      onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Warning Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="5.0"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
                      value={formData.warning}
                      onChange={(e) => setFormData({...formData, warning: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Danger Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="7.0"
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                      value={formData.danger}
                      onChange={(e) => setFormData({...formData, danger: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Create Station
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">✏️ Edit Station Thresholds</h2>
            <form onSubmit={handleEditStation}>
              <div className="space-y-4">
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-600">Station ID</p>
                  <p className="font-mono font-semibold">{formData.stationId}</p>
                </div>

                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{formData.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Warning Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500"
                      value={formData.warning}
                      onChange={(e) => setFormData({...formData, warning: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1">Danger Level (m) *</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-red-500"
                      value={formData.danger}
                      onChange={(e) => setFormData({...formData, danger: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Update Station
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingStation(null); resetForm(); }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">🎮 Device Simulator</h2>
        <p className="text-sm text-gray-600 mb-4">
          Simulate IoT device sending data without physical hardware. Perfect for testing!
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Select Station *</label>
            <select
              required
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Water Level (m)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
                disabled={isRunning}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Battery Level (%)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={batteryLevel}
                onChange={(e) => setBatteryLevel(e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={startSimulation}
                disabled={!selectedStation}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
              >
                ▶️ Start Simulation (Every 10s)
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                ⏹️ Stop Simulation
              </button>
            )}
            
            <button
              onClick={sendData}
              disabled={!selectedStation || isRunning}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
            >
              📤 Send Once
            </button>
          </div>

          {/* Log */}
          <div>
            <h3 className="font-semibold mb-2">Activity Log</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-48 overflow-y-auto">
              {log.length === 0 ? (
                <div className="text-gray-500">Waiting for data transmission...</div>
              ) : (
                log.map((entry, i) => <div key={i}>{entry}</div>)
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
