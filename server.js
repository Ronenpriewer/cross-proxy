// server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Use v2 — install with: npm install node-fetch@2
require('dotenv').config();

const app = express();

// ✅ Enable CORS with preflight support
app.use(cors());
app.use(express.json());

// ✅ Custom CORS middleware to handle OPTIONS preflight
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ✅ Your Google Apps Script endpoint
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// ✅ Blessing POST endpoint
app.post('/submit-blessing', async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error forwarding to Google Apps Script:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
