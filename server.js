const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE';

// Geocode using Mapbox
async function getLatLng(address) {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return {
        lat: data.features[0].center[1],
        lng: data.features[0].center[0]
      };
    }
  } catch (err) {
    console.error('Geocoding error:', err.message);
  }
  return { lat: '', lng: '' };
}

app.post('/', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing ?url= parameter' });
  }

  const body = req.body;

  // Build address string for geocoding
  const addressParts = [body.address, body.city, body.country].filter(Boolean).join(', ');
  const coords = await getLatLng(addressParts);

  const bodyWithLocation = {
    ...body,
    latitude: coords.lat,
    longitude: coords.lng
  };

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyWithLocation)
    });

    const resultText = await response.text(); // Apps Script might return HTML
    res.send(resultText);
  } catch (err) {
    console.error('Forwarding error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
