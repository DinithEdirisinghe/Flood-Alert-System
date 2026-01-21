import React from 'react';

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
    <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Weather Conditions</h3>
        <span className="text-3xl">⛅</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-white/20 p-2 rounded">
          <div className="opacity-90">Temperature</div>
          <div className="text-lg font-bold">{weatherData.temperature}°C</div>
        </div>
        <div className="bg-white/20 p-2 rounded">
          <div className="opacity-90">Humidity</div>
          <div className="text-lg font-bold">{weatherData.humidity}%</div>
        </div>
        <div className="bg-white/20 p-2 rounded">
          <div className="opacity-90">Rainfall (24h)</div>
          <div className="text-lg font-bold">{weatherData.rainfall}mm</div>
        </div>
        <div className="bg-white/20 p-2 rounded">
          <div className="opacity-90">Wind Speed</div>
          <div className="text-lg font-bold">{weatherData.windSpeed}km/h</div>
        </div>
      </div>
      
      <div className="mt-3 p-2 bg-white/20 rounded text-xs">
        <span className="font-semibold">⚠️ Forecast:</span> {weatherData.forecast}
      </div>
    </div>
  );
};

export default WeatherWidget;
