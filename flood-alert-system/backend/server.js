const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const stationRoutes = require('./routes/stationRoutes');
const readingRoutes = require('./routes/readingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-alert-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/stations', stationRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/analytics', analyticsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flood Alert System API',
    version: '1.0.0',
    endpoints: {
      stations: '/api/stations',
      readings: '/api/readings'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
