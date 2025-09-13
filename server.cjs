const express = require('express');
const path = require('path');
const apiRouter = require('./api.ts').default; 

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Mount the API router
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
