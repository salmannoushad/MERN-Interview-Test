// app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const drawingRoutes = require('./routes/drawingRoutes');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler'); 

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

// API routes
app.use('/api/drawings', drawingRoutes);

// Serve React frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
}

app.use(errorHandler);

module.exports = app;
