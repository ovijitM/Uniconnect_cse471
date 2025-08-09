const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const University = require('./models/University');

const fixExistingData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Get first university for reference
        const firstUniversity = await University.findOne();
        if (!firstUniversity) {
            console.error('No universities found. Please seed universities first.');
            return;
        }

        // Fix admin user university reference
        const adminUser = await User.findOne({ role: 'Administrator' });
        if (adminUser && typeof adminUser.university === 'string') {
            adminUser.university = firstUniversity._id;
            await adminUser.save();
            console.log(`✅ Fixed admin user university reference: ${firstUniversity.name}`);
        }

        // Fix any other users with string university references
        const usersWithStringUniversity = await User.find({
            university: { $type: 'string' }
        });

        for (const user of usersWithStringUniversity) {
            user.university = firstUniversity._id;

            // Fix role casing if needed
            if (user.role === 'student') user.role = 'Student';
            if (user.role === 'clubadmin') user.role = 'Club Admin';
            if (user.role === 'administrator') user.role = 'Administrator';

            await user.save();
            console.log(`✅ Fixed university and role for user: ${user.email} (${user.role})`);
        }

        console.log('\n🎉 Data migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the migration
fixExistingData();
