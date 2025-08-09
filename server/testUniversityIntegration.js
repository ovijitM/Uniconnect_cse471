const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const testUniversityIntegration = async () => {
    console.log('🧪 Testing University Integration');
    console.log('='.repeat(50));

    try {
        // 1. Test fetching universities
        console.log('\n1. Testing universities API...');
        const universitiesResponse = await axios.get(`${BASE_URL}/universities`);
        console.log('✅ Universities fetched successfully');
        console.log(`   Total universities: ${universitiesResponse.data.total}`);
        console.log(`   First university: ${universitiesResponse.data.universities[0].name}`);

        // 2. Test user registration with university ID
        console.log('\n2. Testing user registration...');
        const universityId = universitiesResponse.data.universities[0]._id; // NSU

        const testUser = {
            name: 'Test Student',
            email: `test${Date.now()}@example.com`,
            password: 'test123',
            role: 'Student',
            university: universityId,
            major: 'Computer Science',
            year: 'Junior'
        };

        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        console.log('✅ User registered successfully');
        console.log(`   User ID: ${registerResponse.data.user._id}`);
        console.log(`   University: ${registerResponse.data.user.university}`);

        // 3. Test login and profile retrieval
        console.log('\n3. Testing login and profile...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login successful');

        const token = loginResponse.data.token;

        // Test profile endpoint to see populated university
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Profile retrieved with populated university');
        console.log(`   University Name: ${profileResponse.data.user.university.name}`);
        console.log(`   University Code: ${profileResponse.data.user.university.code}`);
        console.log(`   University Type: ${profileResponse.data.user.university.type}`);

        console.log('\n🎉 All tests passed! University integration is working correctly.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
};

// Run the tests
testUniversityIntegration();
