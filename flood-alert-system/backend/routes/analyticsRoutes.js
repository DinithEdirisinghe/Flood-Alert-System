const express = require('express');
const router = express.Router();
const Reading = require('../models/Reading');
const Station = require('../models/Station');

// GET /api/analytics/predictions - Get predictions for all stations
router.get('/predictions', async (req, res) => {
  try {
    const stations = await Station.find();
    const predictions = [];

    for (const station of stations) {
      // Get last 20 readings for trend analysis
      const readings = await Reading.find({ stationId: station.stationId })
        .sort({ timestamp: -1 })
        .limit(20);

      if (readings.length < 5) continue;

      // Calculate trend and prediction
      const prediction = calculatePrediction(readings, station);
      predictions.push({
        stationId: station.stationId,
        name: station.name,
        currentLevel: readings[0].waterLevel,
        ...prediction
      });
    }

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/trends - Get system-wide trends
router.get('/trends', async (req, res) => {
  try {
    const stations = await Station.find();
    const trends = {
      rising: [],
      falling: [],
      stable: [],
      systemTrend: 'stable',
      avgChangeRate: 0
    };

    let totalChangeRate = 0;
    let stationCount = 0;

    for (const station of stations) {
      const readings = await Reading.find({ stationId: station.stationId })
        .sort({ timestamp: -1 })
        .limit(10);

      if (readings.length < 5) continue;

      const changeRate = calculateChangeRate(readings);
      totalChangeRate += changeRate;
      stationCount++;

      const trendData = {
        stationId: station.stationId,
        name: station.name,
        changeRate: changeRate,
        currentLevel: readings[0].waterLevel
      };

      if (changeRate > 0.1) {
        trends.rising.push(trendData);
      } else if (changeRate < -0.1) {
        trends.falling.push(trendData);
      } else {
        trends.stable.push(trendData);
      }
    }

    trends.avgChangeRate = stationCount > 0 ? totalChangeRate / stationCount : 0;
    
    if (trends.avgChangeRate > 0.15) {
      trends.systemTrend = 'rising';
    } else if (trends.avgChangeRate < -0.15) {
      trends.systemTrend = 'falling';
    }

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/correlations - Get station correlations
router.get('/correlations', async (req, res) => {
  try {
    const stations = await Station.find();
    const correlations = [];

    // Get recent readings for all stations
    const stationData = {};
    for (const station of stations) {
      const readings = await Reading.find({ stationId: station.stationId })
        .sort({ timestamp: -1 })
        .limit(20);
      stationData[station.stationId] = {
        name: station.name,
        levels: readings.map(r => r.waterLevel)
      };
    }

    // Calculate simple correlations
    const stationIds = Object.keys(stationData);
    for (let i = 0; i < stationIds.length; i++) {
      for (let j = i + 1; j < stationIds.length; j++) {
        const id1 = stationIds[i];
        const id2 = stationIds[j];
        
        const correlation = calculateCorrelation(
          stationData[id1].levels,
          stationData[id2].levels
        );

        if (Math.abs(correlation) > 0.3) {
          correlations.push({
            station1: { id: id1, name: stationData[id1].name },
            station2: { id: id2, name: stationData[id2].name },
            correlation: correlation,
            strength: Math.abs(correlation) > 0.7 ? 'Strong' : 'Moderate'
          });
        }
      }
    }

    res.json(correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/risk-forecast - Forecast which stations will alert
router.get('/risk-forecast', async (req, res) => {
  try {
    const stations = await Station.find();
    const forecast = {
      highRisk: [],
      mediumRisk: [],
      lowRisk: [],
      timeToAlert: {}
    };

    for (const station of stations) {
      const readings = await Reading.find({ stationId: station.stationId })
        .sort({ timestamp: -1 })
        .limit(20);

      if (readings.length < 5) continue;

      const currentLevel = readings[0].waterLevel;
      const changeRate = calculateChangeRate(readings);
      const prediction = calculatePrediction(readings, station);

      const riskAssessment = {
        stationId: station.stationId,
        name: station.name,
        currentLevel,
        predictedLevel: prediction.predictions[5]?.level || currentLevel,
        changeRate,
        timeToWarning: null,
        timeToDanger: null
      };

      // Calculate time to reach thresholds
      if (changeRate > 0.05) {
        const warningDistance = station.thresholds.warning - currentLevel;
        const dangerDistance = station.thresholds.danger - currentLevel;

        if (warningDistance > 0) {
          riskAssessment.timeToWarning = (warningDistance / changeRate).toFixed(1);
        }
        if (dangerDistance > 0) {
          riskAssessment.timeToDanger = (dangerDistance / changeRate).toFixed(1);
        }
      }

      // Categorize risk
      if (riskAssessment.timeToWarning && riskAssessment.timeToWarning < 3) {
        forecast.highRisk.push(riskAssessment);
      } else if (riskAssessment.timeToWarning && riskAssessment.timeToWarning < 6) {
        forecast.mediumRisk.push(riskAssessment);
      } else {
        forecast.lowRisk.push(riskAssessment);
      }
    }

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/statistics - Get system-wide statistics
router.get('/statistics', async (req, res) => {
  try {
    const stations = await Station.find();
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const stats = {
      totalStations: stations.length,
      totalReadings: 0,
      avgWaterLevel: 0,
      maxWaterLevel: { level: 0, station: null },
      minWaterLevel: { level: Infinity, station: null },
      alertHistory: {
        danger: 0,
        warning: 0,
        normal: 0
      },
      dataQuality: {
        activeStations: 0,
        inactiveStations: 0,
        avgBattery: 0
      }
    };

    let totalLevel = 0;
    let totalBattery = 0;
    let stationCount = 0;

    for (const station of stations) {
      const readings = await Reading.find({ 
        stationId: station.stationId,
        timestamp: { $gte: last24Hours }
      });

      stats.totalReadings += readings.length;

      if (readings.length > 0) {
        stats.dataQuality.activeStations++;
        
        const latest = readings[readings.length - 1];
        totalLevel += latest.waterLevel;
        totalBattery += latest.batteryLevel;
        stationCount++;

        if (latest.waterLevel > stats.maxWaterLevel.level) {
          stats.maxWaterLevel = { level: latest.waterLevel, station: station.name };
        }
        if (latest.waterLevel < stats.minWaterLevel.level) {
          stats.minWaterLevel = { level: latest.waterLevel, station: station.name };
        }

        // Count alert history
        readings.forEach(r => {
          stats.alertHistory[r.status.toLowerCase()]++;
        });
      } else {
        stats.dataQuality.inactiveStations++;
      }
    }

    stats.avgWaterLevel = stationCount > 0 ? (totalLevel / stationCount).toFixed(2) : 0;
    stats.dataQuality.avgBattery = stationCount > 0 ? Math.round(totalBattery / stationCount) : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function: Calculate prediction
function calculatePrediction(readings, station) {
  const current = readings[0].waterLevel;
  const changeRate = calculateChangeRate(readings);
  
  // Generate predictions for next 6 hours (every hour)
  const predictions = [];
  for (let i = 1; i <= 6; i++) {
    const predictedLevel = current + (changeRate * i);
    
    let status = 'NORMAL';
    let confidence = 90 - (i * 10); // Confidence decreases over time
    
    if (predictedLevel >= station.thresholds.danger) {
      status = 'DANGER';
    } else if (predictedLevel >= station.thresholds.warning) {
      status = 'WARNING';
    }
    
    predictions.push({
      hoursAhead: i,
      level: parseFloat(predictedLevel.toFixed(2)),
      status,
      confidence: Math.max(confidence, 40)
    });
  }

  return {
    trend: changeRate > 0.1 ? 'rising' : changeRate < -0.1 ? 'falling' : 'stable',
    changeRate: parseFloat(changeRate.toFixed(3)),
    predictions
  };
}

// Helper function: Calculate change rate (meters per hour)
function calculateChangeRate(readings) {
  if (readings.length < 2) return 0;

  let totalChange = 0;
  let totalTimeHours = 0;

  for (let i = 0; i < readings.length - 1; i++) {
    const levelChange = readings[i].waterLevel - readings[i + 1].waterLevel;
    const timeChange = (new Date(readings[i].timestamp) - new Date(readings[i + 1].timestamp)) / (1000 * 60 * 60);
    
    if (timeChange > 0) {
      totalChange += levelChange;
      totalTimeHours += timeChange;
    }
  }

  return totalTimeHours > 0 ? totalChange / totalTimeHours : 0;
}

// Helper function: Calculate correlation coefficient
function calculateCorrelation(arr1, arr2) {
  const n = Math.min(arr1.length, arr2.length);
  if (n < 3) return 0;

  const mean1 = arr1.slice(0, n).reduce((a, b) => a + b, 0) / n;
  const mean2 = arr2.slice(0, n).reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 0; i < n; i++) {
    const diff1 = arr1[i] - mean1;
    const diff2 = arr2[i] - mean2;
    numerator += diff1 * diff2;
    sum1 += diff1 * diff1;
    sum2 += diff2 * diff2;
  }

  const denominator = Math.sqrt(sum1 * sum2);
  return denominator === 0 ? 0 : parseFloat((numerator / denominator).toFixed(3));
}

module.exports = router;
