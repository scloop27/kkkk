const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());
app.use(express.static('public'));

// Simple test route
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Lodge Management Platform</title></head>
      <body>
        <h1>Lodge Management Platform</h1>
        <p>Server is running on port ${PORT}</p>
        <p>Environment: ${process.env.NODE_ENV || 'development'}</p>
        <a href="/test">Test API</a>
      </body>
    </html>
  `);
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Server is working!', 
    timestamp: new Date().toISOString(),
    port: PORT 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});