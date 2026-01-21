import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on status
const createCustomIcon = (status) => {
  const colors = {
    NORMAL: '#22c55e',
    WARNING: '#f59e0b',
    DANGER: '#ef4444'
  };
  
  const color = colors[status] || colors.NORMAL;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const MapView = ({ stations }) => {
  const center = [7.8731, 80.7718]; // Sri Lanka center
  
  const getTimeSinceUpdate = (lastUpdated) => {
    if (!lastUpdated) return 'Never';
    const minutes = Math.floor((new Date() - new Date(lastUpdated)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  };

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="h-full w-full"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {stations.map((station) => {
        const status = station.currentReading?.status || 'NORMAL';
        const waterLevel = station.currentReading?.waterLevel || 'N/A';
        
        return (
          <Marker
            key={station.stationId}
            position={[station.location.lat, station.location.lng]}
            icon={createCustomIcon(status)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{station.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">Water Level:</span> {waterLevel}m
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{' '}
                    <span className={`
                      font-bold
                      ${status === 'NORMAL' ? 'text-green-600' : ''}
                      ${status === 'WARNING' ? 'text-orange-600' : ''}
                      ${status === 'DANGER' ? 'text-red-600' : ''}
                    `}>
                      {status}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Updated: {getTimeSinceUpdate(station.lastUpdated)}
                  </p>
                </div>
                <a
                  href={`/station/${station.stationId}`}
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
