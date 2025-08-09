const axios = require('axios');

async function testClubRequest() {
    try {
        console.log('Step 1: Logging in as Club Admin...');

        // Login as Club Admin
        const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'testclubadmin@test.com',
            password: 'password123'
        });

        console.log('Login response:', {
            message: loginResponse.data.message,
            user: loginResponse.data.user
        });
        const token = loginResponse.data.token;

        console.log('\nStep 2: Testing club request creation...');

        // Test actual club request creation
        const clubRequestResponse = await axios.post('http://localhost:5001/api/club-requests', {
            name: 'Test Club',
            description: 'Test description',
            category: 'Academic',
            contactEmail: 'testclubadmin@test.com'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Club request creation SUCCESS:', clubRequestResponse.data);

    } catch (error) {
        console.error('Error during test:');
        console.error('Status:', error.response?.status);
        console.error('Message:', error.response?.data?.message || error.message);
        console.error('Headers sent:', error.config?.headers);
    }
}

testClubRequest();
