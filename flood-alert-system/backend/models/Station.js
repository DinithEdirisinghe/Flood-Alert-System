const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  stationId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  thresholds: {
    warning: {
      type: Number,
      required: true,
      default: 5.0
    },
    danger: {
      type: Number,
      required: true,
      default: 7.0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Station', stationSchema);
