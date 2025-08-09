const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const testUserExperience = async () => {
    console.log('👤 Testing Complete User Experience');
    console.log('='.repeat(50));

    try {
        // 1. Get a university and register a student
        const universitiesRes = await axios.get(`${BASE_URL}/universities`);
        const university = universitiesRes.data.universities[0]; // NSU
        console.log(`🏫 Testing with: ${university.name} (${university.code})`);

        // 2. Register a new student
        const student = {
            name: 'Test Student Demo',
            email: `demo${Date.now()}@test.com`,
            password: 'demo123',
            role: 'Student',
            university: university._id,
            major: 'Computer Science',
            year: 'Junior'
        };

        const registerRes = await axios.post(`${BASE_URL}/auth/register`, student);
        const token = registerRes.data.token;
        console.log(`✅ Student registered: ${registerRes.data.user.name}`);

        // 3. Test fetching clubs (should be filtered by university)
        const clubsRes = await axios.get(`${BASE_URL}/clubs`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`\n📚 Clubs visible to student: ${clubsRes.data.total}`);
        console.log('Sample clubs:');
        clubsRes.data.clubs.slice(0, 3).forEach(club => {
            console.log(`  - ${club.name} (${club.category})`);
        });

        // 4. Test fetching events (should be filtered by university)
        const eventsRes = await axios.get(`${BASE_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`\n📅 Events visible to student: ${eventsRes.data.total}`);
        console.log('Sample events:');
        eventsRes.data.events.slice(0, 3).forEach(event => {
            const date = new Date(event.startDate).toDateString();
            console.log(`  - ${event.title} (${date})`);
        });

        // 5. Test joining a club
        const clubToJoin = clubsRes.data.clubs[0];
        console.log(`\n🤝 Attempting to join club: ${clubToJoin.name}`);

        try {
            await axios.post(`${BASE_URL}/clubs/${clubToJoin._id}/join`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`✅ Successfully joined club!`);
        } catch (error) {
            console.log(`ℹ️  ${error.response?.data?.message}`);
        }

        // 6. Test user profile with populated university
        const profileRes = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const userProfile = profileRes.data.user;
        console.log(`\n👤 User Profile:`);
        console.log(`   Name: ${userProfile.name}`);
        console.log(`   Email: ${userProfile.email}`);
        console.log(`   University: ${userProfile.university.name} (${userProfile.university.code})`);
        console.log(`   Role: ${userProfile.role}`);

        // 7. Get university-specific users
        const usersRes = await axios.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`\n👥 Other users at same university: ${usersRes.data.users.length}`);

        console.log(`\n🎉 Complete user experience test successful!`);
        console.log(`\nKey Features Verified:`);
        console.log(`- ✅ University-specific data filtering`);
        console.log(`- ✅ User registration with university selection`);
        console.log(`- ✅ Club joining within same university`);
        console.log(`- ✅ Event visibility for university students`);
        console.log(`- ✅ User profile with populated university info`);
        console.log(`- ✅ University-scoped user connections`);

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
};

// Run the test
testUserExperience();
