const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('../models/Event');
const Club = require('../models/Club');
const University = require('../models/University');
const User = require('../models/User');

// Test event data with comprehensive scenarios
const testEvents = [
    {
        title: "AI & Machine Learning Workshop",
        description: "Join us for an intensive workshop on artificial intelligence and machine learning fundamentals. Learn about neural networks, deep learning, and practical applications in modern technology. This hands-on session will cover Python programming, TensorFlow basics, and real-world case studies.",
        club: "689ba58fa82b4c543643e691", // Programming Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Workshop",
        startDate: new Date('2025-09-15'),
        endDate: new Date('2025-09-15'),
        startTime: "09:00",
        endTime: "17:00",
        venue: "Computer Lab 301, AUST",
        maxAttendees: 50,
        registrationFee: 500,
        registrationDeadline: new Date('2025-09-10'),
        isRegistrationRequired: true,
        tags: ["AI", "Machine Learning", "Python", "Technology"],
        requirements: "Basic programming knowledge in Python preferred",
        contactPerson: {
            name: "Dr. Ahmed Rahman",
            email: "ahmed.rahman@aust.edu",
            phone: "+880-1712-345678"
        },
        status: "upcoming",
        accessType: "university-exclusive",
        isPublic: true
    },
    {
        title: "Inter-University Debate Championship",
        description: "Annual debate championship featuring teams from top universities across Bangladesh. Topics will cover current affairs, technology, social issues, and global politics. Prizes worth BDT 50,000 for winners.",
        club: "689ba591a82b4c543643e6a3", // Debate Society - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Competition",
        startDate: new Date('2025-10-20'),
        endDate: new Date('2025-10-22'),
        startTime: "10:00",
        endTime: "18:00",
        venue: "Main Auditorium, AUST",
        maxAttendees: 200,
        registrationFee: 1000,
        registrationDeadline: new Date('2025-10-15'),
        isRegistrationRequired: true,
        tags: ["Debate", "Competition", "Inter-University", "Public Speaking"],
        requirements: "Team of 3 members, university student ID required",
        contactPerson: {
            name: "Sarah Khan",
            email: "sarah.khan@aust.edu",
            phone: "+880-1798-765432"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Photography Exhibition: Urban Life",
        description: "Showcase of stunning urban photography by students and faculty. Explore the beauty of city life through different lenses and perspectives. Free entry for all visitors.",
        club: "689ba590a82b4c543643e699", // Photography Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Cultural Program",
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-07'),
        startTime: "10:00",
        endTime: "20:00",
        venue: "Art Gallery, AUST Campus",
        maxAttendees: 500,
        registrationFee: 0,
        isRegistrationRequired: false,
        tags: ["Photography", "Art", "Exhibition", "Culture"],
        contactPerson: {
            name: "Ravi Sharma",
            email: "ravi.sharma@aust.edu",
            phone: "+880-1634-987654"
        },
        status: "ongoing",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Environmental Awareness Seminar",
        description: "Learn about climate change, sustainability, and environmental conservation. Expert speakers will discuss renewable energy, waste management, and green technology solutions.",
        club: "689ba591a82b4c543643e6ad", // Environmental Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Seminar",
        startDate: new Date('2025-08-25'),
        endDate: new Date('2025-08-25'),
        startTime: "14:00",
        endTime: "17:00",
        venue: "Seminar Hall B, AUST",
        maxAttendees: 100,
        registrationFee: 0,
        registrationDeadline: new Date('2025-08-20'),
        isRegistrationRequired: true,
        tags: ["Environment", "Climate Change", "Sustainability", "Green Technology"],
        requirements: "Open to all students and faculty",
        contactPerson: {
            name: "Dr. Fatima Ali",
            email: "fatima.ali@aust.edu",
            phone: "+880-1556-123789"
        },
        status: "closed",
        accessType: "university-exclusive",
        isPublic: true
    },
    {
        title: "Basketball Tournament 2025",
        description: "Annual inter-department basketball tournament. Teams from all departments will compete for the championship trophy. Exciting matches and great prizes await!",
        club: "689ba591a82b4c543643e6b5", // Basketball Team - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Sports Event",
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-15'),
        startTime: "16:00",
        endTime: "20:00",
        venue: "Sports Complex, AUST",
        maxAttendees: 300,
        registrationFee: 200,
        registrationDeadline: new Date('2025-11-05'),
        isRegistrationRequired: true,
        tags: ["Basketball", "Sports", "Tournament", "Inter-Department"],
        requirements: "Team of 5 players + 2 substitutes, valid student ID",
        contactPerson: {
            name: "Coach Rahman",
            email: "coach.rahman@aust.edu",
            phone: "+880-1723-456789"
        },
        status: "upcoming",
        accessType: "university-exclusive",
        isPublic: true
    },
    {
        title: "Music Concert: Fusion Night",
        description: "An evening of fusion music featuring traditional and contemporary performances by talented student musicians. Experience the blend of classical and modern musical styles.",
        club: "689ba591a82b4c543643e6bf", // Music Society - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Cultural Program",
        startDate: new Date('2025-12-05'),
        endDate: new Date('2025-12-05'),
        startTime: "19:00",
        endTime: "22:00",
        venue: "Open Air Theater, AUST",
        maxAttendees: 400,
        registrationFee: 300,
        registrationDeadline: new Date('2025-12-01'),
        isRegistrationRequired: true,
        tags: ["Music", "Concert", "Fusion", "Cultural"],
        requirements: "Advance booking required",
        contactPerson: {
            name: "Musician Karim",
            email: "karim.music@aust.edu",
            phone: "+880-1845-678901"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Business Plan Competition",
        description: "Present your innovative business ideas to a panel of industry experts and investors. Winners receive seed funding and mentorship opportunities.",
        club: "689ba591a82b4c543643e6cf", // Business Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Competition",
        startDate: new Date('2025-10-30'),
        endDate: new Date('2025-10-30'),
        startTime: "09:00",
        endTime: "18:00",
        venue: "Business Incubation Center, AUST",
        maxAttendees: 80,
        registrationFee: 800,
        registrationDeadline: new Date('2025-10-25'),
        isRegistrationRequired: true,
        tags: ["Business", "Entrepreneurship", "Competition", "Innovation"],
        requirements: "Business plan submission required by deadline",
        contactPerson: {
            name: "Prof. Nasir Ahmed",
            email: "nasir.ahmed@aust.edu",
            phone: "+880-1967-234567"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Tech Conference 2025: Future of Computing",
        description: "Join industry leaders and researchers for discussions on emerging technologies, quantum computing, blockchain, and the future of software development.",
        club: "689ba58fa82b4c543643e691", // Programming Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Conference",
        startDate: new Date('2025-11-25'),
        endDate: new Date('2025-11-26'),
        startTime: "09:00",
        endTime: "17:00",
        venue: "Convention Center, AUST",
        maxAttendees: 250,
        registrationFee: 1500,
        registrationDeadline: new Date('2025-11-20'),
        isRegistrationRequired: true,
        tags: ["Technology", "Conference", "Computing", "Innovation"],
        requirements: "Professional or student background in technology",
        contactPerson: {
            name: "Dr. Tech Lead",
            email: "tech.lead@aust.edu",
            phone: "+880-1789-345612"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Community Service: Clean Dhaka Initiative",
        description: "Join us in making Dhaka cleaner and greener. Volunteer for community cleanup drives, tree plantation, and awareness campaigns.",
        club: "689ba591a82b4c543643e6ad", // Environmental Club - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Community Service",
        startDate: new Date('2025-09-28'),
        endDate: new Date('2025-09-28'),
        startTime: "07:00",
        endTime: "12:00",
        venue: "Dhanmondi Lake Area",
        maxAttendees: 150,
        registrationFee: 0,
        registrationDeadline: new Date('2025-09-25'),
        isRegistrationRequired: true,
        tags: ["Community Service", "Environment", "Volunteer", "Social Impact"],
        requirements: "Comfortable clothing and willingness to help",
        contactPerson: {
            name: "Volunteer Coordinator",
            email: "volunteer@aust.edu",
            phone: "+880-1612-789456"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Annual Cultural Festival",
        description: "Celebrate diversity and culture with performances, food stalls, art exhibitions, and cultural activities from different regions of Bangladesh and beyond.",
        club: "689ba591a82b4c543643e6c7", // Cultural Society - AUST
        university: "6897919de9a87e3c5e4dcc82", // AUST
        eventType: "Cultural Program",
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-17'),
        startTime: "10:00",
        endTime: "22:00",
        venue: "Entire AUST Campus",
        maxAttendees: 1000,
        registrationFee: 100,
        registrationDeadline: new Date('2025-12-10'),
        isRegistrationRequired: false,
        tags: ["Culture", "Festival", "Diversity", "Celebration"],
        requirements: "Open to all, family-friendly event",
        contactPerson: {
            name: "Cultural Director",
            email: "culture@aust.edu",
            phone: "+880-1534-567890"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "Charity Fundraiser: Education for All",
        description: "Help us raise funds to provide educational materials and scholarships for underprivileged students. Every contribution makes a difference.",
        club: "68b1fc68438d45282ed96294", // Communication and Language club
        university: "6897919de9a87e3c5e4dcc7e", // AIUB
        eventType: "Fundraiser",
        startDate: new Date('2025-10-10'),
        endDate: new Date('2025-10-10'),
        startTime: "18:00",
        endTime: "21:00",
        venue: "AIUB Auditorium",
        maxAttendees: 200,
        registrationFee: 500,
        registrationDeadline: new Date('2025-10-05'),
        isRegistrationRequired: true,
        tags: ["Charity", "Fundraiser", "Education", "Social Cause"],
        requirements: "Donation-based entry, minimum BDT 500",
        contactPerson: {
            name: "Charity Coordinator",
            email: "charity@aiub.edu",
            phone: "+880-1456-789123"
        },
        status: "upcoming",
        accessType: "open",
        isPublic: true
    },
    {
        title: "EEE Department Meeting",
        description: "Monthly department meeting to discuss curriculum updates, student feedback, and upcoming academic activities. All EEE students and faculty are invited.",
        club: "68b1bd4c00c89ba5edcaab30", // EEE club
        university: "6897919de9a87e3c5e4dcc7e", // AIUB
        eventType: "Meeting",
        startDate: new Date('2025-09-05'),
        endDate: new Date('2025-09-05'),
        startTime: "15:00",
        endTime: "17:00",
        venue: "EEE Department, Room 205, AIUB",
        maxAttendees: 60,
        registrationFee: 0,
        isRegistrationRequired: false,
        tags: ["Meeting", "Department", "Academic", "EEE"],
        requirements: "EEE department students and faculty only",
        contactPerson: {
            name: "Department Head",
            email: "eee.head@aiub.edu",
            phone: "+880-1378-456789"
        },
        status: "upcoming",
        accessType: "university-exclusive",
        isPublic: false
    }
];

async function seedEvents() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing events
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Insert test events
        const insertedEvents = await Event.insertMany(testEvents);
        console.log(`Successfully inserted ${insertedEvents.length} test events`);

        // Display summary
        console.log('\n=== EVENT SUMMARY ===');
        const eventsByType = await Event.aggregate([
            { $group: { _id: '$eventType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        
        const eventsByStatus = await Event.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        const eventsByAccess = await Event.aggregate([
            { $group: { _id: '$accessType', count: { $sum: 1 } } }
        ]);

        console.log('Events by Type:');
        eventsByType.forEach(item => console.log(`  ${item._id}: ${item.count}`));
        
        console.log('\nEvents by Status:');
        eventsByStatus.forEach(item => console.log(`  ${item._id}: ${item.count}`));
        
        console.log('\nEvents by Access Type:');
        eventsByAccess.forEach(item => console.log(`  ${item._id}: ${item.count}`));

        console.log('\n=== SAMPLE EVENTS ===');
        const sampleEvents = await Event.find({})
            .populate('club', 'name')
            .populate('university', 'name code')
            .limit(3)
            .select('title eventType status accessType club university startDate');
        
        sampleEvents.forEach(event => {
            console.log(`${event.title}`);
            console.log(`  Type: ${event.eventType} | Status: ${event.status} | Access: ${event.accessType}`);
            console.log(`  Club: ${event.club?.name} | University: ${event.university?.name}`);
            console.log(`  Date: ${event.startDate.toDateString()}\n`);
        });

    } catch (error) {
        console.error('Error seeding events:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the seeding function
if (require.main === module) {
    seedEvents();
}

module.exports = { seedEvents, testEvents };