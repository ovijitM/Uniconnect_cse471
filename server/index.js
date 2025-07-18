const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Uniconnect API' });
});

// Connect to MongoDB
console.log('Attempting to connect to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/uniconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Database name:', mongoose.connection.name);
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:');
    console.error('Error message:', error.message);

    if (error.message.includes('IP')) {
      console.error('\n🔒 IP Whitelist Issue:');
      console.error('1. Go to MongoDB Atlas Dashboard');
      console.error('2. Navigate to Network Access');
      console.error('3. Add your current IP address');
      console.error('4. Wait 1-2 minutes for changes to take effect');
    }

    console.error('\n⚠️  Server will exit...');
    process.exit(1);
  });

module.exports = app;
