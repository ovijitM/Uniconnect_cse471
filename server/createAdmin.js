const mongoose = require('mongoose');
const User = require('./models/User');
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

        // Create admin user
        const adminUser = new User({
            name: 'System Administrator',
            email: 'admin@uniconnect.com',
            password: 'admin123', // This will be hashed automatically by the pre-save hook
            role: 'Administrator',
            university: 'UniConnect System',
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
