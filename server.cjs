const express = require('express');
const path = require('path');
const apiRouter = require('./api.ts').default; // Note the `.default` to handle the default export

const app = express();

// Use the PORT environment variable provided by Cloud Run,
// or default to 8080 for local development.
const port = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Mount the API router
app.use('/api', apiRouter);

// Start the server and listen on the correct port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
