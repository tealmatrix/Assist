const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Import routes
const appointmentRoutes = require('./routes/appointments');
const listRoutes = require('./routes/lists');
const noteRoutes = require('./routes/notes');
const emailRoutes = require('./routes/emails');
const errandRoutes = require('./routes/errands');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-assistant', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/errands', errandRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Personal Assistant API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
