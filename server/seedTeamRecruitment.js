const mongoose = require('mongoose');
const TeamRecruitment = require('./models/TeamRecruitment');
const Event = require('./models/Event');
const User = require('./models/User');
require('dotenv').config();

const seedTeamRecruitment = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing team recruitment posts
        await TeamRecruitment.deleteMany({});
        console.log('Cleared existing team recruitment posts');

        // Get the specific test user and some other users
        const testUser = await User.findOne({ email: 'testclubadmin@test.com' });
        const otherUsers = await User.find({ email: { $ne: 'testclubadmin@test.com' } }).limit(4);
        const events = await Event.find().limit(10);

        if (!testUser) {
            console.log('Test user not found. Please run create-test-user.js first.');
            process.exit(1);
        }

        if (events.length === 0) {
            console.log('No events found. Please run event seeding first.');
            process.exit(1);
        }

        console.log(`Found test user: ${testUser.name} and ${otherUsers.length} other users, ${events.length} events`);

        // Sample team recruitment posts - some by test user, some by others
        const recruitmentPosts = [
            // Posts BY the test user (will show in "My Posts")
            {
                event: events[0]._id,
                poster: testUser._id,
                title: "Looking for React Developer for My Hackathon Team",
                description: "I'm organizing a team for the upcoming tech hackathon. Need someone with strong React and Node.js skills to join our dynamic team!",
                requiredSkills: ["JavaScript", "React", "Node.js"],
                preferredSkills: ["MongoDB", "UI/UX"],
                teamSize: 4,
                requirements: "Must be available for the entire duration of the hackathon. Previous hackathon experience preferred.",
                contactMethod: "Application",
                priority: "High",
                deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                tags: ["web-dev", "hackathon", "full-stack"],
                isActive: true,
                status: "Open"
            },
            {
                event: events[1]._id,
                poster: testUser._id,
                title: "Mobile App Development Team - Need Designer",
                description: "I'm creating a mobile app for the university project competition. Looking for a talented UI/UX designer to join my team.",
                requiredSkills: ["Design", "UI/UX", "Figma"],
                preferredSkills: ["Mobile Design", "User Research", "Prototyping"],
                teamSize: 3,
                requirements: "Portfolio showcasing mobile design projects required.",
                contactMethod: "Application",
                priority: "Medium",
                deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                tags: ["mobile", "design", "app-development"],
                isActive: true,
                status: "Open"
            },

            // Posts BY others (will show in "Browse Posts" - test user can apply)
            {
                event: events[2]._id,
                poster: otherUsers[0]?._id || testUser._id,
                title: "Data Science Competition Team",
                description: "Looking for data enthusiasts to join our team for the annual data science competition. We'll be working with machine learning models and data visualization.",
                requiredSkills: ["Python", "Data Analysis", "Machine Learning"],
                preferredSkills: ["Pandas", "Scikit-learn", "Data Visualization"],
                teamSize: 5,
                requirements: "Basic understanding of statistics and machine learning concepts required.",
                contactMethod: "Application",
                priority: "High",
                deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                tags: ["data-science", "ml", "competition"],
                isActive: true,
                status: "Open"
            },
            {
                event: events[3]._id,
                poster: otherUsers[1]?._id || testUser._id,
                title: "Full-Stack Developer for Startup Project",
                description: "Join our ambitious startup team! We're building the next big thing in social media and need a talented full-stack developer.",
                requiredSkills: ["JavaScript", "Python", "SQL", "Project Management"],
                preferredSkills: ["AWS", "Docker", "DevOps", "Startup Experience"],
                teamSize: 6,
                requirements: "Must be willing to commit significant time. Equity participation available for the right candidate.",
                contactMethod: "Email",
                contactInfo: "startup.team@example.com",
                priority: "High",
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                tags: ["startup", "full-stack", "equity"],
                isActive: true,
                status: "Open"
            },
            {
                event: events[4]._id,
                poster: otherUsers[2]?._id || testUser._id,
                title: "Marketing & Social Media Specialist",
                description: "Help us spread the word about our awesome project! Looking for someone with great communication skills and social media savvy.",
                requiredSkills: ["Marketing", "Social Media", "Communication"],
                preferredSkills: ["Content Creation", "Analytics", "Brand Management"],
                teamSize: 3,
                requirements: "Experience managing social media accounts for events or organizations preferred.",
                contactMethod: "Application",
                priority: "Low",
                deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
                tags: ["marketing", "social-media", "communication"],
                isActive: true,
                status: "Open"
            },
            {
                event: events[5]._id,
                poster: otherUsers[3]?._id || testUser._id,
                title: "Backend Developer Needed for API Development",
                description: "We're building a complex API for our web application and need an experienced backend developer to join our team.",
                requiredSkills: ["Node.js", "Express", "MongoDB", "API Development"],
                preferredSkills: ["Docker", "Testing", "Authentication", "Microservices"],
                teamSize: 4,
                requirements: "2+ years backend development experience required.",
                contactMethod: "Application",
                priority: "High",
                deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
                tags: ["backend", "api", "nodejs"],
                isActive: true,
                status: "Open"
            }
        ];

        // Create recruitment posts
        const createdPosts = await TeamRecruitment.insertMany(recruitmentPosts);
        console.log(`✅ Created ${createdPosts.length} team recruitment posts`);
        console.log(`- ${recruitmentPosts.filter(p => p.poster.equals(testUser._id)).length} posts by test user`);
        console.log(`- ${recruitmentPosts.filter(p => !p.poster.equals(testUser._id)).length} posts by others`);

        // Add applications FROM the test user TO other people's posts
        const postsFromOthers = createdPosts.filter(post => !post.poster.equals(testUser._id));

        if (postsFromOthers.length > 0) {
            // Apply to the data science post
            const datasiencePost = postsFromOthers.find(p => p.title.includes('Data Science'));
            if (datasiencePost) {
                await TeamRecruitment.findByIdAndUpdate(datasiencePost._id, {
                    $push: {
                        applications: {
                            applicant: testUser._id,
                            message: "Hi! I'm very interested in joining your data science team. I have experience with Python, pandas, and machine learning algorithms. I've worked on several data analysis projects including predictive modeling and data visualization.",
                            skills: ["Python", "Data Analysis", "Machine Learning", "Pandas"],
                            portfolio: "https://github.com/testuser/datascience-projects",
                            experience: "2 years of data analysis experience, completed several ML courses",
                            status: "Pending",
                            appliedAt: new Date()
                        }
                    }
                });
                console.log('✅ Added test user application to Data Science post');
            }

            // Apply to the backend developer post
            const backendPost = postsFromOthers.find(p => p.title.includes('Backend Developer'));
            if (backendPost) {
                await TeamRecruitment.findByIdAndUpdate(backendPost._id, {
                    $push: {
                        applications: {
                            applicant: testUser._id,
                            message: "I'm excited about this backend development opportunity! I have solid experience with Node.js, Express, and MongoDB. I've built several REST APIs and have good understanding of authentication and database design.",
                            skills: ["Node.js", "Express", "MongoDB", "API Development", "Authentication"],
                            portfolio: "https://github.com/testuser/backend-projects",
                            experience: "3+ years backend development, built 5+ production APIs",
                            status: "Accepted",
                            appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                            reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                            reviewNote: "Great experience and portfolio! Welcome to the team."
                        }
                    }
                });
                console.log('✅ Added test user application to Backend Developer post (Accepted)');
            }
        }

        // Add some applications FROM others TO test user's posts
        const testUserPosts = createdPosts.filter(post => post.poster.equals(testUser._id));

        if (testUserPosts.length > 0 && otherUsers.length > 0) {
            // Add application to test user's React developer post
            const reactPost = testUserPosts.find(p => p.title.includes('React Developer'));
            if (reactPost) {
                await TeamRecruitment.findByIdAndUpdate(reactPost._id, {
                    $push: {
                        applications: {
                            applicant: otherUsers[0]._id,
                            message: "Hello! I'm really interested in joining your hackathon team. I have 2+ years of experience with React and Node.js, and I've participated in 3 hackathons before with great results!",
                            skills: ["JavaScript", "React", "Node.js", "MongoDB"],
                            portfolio: "https://github.com/developer123",
                            experience: "2+ years full-stack development, hackathon winner",
                            status: "Pending",
                            appliedAt: new Date()
                        }
                    }
                });
                console.log('✅ Added application from other user to test user React post');
            }
        }

        console.log('🎉 Team recruitment seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding team recruitment data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run the seeding
seedTeamRecruitment();
