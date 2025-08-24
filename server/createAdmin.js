const mongoose = require('mongoose');
const User = require('./models/User');
const University = require('./models/University');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'Administrator' });

        if (existingAdmin) {
            console.log('Administrator user already exists:', existingAdmin.email);
            return;
        }

        // Get first university for admin user
        const firstUniversity = await University.findOne();
        if (!firstUniversity) {
            console.error('No universities found. Please seed universities first.');
            return;
        }

        // Create admin user
        const adminUser = new User({
            name: 'System Administrator',
            email: 'admin@uniconnect.com',
            password: 'admin123', // This will be hashed automatically by the pre-save hook
            role: 'Administrator',
            university: firstUniversity._id,
            major: 'System Administration',
            year: 'Senior'
        });

        await adminUser.save();
        console.log('Administrator user created successfully!');
        console.log('Email: admin@uniconnect.com');
        console.log('Password: admin123');
        console.log('Please change this password after first login.');

    } catch (error) {
        console.error('Error creating administrator:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();
