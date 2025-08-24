const mongoose = require('mongoose');
require('dotenv').config();
const University = require('./models/University');

const sampleUniversities = [
    {
        name: 'North South University',
        code: 'NSU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.northsouth.edu',
        establishedYear: 1992,
        isActive: true
    },
    {
        name: 'BRAC University',
        code: 'BRACU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.bracu.ac.bd',
        establishedYear: 2001,
        isActive: true
    },
    {
        name: 'University of Dhaka',
        code: 'DU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Public',
        website: 'https://www.du.ac.bd',
        establishedYear: 1921,
        isActive: true
    },
    {
        name: 'Bangladesh University of Engineering and Technology',
        code: 'BUET',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Public',
        website: 'https://www.buet.ac.bd',
        establishedYear: 1962,
        isActive: true
    },
    {
        name: 'Independent University Bangladesh',
        code: 'IUB',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.iub.edu.bd',
        establishedYear: 1993,
        isActive: true
    },
    {
        name: 'American International University-Bangladesh',
        code: 'AIUB',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.aiub.edu',
        establishedYear: 1994,
        isActive: true
    },
    {
        name: 'East West University',
        code: 'EWU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.ewubd.edu',
        establishedYear: 1996,
        isActive: true
    },
    {
        name: 'United International University',
        code: 'UIU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.uiu.ac.bd',
        establishedYear: 2003,
        isActive: true
    },
    {
        name: 'Daffodil International University',
        code: 'DIU',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://daffodilvarsity.edu.bd',
        establishedYear: 2002,
        isActive: true
    },
    {
        name: 'Ahsanullah University of Science and Technology',
        code: 'AUST',
        location: {
            city: 'Dhaka',
            state: 'Dhaka',
            country: 'Bangladesh'
        },
        type: 'Private',
        website: 'https://www.aust.edu',
        establishedYear: 1995,
        isActive: true
    }
];

const seedUniversities = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing universities (optional)
        const existingCount = await University.countDocuments();
        console.log(`Found ${existingCount} existing universities`);

        if (existingCount === 0) {
            // Insert sample universities
            await University.insertMany(sampleUniversities);
            console.log('✅ Sample universities inserted successfully!');
            console.log(`Added ${sampleUniversities.length} universities`);
        } else {
            console.log('Universities already exist, skipping seed...');

            // Check if we need to add any missing universities
            for (const uni of sampleUniversities) {
                const existing = await University.findOne({ code: uni.code });
                if (!existing) {
                    await University.create(uni);
                    console.log(`Added missing university: ${uni.name}`);
                }
            }
        }

        // List all universities
        const allUniversities = await University.find().sort({ name: 1 });
        console.log('\n📋 All Universities:');
        allUniversities.forEach(uni => {
            console.log(`- ${uni.name} (${uni.code}) - ${uni.location.city}`);
        });

    } catch (error) {
        console.error('❌ Error seeding universities:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seeding
seedUniversities();
