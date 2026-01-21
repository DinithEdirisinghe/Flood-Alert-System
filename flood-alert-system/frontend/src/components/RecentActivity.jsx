import React from 'react';
import { Clock, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const RecentActivity = ({ stations }) => {
  // Generate activity log based on station statuses
  const activities = [];
  
  stations.forEach(station => {
    const status = station.currentReading?.status;
    const waterLevel = station.currentReading?.waterLevel;
    const lastUpdated = new Date(station.lastUpdated);
    const minutesAgo = Math.floor((new Date() - lastUpdated) / 60000);
    
    if (status === 'DANGER') {
      activities.push({
        type: 'danger',
        Icon: AlertCircle,
        message: `Critical alert at ${station.name}`,
        detail: `Water level: ${waterLevel}m`,
        time: `${minutesAgo}m ago`,
        timestamp: lastUpdated
      });
    } else if (status === 'WARNING') {
      activities.push({
        type: 'warning',
        Icon: AlertTriangle,
        message: `Warning issued for ${station.name}`,
        detail: `Water level: ${waterLevel}m`,
        time: `${minutesAgo}m ago`,
        timestamp: lastUpdated
      });
    }
  });

  // Sort by timestamp
  activities.sort((a, b) => b.timestamp - a.timestamp);

  // Add some system activities
  activities.push({
    type: 'info',
    Icon: Info,
    message: 'System health check completed',
    detail: 'All sensors responding',
    time: '5m ago'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-teal-600" />
        <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
      </div>
      <div className="space-y-2.5 max-h-64 overflow-y-auto">
        {activities.slice(0, 10).map((activity, index) => {
          const ActivityIcon = activity.Icon;
          return (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 text-sm transition-all hover:shadow-md ${
                activity.type === 'danger'
                  ? 'bg-red-50 border-red-500'
                  : activity.type === 'warning'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-2 flex-1">
                  <ActivityIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    activity.type === 'danger' ? 'text-red-600' :
                    activity.type === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <div className="font-semibold text-xs text-slate-800">{activity.message}</div>
                    <div className="text-xs text-slate-600 mt-1">{activity.detail}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
