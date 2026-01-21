import React from 'react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
        <div className="text-xs opacity-90 mb-1">Total Stations</div>
        <div className="text-2xl font-bold">{totalStations}</div>
        <div className="text-xs mt-1 opacity-75">{activeStations} active</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
        <div className="text-xs opacity-90 mb-1">Avg Water Level</div>
        <div className="text-2xl font-bold">{avgWaterLevel.toFixed(2)}m</div>
        <div className="text-xs mt-1 opacity-75">Across all stations</div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
        <div className="text-xs opacity-90 mb-1">Avg Battery</div>
        <div className="text-2xl font-bold">{avgBattery.toFixed(0)}%</div>
        <div className="text-xs mt-1 opacity-75">System health</div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
        <div className="text-xs opacity-90 mb-1">High Risk Areas</div>
        <div className="text-2xl font-bold">{highRiskAreas}</div>
        <div className="text-xs mt-1 opacity-75">Requires attention</div>
      </div>
    </div>
  );
};

export default StatsOverview;
