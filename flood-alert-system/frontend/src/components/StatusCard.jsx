import React from 'react';

const StatusCard = ({ stations }) => {
  const alertStations = stations.filter(
    (s) => s.currentReading?.status === 'WARNING' || s.currentReading?.status === 'DANGER'
  );

  const dangerCount = stations.filter((s) => s.currentReading?.status === 'DANGER').length;
  const warningCount = stations.filter((s) => s.currentReading?.status === 'WARNING').length;
  const normalCount = stations.filter((s) => s.currentReading?.status === 'NORMAL').length;

  const getTrendIndicator = (station) => {
    // Simulated trend - in real app, compare with previous reading
    const random = Math.random();
    if (random > 0.7) return { symbol: '↑', color: 'text-red-600', text: 'Rising' };
    if (random < 0.3) return { symbol: '↓', color: 'text-green-600', text: 'Falling' };
    return { symbol: '→', color: 'text-gray-600', text: 'Stable' };
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <span className="mr-2">📊</span>
        Station Status Overview
      </h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-100 p-3 rounded-lg text-center border-2 border-red-300">
          <div className="text-2xl font-bold text-red-600">{dangerCount}</div>
          <div className="text-xs text-red-800 font-semibold">DANGER</div>
        </div>
        <div className="bg-orange-100 p-3 rounded-lg text-center border-2 border-orange-300">
          <div className="text-2xl font-bold text-orange-600">{warningCount}</div>
          <div className="text-xs text-orange-800 font-semibold">WARNING</div>
        </div>
        <div className="bg-green-100 p-3 rounded-lg text-center border-2 border-green-300">
          <div className="text-2xl font-bold text-green-600">{normalCount}</div>
          <div className="text-xs text-green-800 font-semibold">NORMAL</div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="mb-4">
        <h3 className="text-sm font-bold mb-2 flex items-center">
          <span className="mr-1">⚠️</span>
          Active Alerts ({alertStations.length})
        </h3>
        {alertStations.length === 0 ? (
          <div className="text-center py-6 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-green-700 font-semibold text-sm">All Stations Normal</p>
            <p className="text-green-600 text-xs">No alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {alertStations.map((station) => {
              const trend = getTrendIndicator(station);
              return (
                <div
                  key={station.stationId}
                  className={`p-3 rounded-lg border-l-4 ${
                    station.currentReading.status === 'DANGER'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-orange-50 border-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-xs">{station.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Level: {station.currentReading.waterLevel}m
                        <span className={`ml-2 font-bold ${trend.color}`}>
                          {trend.symbol} {trend.text}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Threshold: {station.thresholds.warning}m / {station.thresholds.danger}m
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${
                        station.currentReading.status === 'DANGER'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-orange-200 text-orange-800'
                      }`}
                    >
                      {station.currentReading.status}
                    </span>
                  </div>
                  <a
                    href={`/station/${station.stationId}`}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-block mt-1"
                  >
                    View Details →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Stations Quick View */}
      <div>
        <h3 className="text-sm font-bold mb-2">All Stations Quick View</h3>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {stations.map((station) => (
            <div
              key={station.stationId}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <div className="flex items-center flex-1">
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    station.currentReading?.status === 'DANGER'
                      ? 'bg-red-500'
                      : station.currentReading?.status === 'WARNING'
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  }`}
                ></div>
                <span className="text-xs font-medium truncate">{station.name.split(' - ')[0]}</span>
              </div>
              <span className="text-xs text-gray-600 ml-2">
                {station.currentReading?.waterLevel || 'N/A'}m
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
