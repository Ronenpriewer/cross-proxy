const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('Missing url query param');
  }

  try {
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type');

    res.set('Content-Type', contentType);
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Failed to fetch target URL');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
