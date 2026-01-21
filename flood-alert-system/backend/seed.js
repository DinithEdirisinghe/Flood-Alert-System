const mongoose = require('mongoose');
const Station = require('./models/Station');
const Reading = require('./models/Reading');
require('dotenv').config();

// Sample stations across Sri Lanka (expanded for demonstration)
const sampleStations = [
  {
    stationId: 'kelani-01',
    name: 'Kelani River - Kaduwela Bridge',
    location: { lat: 6.9271, lng: 79.9831 },
    thresholds: { warning: 5.0, danger: 7.0 }
  },
  {
    stationId: 'kelani-02',
    name: 'Kelani River - Hanwella',
    location: { lat: 6.9034, lng: 80.0859 },
    thresholds: { warning: 4.8, danger: 6.8 }
  },
  {
    stationId: 'kalu-01',
    name: 'Kalu Ganga - Ratnapura',
    location: { lat: 6.6828, lng: 80.3992 },
    thresholds: { warning: 4.5, danger: 6.5 }
  },
  {
    stationId: 'kalu-02',
    name: 'Kalu Ganga - Kalutara',
    location: { lat: 6.5854, lng: 79.9607 },
    thresholds: { warning: 4.2, danger: 6.0 }
  },
  {
    stationId: 'mahaweli-01',
    name: 'Mahaweli River - Kandy',
    location: { lat: 7.2906, lng: 80.6337 },
    thresholds: { warning: 6.0, danger: 8.0 }
  },
  {
    stationId: 'mahaweli-02',
    name: 'Mahaweli River - Peradeniya',
    location: { lat: 7.2667, lng: 80.5981 },
    thresholds: { warning: 5.5, danger: 7.5 }
  },
  {
    stationId: 'nilwala-01',
    name: 'Nilwala Ganga - Matara',
    location: { lat: 5.9549, lng: 80.5550 },
    thresholds: { warning: 4.0, danger: 6.0 }
  },
  {
    stationId: 'gin-01',
    name: 'Gin Ganga - Galle',
    location: { lat: 6.0535, lng: 80.2210 },
    thresholds: { warning: 4.5, danger: 6.5 }
  },
  {
    stationId: 'attanagalu-01',
    name: 'Attanagalu Oya - Gampaha',
    location: { lat: 7.0907, lng: 80.0171 },
    thresholds: { warning: 3.5, danger: 5.5 }
  },
  {
    stationId: 'deduru-01',
    name: 'Deduru Oya - Kurunegala',
    location: { lat: 7.4863, lng: 80.3647 },
    thresholds: { warning: 4.0, danger: 6.0 }
  }
];

// Generate sample readings for each station with more realistic patterns
const generateReadings = (stationId, riskLevel = 'low') => {
  const readings = [];
  const now = new Date();
  const station = sampleStations.find(s => s.stationId === stationId);
  
  // Set base level based on risk level for demonstration
  let baseLevel, variance, trend;
  switch(riskLevel) {
    case 'high':
      baseLevel = station.thresholds.warning + 1.5; // Above warning
      variance = 0.8;
      trend = 0.05;
      break;
    case 'medium':
      baseLevel = station.thresholds.warning - 0.5; // Near warning
      variance = 0.6;
      trend = 0.02;
      break;
    default:
      baseLevel = station.thresholds.warning - 2.0; // Safe level
      variance = 0.4;
      trend = 0;
  }
  
  // Generate 100 readings over the last 24 hours (every ~14 minutes)
  for (let i = 99; i >= 0; i--) {
    const timestamp = new Date(now - i * 14.4 * 60 * 1000);
    
    // Create realistic wave pattern with noise
    const wave = Math.sin(i / 20) * variance;
    const noise = (Math.random() - 0.5) * 0.3;
    const trendEffect = trend * (99 - i) / 20;
    
    const waterLevel = parseFloat((baseLevel + wave + noise + trendEffect).toFixed(2));
    const batteryLevel = Math.floor(Math.max(75, 95 - (99 - i) * 0.2 + Math.random() * 10));
    
    let status = 'NORMAL';
    if (waterLevel >= station.thresholds.danger) {
      status = 'DANGER';
    } else if (waterLevel >= station.thresholds.warning) {
      status = 'WARNING';
    }
    
    readings.push({
      stationId,
      waterLevel,
      batteryLevel,
      status,
      timestamp
    });
  }
  
  return readings;
};

// Seed the database
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flood-alert-system', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Station.deleteMany({});
    await Reading.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Insert stations
    await Station.insertMany(sampleStations);
    console.log('📍 Inserted sample stations');
    
    // Insert readings for each station with varied risk levels
    const riskLevels = ['low', 'low', 'medium', 'low', 'high', 'low', 'medium', 'low', 'low', 'low'];
    for (let i = 0; i < sampleStations.length; i++) {
      const station = sampleStations[i];
      const readings = generateReadings(station.stationId, riskLevels[i]);
      await Reading.insertMany(readings);
      
      // Update station's lastUpdated
      await Station.updateOne(
        { stationId: station.stationId },
        { lastUpdated: new Date() }
      );
    }
    console.log('📊 Inserted sample readings with varied alert levels');
    
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
