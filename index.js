require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const bot = require('./bot');
const adminRoutes = require('./admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
