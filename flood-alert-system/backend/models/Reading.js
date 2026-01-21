const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    ref: 'Station'
  },
  waterLevel: {
    type: Number,
    required: true
  },
  batteryLevel: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['NORMAL', 'WARNING', 'DANGER'],
    default: 'NORMAL'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
readingSchema.index({ stationId: 1, timestamp: -1 });

module.exports = mongoose.model('Reading', readingSchema);
