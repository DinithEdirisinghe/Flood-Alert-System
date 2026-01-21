import React from 'react';
import { Cloud, Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

const WeatherWidget = () => {
  // Simulated weather data (you can integrate real API later)
  const weatherData = {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 78,
    rainfall: 12,
    windSpeed: 15,
    forecast: 'Moderate rain expected in next 6 hours'
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg border border-cyan-600">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Weather Conditions</h3>
          <Cloud className="w-7 h-7 opacity-90" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
            <Thermometer className="w-4 h-4 opacity-80" />
            <div>
              <div className="opacity-90 text-xs">Temperature</div>
              <div className="text-lg font-bold">{weatherData.temperature}°C</div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
            <Droplets className="w-4 h-4 opacity-80" />
            <div>
              <div className="opacity-90 text-xs">Humidity</div>
              <div className="text-lg font-bold">{weatherData.humidity}%</div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
            <CloudRain className="w-4 h-4 opacity-80" />
            <div>
              <div className="opacity-90 text-xs">Rainfall (24h)</div>
              <div className="text-lg font-bold">{weatherData.rainfall}mm</div>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg flex items-center gap-2">
            <Wind className="w-4 h-4 opacity-80" />
            <div>
              <div className="opacity-90 text-xs">Wind Speed</div>
              <div className="text-lg font-bold">{weatherData.windSpeed}km/h</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
          <div className="text-xs font-semibold mb-1">Forecast</div>
          <div className="text-xs opacity-90">{weatherData.forecast}</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
