const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

const app = express();

// Update the SSL/TLS certificate paths to the new location
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl_certs/privkey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl_certs/fullchain.pem')),
  ca: fs.readFileSync(path.join(__dirname, 'ssl_certs/chain.pem'))
};

// Define the port to run the server on
const PORT = 443;

// Function to determine the correct directory based on the hostname
const chooseStaticDir = (req) => {
  if (req.hostname === 'prestonbrubaker.com' || req.hostname === 'www.prestonbrubaker.com') {
    return 'public_preston';
  } else if (req.hostname === 'willohrobbins.com' || req.hostname === 'www.willohrobbins.com') {
    return 'public_willoh';
  }
  return null;
};

// Use a middleware to serve files from the correct directory
app.use((req, res, next) => {
  const staticDir = chooseStaticDir(req);
  if (staticDir) {
    express.static(path.join(__dirname, staticDir))(req, res, next);
  } else {
    next(); // Continue to the next middleware if neither domain matches
  }
});

// Fallback for any other requests
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Create an HTTPS server with the SSL/TLS options and attach the Express app
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});
