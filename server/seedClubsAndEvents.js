const mongoose = require('mongoose');
require('dotenv').config();
const University = require('./models/University');
const User = require('./models/User');
const Club = require('./models/Club');
const Event = require('./models/Event');

const sampleClubs = [
    {
        name: 'Computer Science Society',
        description: 'A community for computer science students to collaborate, learn, and grow together. We organize coding workshops, hackathons, and tech talks.',
        category: 'Technical',
        contactEmail: 'css@university.edu',
        advisors: ['Dr. John Smith', 'Prof. Sarah Johnson'],
        meetingSchedule: {
            day: 'Wednesday',
            time: '6:00 PM',
            location: 'Room 301, CS Building'
        },
        membershipFee: 0
    },
    {
        name: 'Photography Club',
        description: 'Capture moments, create memories. Join us for photo walks, workshops on photography techniques, and exhibitions.',
        category: 'Arts & Literature',
        contactEmail: 'photo@university.edu',
        advisors: ['Prof. Mike Davis'],
        meetingSchedule: {
            day: 'Friday',
            time: '4:30 PM',
            location: 'Art Studio 2'
        },
        membershipFee: 15
    },
    {
        name: 'Debate Society',
        description: 'Enhance your public speaking and critical thinking skills. Participate in inter-university debates and workshops.',
        category: 'Debate & Drama',
        contactEmail: 'debate@university.edu',
        advisors: ['Dr. Emily Brown'],
        meetingSchedule: {
            day: 'Monday',
            time: '5:00 PM',
            location: 'Main Auditorium'
        },
        membershipFee: 10
    },
    {
        name: 'Environmental Club',
        description: 'Making our campus and community more sustainable. Join our tree planting drives and environmental awareness campaigns.',
        category: 'Social Service',
        contactEmail: 'environment@university.edu',
        advisors: ['Dr. Green Wilson'],
        meetingSchedule: {
            day: 'Thursday',
            time: '3:00 PM',
            location: 'Student Center Room 205'
        },
        membershipFee: 5
    },
    {
        name: 'Basketball Team',
        description: 'University basketball team for competitive and recreational players. Training sessions and inter-university tournaments.',
        category: 'Sports',
        contactEmail: 'basketball@university.edu',
        advisors: ['Coach Robert Taylor'],
        meetingSchedule: {
            day: 'Tuesday',
            time: '7:00 PM',
            location: 'Sports Complex'
        },
        membershipFee: 25
    },
    {
        name: 'Music Society',
        description: 'For music lovers and performers. Regular jam sessions, concerts, and music theory workshops.',
        category: 'Music & Dance',
        contactEmail: 'music@university.edu',
        advisors: ['Prof. Melody Jones'],
        meetingSchedule: {
            day: 'Saturday',
            time: '2:00 PM',
            location: 'Music Room'
        },
        membershipFee: 20
    },
    {
        name: 'Cultural Society',
        description: 'Celebrate diversity and organize cultural events, festivals, and international food fairs.',
        category: 'Cultural',
        contactEmail: 'culture@university.edu',
        advisors: ['Dr. Cultural Rahman'],
        meetingSchedule: {
            day: 'Sunday',
            time: '11:00 AM',
            location: 'Cultural Center'
        },
        membershipFee: 12
    },
    {
        name: 'Business Club',
        description: 'For aspiring entrepreneurs and business students. Case competitions, networking events, and guest lectures.',
        category: 'Academic',
        contactEmail: 'business@university.edu',
        advisors: ['Prof. Business Khan'],
        meetingSchedule: {
            day: 'Wednesday',
            time: '4:00 PM',
            location: 'Business Building 101'
        },
        membershipFee: 18
    }
];

const sampleEvents = [
    {
        title: 'Annual Hackathon 2025',
        description: 'A 48-hour coding marathon where students can showcase their programming skills and build innovative solutions. Prizes worth $5000 to be won!',
        eventType: 'Competition',
        startTime: '18:00',
        endTime: '18:00',
        venue: 'Computer Science Building',
        maxAttendees: 200,
        registrationFee: 0,
        isRegistrationRequired: true,
        isPublic: true,
        tags: ['coding', 'hackathon', 'programming', 'competition']
    },
    {
        title: 'Photography Exhibition: Campus Life',
        description: 'Showcase of stunning photography capturing the essence of campus life by our talented photography club members.',
        eventType: 'Cultural Program',
        startTime: '10:00',
        endTime: '17:00',
        venue: 'Art Gallery, Main Building',
        maxAttendees: 150,
        registrationFee: 0,
        isRegistrationRequired: false,
        isPublic: false,
        tags: ['photography', 'exhibition', 'art', 'campus']
    },
    {
        title: 'Inter-University Debate Championship',
        description: 'Annual debate competition featuring teams from top universities. Topic: "Technology: Blessing or Curse for Humanity"',
        eventType: 'Competition',
        startTime: '14:00',
        endTime: '18:00',
        venue: 'Main Auditorium',
        maxAttendees: 300,
        registrationFee: 5,
        isRegistrationRequired: true,
        isPublic: true,
        tags: ['debate', 'competition', 'public speaking', 'championship']
    },
    {
        title: 'Tree Plantation Drive',
        description: 'Join us in making our campus greener! Free lunch and certificate for all participants.',
        eventType: 'Community Service',
        startTime: '08:00',
        endTime: '12:00',
        venue: 'Campus Grounds',
        maxAttendees: 100,
        registrationFee: 0,
        isRegistrationRequired: true,
        isPublic: true,
        tags: ['environment', 'trees', 'community service', 'green campus']
    },
    {
        title: 'Basketball Tournament Finals',
        description: 'The ultimate showdown between the top basketball teams. Come cheer for your favorites!',
        eventType: 'Sports Event',
        startTime: '16:00',
        endTime: '19:00',
        venue: 'Sports Complex',
        maxAttendees: 500,
        registrationFee: 3,
        isRegistrationRequired: false,
        isPublic: true,
        tags: ['basketball', 'sports', 'tournament', 'finals']
    },
    {
        title: 'Spring Music Concert',
        description: 'An evening of melodious performances by our music society members and guest artists.',
        eventType: 'Cultural Program',
        startTime: '19:00',
        endTime: '22:00',
        venue: 'Open Air Theater',
        maxAttendees: 400,
        registrationFee: 8,
        isRegistrationRequired: true,
        isPublic: false,
        tags: ['music', 'concert', 'performance', 'spring']
    },
    {
        title: 'International Food Festival',
        description: 'Taste authentic cuisines from around the world prepared by our international students and cultural society.',
        eventType: 'Cultural Program',
        startTime: '11:00',
        endTime: '20:00',
        venue: 'Student Plaza',
        maxAttendees: 600,
        registrationFee: 0,
        isRegistrationRequired: false,
        isPublic: true,
        tags: ['food', 'international', 'cultural', 'festival']
    },
    {
        title: 'Entrepreneurship Workshop',
        description: 'Learn from successful entrepreneurs about starting your own business. Networking session included.',
        eventType: 'Workshop',
        startTime: '14:00',
        endTime: '17:00',
        venue: 'Business Building Seminar Hall',
        maxAttendees: 80,
        registrationFee: 10,
        isRegistrationRequired: true,
        isPublic: false,
        tags: ['entrepreneurship', 'business', 'startup', 'workshop']
    },
    {
        title: 'AI & Machine Learning Seminar',
        description: 'Exploring the future of AI with industry experts. Certificate provided to all attendees.',
        eventType: 'Seminar',
        startTime: '10:00',
        endTime: '13:00',
        venue: 'CS Auditorium',
        maxAttendees: 120,
        registrationFee: 0,
        isRegistrationRequired: true,
        isPublic: true,
        tags: ['AI', 'machine learning', 'technology', 'seminar']
    },
    {
        title: 'Career Fair 2025',
        description: 'Meet with top recruiters and explore career opportunities. Bring your resume!',
        eventType: 'Other',
        startTime: '09:00',
        endTime: '16:00',
        venue: 'Exhibition Hall',
        maxAttendees: 1000,
        registrationFee: 0,
        isRegistrationRequired: false,
        isPublic: true,
        tags: ['career', 'jobs', 'recruitment', 'networking']
    }
];

const seedClubsAndEvents = async () => {
    try {
        console.log('🌱 Seeding Clubs and Events Data');
        console.log('='.repeat(50));

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Get universities
        const universities = await University.find();
        if (universities.length === 0) {
            console.error('❌ No universities found. Please seed universities first.');
            return;
        }

        console.log(`Found ${universities.length} universities`);

        // Clear existing clubs and events
        await Club.deleteMany({});
        await Event.deleteMany({});
        console.log('✅ Cleared existing clubs and events');

        let totalClubsCreated = 0;
        let totalEventsCreated = 0;

        // Create clubs for each university
        for (const university of universities) {
            console.log(`\n📍 Creating clubs for ${university.name}...`);

            // Get or create club admin users for this university
            let clubAdmins = await User.find({
                role: 'Club Admin',
                university: university._id
            });

            // If no club admins exist, create some
            if (clubAdmins.length === 0) {
                for (let i = 0; i < 3; i++) {
                    const clubAdmin = new User({
                        name: `Club Admin ${i + 1}`,
                        email: `clubadmin${i + 1}.${university.code.toLowerCase()}@university.edu`,
                        password: 'clubadmin123',
                        role: 'Club Admin',
                        university: university._id,
                        major: 'Student Affairs',
                        year: 'Senior'
                    });
                    await clubAdmin.save();
                    clubAdmins.push(clubAdmin);
                }
                console.log(`  Created ${clubAdmins.length} club admin users`);
            }

            // Create clubs for this university
            const universityClubs = [];
            for (let i = 0; i < sampleClubs.length; i++) {
                const clubData = sampleClubs[i];
                const president = clubAdmins[i % clubAdmins.length];

                const club = new Club({
                    ...clubData,
                    name: `${clubData.name} - ${university.code}`,
                    university: university._id,
                    president: president._id,
                    members: [{
                        user: president._id,
                        role: 'President'
                    }]
                });

                await club.save();
                universityClubs.push(club);
                totalClubsCreated++;

                // Add some random members to clubs
                const students = await User.find({
                    role: 'Student',
                    university: university._id
                }).limit(5);

                for (const student of students.slice(0, Math.floor(Math.random() * 3) + 1)) {
                    club.members.push({
                        user: student._id,
                        role: 'Member'
                    });
                }
                await club.save();
            }

            console.log(`  ✅ Created ${universityClubs.length} clubs`);

            // Create events for clubs
            console.log(`  📅 Creating events...`);
            for (let i = 0; i < sampleEvents.length; i++) {
                const eventData = sampleEvents[i];
                const club = universityClubs[i % universityClubs.length];

                // Generate dates for the next 3 months
                const baseDate = new Date();
                const daysAhead = Math.floor(Math.random() * 90) + 1;
                const startDate = new Date(baseDate);
                startDate.setDate(baseDate.getDate() + daysAhead);

                const endDate = new Date(startDate);
                if (eventData.eventType === 'Competition' && eventData.title.includes('Hackathon')) {
                    endDate.setDate(startDate.getDate() + 2); // 48-hour hackathon
                } else {
                    endDate.setDate(startDate.getDate()); // Same day
                }

                const event = new Event({
                    ...eventData,
                    title: `${eventData.title} - ${university.code}`,
                    club: club._id,
                    university: university._id,
                    startDate: startDate,
                    endDate: endDate,
                    registrationDeadline: new Date(startDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before
                });

                await event.save();
                totalEventsCreated++;
            }

            console.log(`  ✅ Created ${sampleEvents.length} events`);
        }

        console.log(`\n🎉 Seeding completed successfully!`);
        console.log(`📊 Summary:`);
        console.log(`   Universities: ${universities.length}`);
        console.log(`   Total Clubs Created: ${totalClubsCreated}`);
        console.log(`   Total Events Created: ${totalEventsCreated}`);
        console.log(`   Average per University: ${Math.round(totalClubsCreated / universities.length)} clubs, ${Math.round(totalEventsCreated / universities.length)} events`);

        // Display some sample data
        console.log(`\n📋 Sample Clubs:`);
        const sampleClubsList = await Club.find().populate('university', 'name code').limit(5);
        sampleClubsList.forEach(club => {
            console.log(`   - ${club.name} (${club.university.name}) - ${club.category}`);
        });

        console.log(`\n📅 Sample Events:`);
        const sampleEventsList = await Event.find().populate('university', 'name code').limit(5);
        sampleEventsList.forEach(event => {
            console.log(`   - ${event.title} (${event.university.name}) - ${event.startDate.toDateString()}`);
        });

    } catch (error) {
        console.error('❌ Error seeding clubs and events:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    }
};

// Run the seeding
seedClubsAndEvents();
