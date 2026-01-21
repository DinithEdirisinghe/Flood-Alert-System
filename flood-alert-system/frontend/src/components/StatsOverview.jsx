import React from 'react';
import { Activity, Droplets, Battery, AlertTriangle } from 'lucide-react';

const StatsOverview = ({ stations }) => {
  const totalStations = stations.length;
  const activeStations = stations.filter(s => {
    const lastUpdate = new Date(s.lastUpdated);
    const now = new Date();
    return (now - lastUpdate) < 3600000; // Active within last hour
  }).length;

  const avgWaterLevel = stations.reduce((sum, s) => 
    sum + (s.currentReading?.waterLevel || 0), 0) / (totalStations || 1);

  const avgBattery = stations.reduce((sum, s) => 
    sum + (s.currentReading?.batteryLevel || 0), 0) / (totalStations || 1);

  const highRiskAreas = stations.filter(s => 
    s.currentReading?.status === 'DANGER' || s.currentReading?.status === 'WARNING'
  ).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white p-5 rounded-xl shadow-lg border border-teal-600">
        <Activity className="w-6 h-6 mb-2 opacity-90" />
        <div className="text-xs opacity-90 font-medium mb-1">Total Stations</div>
        <div className="text-3xl font-bold">{totalStations}</div>
        <div className="text-xs mt-1 opacity-80">{activeStations} active</div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-xl shadow-lg border border-blue-600">
        <Droplets className="w-6 h-6 mb-2 opacity-90" />
        <div className="text-xs opacity-90 font-medium mb-1">Avg Water Level</div>
        <div className="text-3xl font-bold">{avgWaterLevel.toFixed(2)}m</div>
        <div className="text-xs mt-1 opacity-80">Across all stations</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-xl shadow-lg border border-green-600">
        <Battery className="w-6 h-6 mb-2 opacity-90" />
        <div className="text-xs opacity-90 font-medium mb-1">Avg Battery</div>
        <div className="text-3xl font-bold">{avgBattery.toFixed(0)}%</div>
        <div className="text-xs mt-1 opacity-80">System health</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-5 rounded-xl shadow-lg border border-orange-600">
        <AlertTriangle className="w-6 h-6 mb-2 opacity-90" />
        <div className="text-xs opacity-90 font-medium mb-1">High Risk Areas</div>
        <div className="text-3xl font-bold">{highRiskAreas}</div>
        <div className="text-xs mt-1 opacity-80">Requires attention</div>
      </div>
    </div>
  );
};

export default StatsOverview;
