const mongoose = require('mongoose');
const Announcement = require('./models/Announcement');
const Club = require('./models/Club');
const User = require('./models/User');
require('dotenv').config();

const seedAnnouncements = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing announcements
        await Announcement.deleteMany({});
        console.log('Cleared existing announcements');

        // Get some clubs and users to work with
        const clubs = await Club.find().limit(5);
        const users = await User.find().limit(5);

        if (clubs.length === 0) {
            console.log('No clubs found. Please run club seeding first.');
            process.exit(1);
        }

        if (users.length === 0) {
            console.log('No users found. Please run user seeding first.');
            process.exit(1);
        }

        console.log(`Found ${clubs.length} clubs and ${users.length} users`);

        // Sample announcements
        const announcements = [
            {
                club: clubs[0]._id,
                author: users[0]._id,
                title: "Welcome to the New Semester!",
                content: "Hello everyone! We're excited to welcome you to a new semester with our club. We have many exciting events planned including workshops, competitions, and networking sessions. Stay tuned for more updates!",
                type: "General",
                priority: "Normal",
                isPinned: true,
                tags: ["welcome", "semester", "new-members"]
            },
            {
                club: clubs[0]._id,
                author: users[1]._id,
                title: "Upcoming Workshop: React & Node.js",
                content: "Join us for an intensive workshop on full-stack web development using React and Node.js. This hands-on session will cover the fundamentals and advanced concepts. Date: Next Saturday, 2-5 PM, Location: Lab 101",
                type: "Event",
                priority: "High",
                isPinned: false,
                tags: ["workshop", "react", "nodejs", "programming"],
                scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
            },
            {
                club: clubs[0]._id,
                author: users[0]._id,
                title: "Registration Deadline Reminder",
                content: "This is a friendly reminder that the registration deadline for our annual hackathon is approaching fast! Don't miss out on this amazing opportunity to showcase your skills and win exciting prizes.",
                type: "Important",
                priority: "Urgent",
                isPinned: true,
                tags: ["deadline", "hackathon", "registration", "urgent"]
            },
            {
                club: clubs[1]._id,
                author: users[2]._id,
                title: "Club Achievement: National Competition Winners!",
                content: "We are thrilled to announce that our team won first place in the National Programming Competition! Congratulations to all participants. This achievement wouldn't have been possible without your dedication and hard work.",
                type: "Achievement",
                priority: "High",
                isPinned: false,
                tags: ["achievement", "competition", "winners", "programming"]
            },
            {
                club: clubs[1]._id,
                author: users[2]._id,
                title: "Monthly Meeting Schedule",
                content: "Our monthly meetings will be held every first Friday of the month at 6 PM in the main auditorium. These meetings are mandatory for all active members. Agenda and materials will be shared beforehand.",
                type: "General",
                priority: "Normal",
                isPinned: false,
                tags: ["meetings", "schedule", "monthly", "mandatory"]
            },
            {
                club: clubs[2]._id,
                author: users[3]._id,
                title: "Budget Allocation for New Equipment",
                content: "The university has approved our budget request for new equipment! We will be purchasing new computers, software licenses, and development tools. Thank you all for your patience.",
                type: "Important",
                priority: "Normal",
                isPinned: false,
                tags: ["budget", "equipment", "university", "approval"]
            },
            {
                club: clubs[2]._id,
                author: users[4]._id,
                title: "Volunteer Opportunities Available",
                content: "We have several volunteer opportunities available for upcoming events. This is a great way to gain leadership experience and contribute to the club community. Please reach out if interested!",
                type: "General",
                priority: "Low",
                isPinned: false,
                tags: ["volunteers", "opportunities", "leadership", "community"]
            },
            {
                club: clubs[3]._id,
                author: users[0]._id,
                title: "New Partnership Announcement",
                content: "We're excited to announce our new partnership with TechCorp Inc.! This partnership will provide our members with internship opportunities, mentorship programs, and access to industry professionals.",
                type: "Important",
                priority: "High",
                isPinned: true,
                tags: ["partnership", "internship", "mentorship", "techcorp"]
            }
        ];

        // Create announcements
        const createdAnnouncements = await Announcement.insertMany(announcements);
        console.log(`✅ Created ${createdAnnouncements.length} announcements`);

        // Log distribution by clubs
        const announcementsByClub = createdAnnouncements.reduce((acc, announcement) => {
            const clubId = announcement.club.toString();
            acc[clubId] = (acc[clubId] || 0) + 1;
            return acc;
        }, {});

        console.log('\nAnnouncements created by club:');
        for (const [clubId, count] of Object.entries(announcementsByClub)) {
            const club = clubs.find(c => c._id.toString() === clubId);
            console.log(`- ${club?.name || 'Unknown Club'}: ${count} announcements`);
        }

        console.log('\n🎉 Announcements seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding announcements:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seeding
seedAnnouncements();
