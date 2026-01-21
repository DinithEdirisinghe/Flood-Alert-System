import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const HistoryChart = ({ readings, thresholds }) => {
  // Format data for Recharts - show last 50 data points for better visualization
  const chartData = readings
    .slice(0, 50)
    .reverse()
    .map((reading, index) => ({
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      waterLevel: reading.waterLevel,
      timestamp: reading.timestamp,
      index: index
    }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Water Level History (Last 24 Hours)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11 }}
            interval={Math.floor(chartData.length / 10)}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            label={{ value: 'Water Level (m)', angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            labelFormatter={(label) => `Time: ${label}`}
            formatter={(value) => [`${value}m`, 'Water Level']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          
          {/* Threshold lines */}
          {thresholds && (
            <>
              <ReferenceLine
                y={thresholds.danger}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ 
                  value: `Danger (${thresholds.danger}m)`, 
                  fill: '#ef4444', 
                  fontSize: 12,
                  position: 'right'
                }}
              />
              <ReferenceLine
                y={thresholds.warning}
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ 
                  value: `Warning (${thresholds.warning}m)`, 
                  fill: '#f59e0b', 
                  fontSize: 12,
                  position: 'right'
                }}
              />
            </>
          )}
          
          <Line
            type="monotone"
            dataKey="waterLevel"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 3, fill: '#3b82f6' }}
            activeDot={{ r: 6, fill: '#2563eb' }}
            name="Water Level"
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-600 mr-2"></div>
          <span>Current Level</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-orange-500 border-dashed border mr-2"></div>
          <span>Warning Threshold</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-red-500 border-dashed border mr-2"></div>
          <span>Danger Threshold</span>
        </div>
      </div>
    </div>
  );
};

export default HistoryChart;
