const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Atlas connection...');
console.log('Database URI:', process.env.MONGODB_URI ? 'Set ✓' : 'Not set ✗');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB Atlas connection successful!');
        console.log('Connection state:', mongoose.connection.readyState);
        console.log('Database name:', mongoose.connection.name);
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB Atlas connection failed:');
        console.error('Error:', error.message);
        process.exit(1);
    });
