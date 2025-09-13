// server.cjs
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Absolute path to the built client
const distDir = path.join(__dirname, 'dist');

// Lightweight health check so Cloud Run can confirm we're up
app.get('/healthz', (_req, res) => res.status(200).send('ok'));

// Serve static assets from /dist (don't auto-serve index.html here)
app.use(express.static(distDir, {
  index: false,            // important: let the catch-all send index.html
  maxAge: '1h',            // optional: cache static files
}));

// ✅ Express 5 catch-all (use a regex, not '*')
app.get('(.*)', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

// Bind to 0.0.0.0 so Cloud Run can reach the container
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});
