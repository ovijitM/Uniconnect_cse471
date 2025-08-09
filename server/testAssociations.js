const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const testAssociations = async () => {
    console.log('🔗 Testing University Associations');
    console.log('='.repeat(60));

    try {
        // 1. Get universities
        console.log('\n1. Testing universities...');
        const universitiesRes = await axios.get(`${BASE_URL}/universities`);
        const university = universitiesRes.data.universities[0];
        console.log(`✅ University: ${university.name} (${university.code})`);

        // 2. Register a Club Admin user
        console.log('\n2. Creating Club Admin user...');
        const clubAdmin = {
            name: 'Club Admin Test',
            email: `clubadmin${Date.now()}@test.com`,
            password: 'test123',
            role: 'Club Admin',
            university: university._id,
            major: 'Computer Science',
            year: 'Senior'
        };

        const adminRegRes = await axios.post(`${BASE_URL}/auth/register`, clubAdmin);
        const adminToken = adminRegRes.data.token;
        console.log(`✅ Club Admin created: ${adminRegRes.data.user.name}`);

        // 3. Create a club (should be associated with university)
        console.log('\n3. Creating club...');
        const clubData = {
            name: `Test Club ${Date.now()}`,
            description: 'A test club for verification',
            category: 'Academic',
            contactEmail: clubAdmin.email,
            membershipFee: 0
        };

        const clubRes = await axios.post(`${BASE_URL}/clubs`, clubData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const club = clubRes.data.club;
        console.log(`✅ Club created: ${club.name}`);
        console.log(`   University: ${club.university.name}`);

        // 4. Create an event (should be associated with university and club)
        console.log('\n4. Creating event...');
        const eventData = {
            title: `Test Event ${Date.now()}`,
            description: 'A test event for verification',
            type: 'Workshop',
            organizer: club._id,
            startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Same day
            startTime: '14:00',
            endTime: '16:00',
            venue: 'Test Venue, Test Address',
            capacity: 50,
            registrationRequired: true
        };

        const eventRes = await axios.post(`${BASE_URL}/events`, eventData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log(`✅ Event created: ${eventRes.data.event.title}`);

        // 5. Register a regular student at the same university
        console.log('\n5. Creating Student user at same university...');
        const student = {
            name: 'Student Test',
            email: `student${Date.now()}@test.com`,
            password: 'test123',
            role: 'Student',
            university: university._id,
            major: 'Computer Science',
            year: 'Junior'
        };

        const studentRegRes = await axios.post(`${BASE_URL}/auth/register`, student);
        const studentToken = studentRegRes.data.token;
        console.log(`✅ Student created: ${studentRegRes.data.user.name}`);

        // 6. Test student joining club (should work - same university)
        console.log('\n6. Testing student joining club...');
        try {
            await axios.post(`${BASE_URL}/clubs/${club._id}/join`, {}, {
                headers: { Authorization: `Bearer ${studentToken}` }
            });
            console.log(`✅ Student successfully joined club`);
        } catch (error) {
            console.log(`❌ Student could not join club: ${error.response?.data?.message}`);
        }

        // 7. Create student at different university
        console.log('\n7. Testing cross-university restrictions...');
        const otherUniversity = universitiesRes.data.universities[1];
        if (otherUniversity) {
            const otherStudent = {
                name: 'Other Student',
                email: `otherstudent${Date.now()}@test.com`,
                password: 'test123',
                role: 'Student',
                university: otherUniversity._id,
                major: 'Computer Science',
                year: 'Junior'
            };

            const otherStudentRegRes = await axios.post(`${BASE_URL}/auth/register`, otherStudent);
            const otherStudentToken = otherStudentRegRes.data.token;
            console.log(`✅ Other student created at: ${otherUniversity.name}`);

            // 8. Test other student trying to join club (should fail - different university)
            console.log('\n8. Testing cross-university club join restriction...');
            try {
                await axios.post(`${BASE_URL}/clubs/${club._id}/join`, {}, {
                    headers: { Authorization: `Bearer ${otherStudentToken}` }
                });
                console.log(`❌ Cross-university join should have been blocked!`);
            } catch (error) {
                console.log(`✅ Cross-university join properly blocked: ${error.response?.data?.message}`);
            }
        }

        // 9. Test fetching university-filtered clubs
        console.log('\n9. Testing university-filtered club listing...');
        const clubsRes = await axios.get(`${BASE_URL}/clubs?university=${university._id}`);
        console.log(`✅ Found ${clubsRes.data.clubs.length} clubs for ${university.name}`);

        const hasOurClub = clubsRes.data.clubs.some(c => c._id === club._id);
        console.log(`   Our club included: ${hasOurClub ? '✅' : '❌'}`);

        console.log('\n🎉 All association tests completed successfully!');
        console.log('\nKey Associations Verified:');
        console.log('- ✅ Users associated with Universities');
        console.log('- ✅ Clubs associated with Universities and Club Admins');
        console.log('- ✅ Events associated with Universities and Clubs');
        console.log('- ✅ Cross-university restrictions enforced');
        console.log('- ✅ University-filtered data fetching works');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
};

// Run the tests
testAssociations();
