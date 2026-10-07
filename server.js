/**
 * Renewable India Intelligence Platform - Backend API Server
 * Course: CHE110 (Environmental Studies) | Lovely Professional University (LPU)
 * Authors: Shiven Kumar, Akshay Shukla, Aayush Aryan
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const dataStore = require('./services/dataStore');
const ingestionService = require('./services/ingestionService');
const ecoAiBackendService = require('./services/ecoAiBackendService');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend assets from workspace root
app.use(express.static(__dirname));

// ==========================================
// REST API ENDPOINTS
// ==========================================

// 1. Health & Server Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Renewable India Intelligence Platform',
    course: 'CHE110 Environmental Studies (LPU)',
    version: '2.0.0',
    uptimeSeconds: Math.round(process.uptime()),
    validationStatus: dataStore.validationAudit?.valid ? 'verified' : 'unverified',
    lastSynchronizedIST: dataStore.formatISTDate(dataStore.lastSynchronized)
  });
});

// 2. National Live Intelligence
app.get('/api/energy-data', (req, res) => {
  try {
    const data = dataStore.getNationalIntelligence();
    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve national renewable intelligence data.'
    });
  }
});

// 3. State-wise Installed Capacity
app.get('/api/states', (req, res) => {
  try {
    const states = dataStore.getStateBreakdowns();
    res.json({
      success: true,
      totalStatesReported: states.length,
      data: states
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve state-wise data.' });
  }
});

// 4. Individual State Profile
app.get('/api/state/:nameOrCode', (req, res) => {
  const query = req.params.nameOrCode.toLowerCase();
  const states = dataStore.getStateBreakdowns();
  const match = states.find(s => 
    s.state.toLowerCase() === query || 
    (s.id && s.id.toLowerCase().includes(query))
  );

  if (match) {
    res.json({
      success: true,
      available: true,
      data: match
    });
  } else {
    res.json({
      success: true,
      available: false,
      message: 'State-level official data unavailable for this period.',
      stateQuery: req.params.nameOrCode
    });
  }
});

// 5. Recent Renewable Generation (CEA)
app.get('/api/generation', (req, res) => {
  try {
    res.json({
      success: true,
      data: dataStore.generationData
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load generation metrics.' });
  }
});

// 6. Historical Trends & 2030 Projections
app.get('/api/trends', (req, res) => {
  try {
    res.json({
      success: true,
      data: dataStore.getHistoricalTrends()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load trend data.' });
  }
});

// 7. 2030 Target Tracker
app.get('/api/target-tracker', (req, res) => {
  try {
    const national = dataStore.getNationalIntelligence();
    res.json({
      success: true,
      data: national.metrics.target2030
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load 2030 target tracker.' });
  }
});

// 8. "WHAT CHANGED?" Delta Engine
app.get('/api/changes', (req, res) => {
  try {
    const changes = dataStore.getChangesDetector();
    res.json({
      success: true,
      data: changes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to compute change diffs.' });
  }
});

// 9. Verified Renewable Energy News
app.get('/api/news', (req, res) => {
  try {
    res.json({
      success: true,
      data: dataStore.newsData
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load news records.' });
  }
});

// 10. Audit Register of All Observations (Data Sources & Transparency)
app.get('/api/sources', (req, res) => {
  try {
    const observations = dataStore.getAllObservations();
    res.json({
      success: true,
      totalObservations: observations.length,
      data: observations
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load source registers.' });
  }
});

// 11. Data Quality & Trust Checklist
app.get('/api/quality', (req, res) => {
  try {
    const quality = dataStore.getDataQualityReport();
    res.json({
      success: true,
      data: quality
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to load quality audit.' });
  }
});

// 12. Trigger Official Data Refresh
app.post('/api/refresh', async (req, res) => {
  try {
    const syncReport = await ingestionService.syncOfficialData();
    res.json({
      success: syncReport.success,
      report: syncReport,
      data: dataStore.getNationalIntelligence()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Data refresh synchronization encountered an error: ' + err.message
    });
  }
});

// 13. EcoAI Data-Grounded Query
app.post('/api/ask-ecoai', async (req, res) => {
  try {
    const { query, mode, userGeminiKey } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter is required.' });
    }

    const reply = await ecoAiBackendService.processQuery({ query, mode, userGeminiKey });
    res.json({
      success: true,
      data: reply
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'EcoAI processing error: ' + err.message
    });
  }
});

// Start listening
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`⚡ Renewable India Intelligence Platform Server Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🏛️ CHE110 CA1 - Lovely Professional University (LPU)`);
  console.log(`================================================================`);
});
