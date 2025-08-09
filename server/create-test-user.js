const mongoose = require('mongoose');
const User = require('./models/User');
const University = require('./models/University');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');

    // Get the first university
    const university = await University.findOne();
    if (!university) {
        console.log('No universities found');
        process.exit(1);
    }

    console.log('Using university:', university.name);

    // Create a new Club Admin user for testing
    const existingUser = await User.findOne({ email: 'testclubadmin@test.com' });
    if (existingUser) {
        console.log('Test user already exists, deleting...');
        await User.deleteOne({ email: 'testclubadmin@test.com' });
    }

    const testUser = new User({
        name: 'Test Club Admin',
        email: 'testclubadmin@test.com',
        password: 'password123',
        role: 'Club Admin',
        university: university._id,
        major: 'Computer Science',
        year: 'Junior'
    });

    await testUser.save();
    console.log('Test Club Admin user created successfully');
    console.log('Email: testclubadmin@test.com');
    console.log('Password: password123');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
