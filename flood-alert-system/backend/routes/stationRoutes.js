const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const Reading = require('../models/Reading');

// GET /api/stations - Get all stations with their latest status
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    
    // Get latest reading for each station
    const stationsWithStatus = await Promise.all(
      stations.map(async (station) => {
        const latestReading = await Reading.findOne({ stationId: station.stationId })
          .sort({ timestamp: -1 })
          .limit(1);
        
        return {
          ...station.toObject(),
          currentReading: latestReading || null
        };
      })
    );
    
    res.json(stationsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stations/:id - Get a specific station
router.get('/:id', async (req, res) => {
  try {
    const station = await Station.findOne({ stationId: req.params.id });
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/stations - Create a new station
router.post('/', async (req, res) => {
  try {
    const station = new Station(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/stations/:id - Update station thresholds
router.put('/:id', async (req, res) => {
  try {
    const station = await Station.findOneAndUpdate(
      { stationId: req.params.id },
      { thresholds: req.body.thresholds },
      { new: true }
    );
    
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json(station);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/stations/:id - Delete a station
router.delete('/:id', async (req, res) => {
  try {
    const station = await Station.findOneAndDelete({ stationId: req.params.id });
    
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    res.json({ success: true, message: 'Station deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
