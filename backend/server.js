const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB Connection Route
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: "Database connected!", time: result.rows[0].now });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// Middlewares

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: "Success! The React frontend is connected to the Node backend." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});