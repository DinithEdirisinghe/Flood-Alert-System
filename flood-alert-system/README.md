# Flood Alert System - Sri Lanka 🌊

A real-time flood monitoring dashboard built with the MERN stack for tracking water levels across Sri Lanka's major rivers.

## 🚀 Features

- **Real-time Monitoring**: Live water level data from 10 IoT stations across Sri Lanka
- **Interactive Map**: Visual representation with color-coded markers on Sri Lanka map
- **Advanced Alert System**: Three-tier alerts (Normal, Warning, Danger) based on thresholds
- **Historical Data Visualization**: 24-hour water level trends with Recharts
- **Weather Integration**: Current weather conditions and forecasts
- **Risk Assessment Dashboard**: Overall risk level with actionable recommendations
- **Recent Activity Log**: Real-time event tracking and system notifications
- **Statistics Overview**: System-wide metrics and analytics
- **Detailed Station Views**: In-depth analysis for each monitoring station
- **Trend Indicators**: Rising, falling, or stable water level trends
- **Battery Monitoring**: Track IoT device battery levels
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React-Leaflet (Maps)
- Recharts (Data Visualization)
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)

## 📁 Project Structure

```
flood-alert-system/
├── backend/
│   ├── models/
│   │   ├── Station.js
│   │   └── Reading.js
│   ├── routes/
│   │   ├── stationRoutes.js
│   │   └── readingRoutes.js
│   ├── server.js
│   ├── seed.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx
│   │   │   ├── StatusCard.jsx
│   │   │   └── HistoryChart.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── StationDetail.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works fine)
- npm or yarn

### Quick Setup (PowerShell)

1. **Navigate to project directory**
   ```powershell
   cd "d:\Embedded Project\flood-alert-system"
   ```

2. **Run the setup script**
   ```powershell
   .\setup.ps1
   ```
   This will:
   - Install backend dependencies
   - Seed the database with 10 stations and realistic data
   - Start the backend server on port 5000

3. **In a NEW terminal, start the frontend**
   ```powershell
   cd "d:\Embedded Project\flood-alert-system"
   .\start-frontend.ps1
   ```
   Frontend will run on http://localhost:5173

### Manual Installation

1. **Clone the repository**
   ```bash
   cd "d:\Embedded Project\flood-alert-system"
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   
   Update `backend/.env` if needed:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flood-alert-system
   ```

4. **Seed the Database**
   ```bash
   npm run seed
   ```

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

6. **Set up the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   ```

7. **Start the Frontend**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📊 API Endpoints

### Stations

- `GET /api/stations` - Get all stations with latest status
- `GET /api/stations/:id` - Get specific station details
- `POST /api/stations` - Create a new station

### Readings

- `GET /api/readings/:stationId` - Get readings for a station (last 50)
- `POST /api/readings` - Submit a new reading

**Example POST request to submit reading:**
```json
{
  "stationId": "kelani-01",
  "waterLevel": 5.2,
  "batteryLevel": 95
}
```

## 🗺️ Sample Stations

The system includes 10 pre-configured monitoring stations across Sri Lanka:

1. **Kelani River** - Kaduwela Bridge
2. **Kelani River** - Hanwella
3. **Kalu Ganga** - Ratnapura
4. **Kalu Ganga** - Kalutara
5. **Mahaweli River** - Kandy
6. **Mahaweli River** - Peradeniya
7. **Nilwala Ganga** - Matara
8. **Gin Ganga** - Galle
9. **Attanagalu Oya** - Gampaha
10. **Deduru Oya** - Kurunegala

*Note: These are demonstration stations with simulated data. In production, one physical IoT device will be deployed and connected to the system.*

## 🎨 Alert Levels

- **🟢 Normal**: Water level below warning threshold
- **🟠 Warning**: Water level between warning and danger thresholds
- **🔴 Danger**: Water level above danger threshold

## 🔧 Configuration

### Adding New Stations

You can add new monitoring stations via the API or directly in MongoDB:

```javascript
{
  stationId: "station-id",
  name: "Station Name",
  location: {
    lat: 7.8731,
    lng: 80.7718
  },
  thresholds: {
    warning: 5.0,
    danger: 7.0
  }
}
```

## 📱 Usage

1. **Dashboard View**: See all stations on the map with color-coded status
2. **Click on Markers**: View quick station information
3. **View Details**: Click "View Details" to see historical data and charts
4. **Active Alerts**: Check the sidebar for stations with warnings or dangers
5. **Admin Panel**: Click "⚙️ Admin Panel" button to:
   - ➕ **Add new stations** for your IoT devices
   - ✏️ **Edit station thresholds**
   - 🎮 **Test with device simulator** (no hardware needed!)
   - 📊 **Manage all stations** in one place

## 🚀 Deployment

### Backend Deployment
- Deploy to services like Heroku, Railway, or DigitalOcean
- Use MongoDB Atlas for cloud database

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ for flood monitoring in Sri Lanka

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- React-Leaflet for map integration
- Recharts for data visualization
