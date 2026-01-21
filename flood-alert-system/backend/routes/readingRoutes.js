const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');
const Station = require('../models/Station');

// POST /api/readings - Submit a new reading
router.post('/', async (req, res) => {
  try {
    const { stationId, waterLevel, batteryLevel } = req.body;
    
    // Find the station
    const station = await Station.findOne({ stationId });
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    // Determine status based on thresholds
    let status = 'NORMAL';
    if (waterLevel >= station.thresholds.danger) {
      status = 'DANGER';
    } else if (waterLevel >= station.thresholds.warning) {
      status = 'WARNING';
    }
    
    // Create and save the reading
    const reading = new Reading({
      stationId,
      waterLevel,
      batteryLevel,
      status
    });
    
    await reading.save();
    
    // Update station's lastUpdated timestamp
    station.lastUpdated = new Date();
    await station.save();
    
    res.status(201).json({
      success: true,
      alert: status,
      reading
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/readings/:stationId - Get readings for a specific station
router.get('/:stationId', async (req, res) => {
  try {
    const { stationId } = req.params;
    const limit = parseInt(req.query.limit) || 100; // Increased default to 100
    
    const readings = await Reading.find({ stationId })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/readings - Get all readings (optional)
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const readings = await Reading.find()
      .sort({ timestamp: -1 })
      .limit(limit);
    
    res.json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
