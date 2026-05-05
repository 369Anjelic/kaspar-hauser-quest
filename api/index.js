const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve HTML files
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, '../public/kaspar-mittelalter-quest.html');
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else {
    res.status(404).send('HTML file not found');
  }
});

// API: Simple bot response
app.post('/api/bot', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message required' });
  }

  res.json({
    response: `Kaspar antwortet: "${message}"`,
    progress: '0/10'
  });
});

app.get('/leaderboard', (req, res) => {
  res.json({ leaderboard: [] });
});

module.exports = app;
