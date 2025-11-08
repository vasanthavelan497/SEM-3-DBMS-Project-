const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const app = express();
const PORT = 5001; // <--- PORT CHANGED TO 5001

// Middleware Setup
app.use(cors()); 
app.use(express.json()); 

// Root Check
app.get('/', (req, res) => {
  res.send('MTC Bus Route Management API is running! Access endpoints like /api/buses');
});

// 1. Endpoint to Fetch All Buses with Model Details and Availability
app.get('/api/buses', async (req, res) => {
  try {
    const queryText = `
      SELECT
        b.bid, b.bno, b.startpt, b.endpt, b.count,
        m.btype, m.age, m.mid AS model_mid, 
        a.available
      FROM bus b
      JOIN model m ON b.bid = m.bid 
      LEFT JOIN availability a ON b.bid = a.bid
      ORDER BY b.bid;
    `; 
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    // This logs runtime errors when fetching data after the server has started
    console.error('Error fetching bus details during API call:', err.message);
    res.status(500).json({ error: 'Failed to fetch bus data.' });
  }
});

// 2. Endpoint to Fetch All Stops
app.get('/api/stops', async (req, res) => {
  try {
    const queryText = `
      SELECT
        s.lid, s.lname, s.bid,
        b.bno 
      FROM stops s
      JOIN bus b ON s.bid = b.bid
      ORDER BY s.lid;
    `; 
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stop data during API call:', err.message);
    res.status(500).json({ error: 'Failed to fetch stop data.' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`📡 MTC Bus API Server is listening on http://localhost:${PORT}`);
});
