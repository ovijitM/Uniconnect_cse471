const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const { verifyToken, requireRole } = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Test route to check authentication
app.get('/test-auth', verifyToken, (req, res) => {
    res.json({
        message: 'Authentication successful',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Test route to check role-based access
app.get('/test-club-admin', verifyToken, requireRole('Club Admin'), (req, res) => {
    res.json({
        message: 'Club Admin access granted',
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
    console.log('Use these test endpoints:');
    console.log('1. GET http://localhost:3001/test-auth (with Authorization header)');
    console.log('2. GET http://localhost:3001/test-club-admin (with Authorization header)');
    console.log('');
    console.log('To test, first get a token by logging in as a Club Admin user.');
});
