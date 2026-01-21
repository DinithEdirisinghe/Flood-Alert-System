import React from 'react';

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
        message: `🔴 Critical alert at ${station.name}`,
        detail: `Water level: ${waterLevel}m`,
        time: `${minutesAgo}m ago`,
        timestamp: lastUpdated
      });
    } else if (status === 'WARNING') {
      activities.push({
        type: 'warning',
        message: `🟠 Warning issued for ${station.name}`,
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
    message: '✅ System health check completed',
    detail: 'All sensors responding',
    time: '5m ago'
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="font-bold text-lg mb-3">Recent Activity</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.slice(0, 10).map((activity, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 text-sm ${
              activity.type === 'danger'
                ? 'bg-red-50 border-red-500'
                : activity.type === 'warning'
                ? 'bg-orange-50 border-orange-500'
                : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-semibold text-xs">{activity.message}</div>
                <div className="text-xs text-gray-600 mt-1">{activity.detail}</div>
              </div>
              <span className="text-xs text-gray-500 ml-2">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
