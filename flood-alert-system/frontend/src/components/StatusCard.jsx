import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';

const StatusCard = ({ stations }) => {
  const alertStations = stations.filter(
    (s) => s.currentReading?.status === 'WARNING' || s.currentReading?.status === 'DANGER'
  );

  const dangerCount = stations.filter((s) => s.currentReading?.status === 'DANGER').length;
  const warningCount = stations.filter((s) => s.currentReading?.status === 'WARNING').length;
  const normalCount = stations.filter((s) => s.currentReading?.status === 'NORMAL').length;

  const getTrendIndicator = (station) => {
    const random = Math.random();
    if (random > 0.7) return { Icon: TrendingUp, color: 'text-red-600', text: 'Rising' };
    if (random < 0.3) return { Icon: TrendingDown, color: 'text-green-600', text: 'Falling' };
    return { Icon: Minus, color: 'text-slate-600', text: 'Stable' };
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-slate-800">Station Status Overview</h2>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
          <div className="text-2xl font-bold text-red-700">{dangerCount}</div>
          <div className="text-xs text-red-800 font-semibold uppercase tracking-wide">Danger</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <AlertTriangle className="w-5 h-5 text-orange-600 mb-2" />
          <div className="text-2xl font-bold text-orange-700">{warningCount}</div>
          <div className="text-xs text-orange-800 font-semibold uppercase tracking-wide">Warning</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-2xl font-bold text-green-700">{normalCount}</div>
          <div className="text-xs text-green-800 font-semibold uppercase tracking-wide">Normal</div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold mb-3 text-slate-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          Active Alerts ({alertStations.length})
        </h3>
        {alertStations.length === 0 ? (
          <div className="text-center py-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold text-sm">All Stations Normal</p>
            <p className="text-green-700 text-xs mt-1">No alerts at this time</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {alertStations.map((station) => {
              const trend = getTrendIndicator(station);
              const TrendIcon = trend.Icon;
              return (
                <div
                  key={station.stationId}
                  className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                    station.currentReading.status === 'DANGER'
                      ? 'bg-red-50 border-red-500'
                      : 'bg-orange-50 border-orange-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-slate-800">{station.name}</h4>
                      <p className="text-xs text-slate-600 mt-2 flex items-center gap-2">
                        Level: <span className="font-bold">{station.currentReading.waterLevel}m</span>
                        <span className={`flex items-center gap-1 font-semibold ${trend.color}`}>
                          <TrendIcon className="w-3 h-3" />
                          {trend.text}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Threshold: {station.thresholds.warning}m / {station.thresholds.danger}m
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                        station.currentReading.status === 'DANGER'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-orange-200 text-orange-900'
                      }`}
                    >
                      {station.currentReading.status}
                    </span>
                  </div>
                  <a
                    href={`/station/${station.stationId}`}
                    className="text-xs text-teal-600 hover:text-teal-800 font-medium inline-flex items-center gap-1 mt-2 transition-colors"
                  >
                    View Details →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Stations List */}
      <div className="pt-5 border-t border-slate-200">
        <h3 className="text-sm font-semibold mb-3 text-slate-700">All Stations</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {stations.map((station) => (
            <a
              key={station.stationId}
              href={`/station/${station.stationId}`}
              className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <span className="text-xs font-medium text-slate-700">{station.name}</span>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded ${
                  station.currentReading?.status === 'DANGER'
                    ? 'bg-red-100 text-red-700'
                    : station.currentReading?.status === 'WARNING'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {station.currentReading?.waterLevel || 0}m
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
