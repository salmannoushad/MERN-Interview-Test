const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const drawingRoutes = require('./routes/drawingRoutes');
const cors = require("cors")

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON
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

// Error handler middleware (optional)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
