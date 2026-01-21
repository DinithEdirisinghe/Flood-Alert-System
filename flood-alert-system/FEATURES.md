# 🌊 Flood Alert System - Feature Guide

## Dashboard Features

### 1. **Statistics Overview Panel**
Located at the top of the dashboard, provides real-time system metrics:
- **Total Stations**: Number of active monitoring stations
- **Average Water Level**: Current average across all stations
- **Average Battery**: Overall system health indicator
- **High Risk Areas**: Count of stations requiring attention

### 2. **Interactive Map**
- Centered on Sri Lanka (coordinates: 7.8731°N, 80.7718°E)
- Color-coded markers:
  - 🟢 Green: Normal water levels
  - 🟠 Orange: Warning - approaching danger threshold
  - 🔴 Red: Danger - immediate action required
- Click markers for quick info popup
- "View Details" link for comprehensive station analysis

### 3. **Weather Widget**
Displays current meteorological conditions:
- Temperature
- Humidity levels
- 24-hour rainfall accumulation
- Wind speed
- Forecast alerts

### 4. **Risk Assessment Panel**
Overall system risk evaluation:
- **Risk Levels**: LOW, MODERATE, MEDIUM, HIGH
- Visual progress indicator
- Actionable recommendations based on current risk:
  - Evacuation protocols
  - Emergency team alerts
  - Monitoring frequency adjustments
  - Community notifications

### 5. **Station Status Overview**
Comprehensive station monitoring:
- Summary cards (Danger/Warning/Normal counts)
- Active alerts with trend indicators (↑ Rising, → Stable, ↓ Falling)
- Threshold comparison
- Quick view of all stations
- Color-coded status dots

### 6. **Recent Activity Log**
Real-time event tracking:
- Critical alerts (🔴)
- Warning notifications (🟠)
- System health checks (✅)
- Timestamp for each event
- Automatic sorting by recency

## Station Detail Page Features

### 1. **Enhanced Statistics Cards**
- **Current Water Level**: With distance from threshold
- **Status**: With visual alert indicator
- **Battery Level**: Device health monitoring
- **Warning Threshold**: First alert level
- **Danger Threshold**: Critical action level

### 2. **Advanced Water Level Chart**
- 24-hour historical trend visualization
- 50+ data points for accurate representation
- Threshold reference lines (Warning & Danger)
- Interactive tooltips
- Smooth line interpolation
- Time-based X-axis with readable labels

### 3. **Alert Thresholds Card**
Visual breakdown of alert levels:
- Normal range display
- Warning threshold with details
- Danger threshold with urgency indicator
- Color-coded for quick recognition

### 4. **Location Details**
- GPS coordinates (Latitude/Longitude)
- Station ID for reference
- Last update timestamp
- Quick identification info

### 5. **24-Hour Statistics**
Automatic calculations:
- Maximum water level recorded
- Minimum water level recorded
- Average level over 24 hours
- Total data points collected

## Technical Features

### Backend
- RESTful API architecture
- MongoDB database with Mongoose ODM
- Automatic status calculation based on thresholds
- Efficient data indexing for fast queries
- CORS enabled for cross-origin requests

### Frontend
- React with Vite for fast development
- Tailwind CSS for responsive design
- React-Leaflet for interactive maps
- Recharts for data visualization
- Axios for API communication
- Auto-refresh every 30 seconds
- Client-side routing with React Router

## Data Simulation

For demonstration purposes, the system includes:
- 10 monitoring stations across Sri Lanka
- Varied risk levels (Low, Medium, High)
- Realistic water level patterns with:
  - Wave simulation
  - Random noise
  - Trending patterns
  - Battery discharge simulation
- 100 readings per station over 24 hours

## Future Integration Points

### IoT Device Connection
The system is designed to accept real sensor data via:
```javascript
POST /api/readings
{
  "stationId": "your-device-id",
  "waterLevel": 5.2,
  "batteryLevel": 95
}
```

### Weather API Integration
Replace simulated weather data in `WeatherWidget.jsx` with:
- OpenWeatherMap API
- Weather.gov API
- Local meteorological service API

### Alert System
Can be extended to include:
- SMS notifications
- Email alerts
- Push notifications
- Siren system integration
- Social media broadcasts

## Customization

### Adding New Stations
1. Add station data to seed.js
2. Run `npm run seed`
3. Refresh dashboard

### Adjusting Thresholds
Modify in MongoDB or via API:
```javascript
{
  thresholds: {
    warning: 5.0,  // meters
    danger: 7.0    // meters
  }
}
```

### Changing Refresh Rate
In Dashboard.jsx and StationDetail.jsx:
```javascript
const interval = setInterval(fetchData, 30000); // milliseconds
```

## Performance Optimization

- Efficient MongoDB indexing on `stationId` and `timestamp`
- Limited data queries (last 100 readings)
- Auto-cleanup of old data (can be implemented)
- Lazy loading of station details
- Cached map tiles

## Best Practices

1. **Data Refresh**: 30-second intervals for near real-time
2. **Battery Monitoring**: Alert when below 20%
3. **Data Retention**: Keep 7-30 days of historical data
4. **Threshold Review**: Adjust based on seasonal patterns
5. **System Health**: Monitor database and API response times
