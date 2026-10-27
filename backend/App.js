require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const databaseRouter = require('./router/Database-router');
const externalAPIRouter = require('./router/ExternalAPI-router');

const app = express();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nutrient-tracker';

// Resolved from this file rather than the working directory, so the server can
// be started from anywhere.
const FRONTEND_DIST = path.join(__dirname, '..', 'frontend', 'dist', 'nutrient-tracker', 'browser');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(FRONTEND_DIST));

app.use('/api/database', databaseRouter);
app.use('/api/external-api', externalAPIRouter);

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});
