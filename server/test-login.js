const axios = require('axios');

async function testAuth() {
    try {
        console.log('Step 1: Logging in as Club Admin...');

        // Login as Club Admin (using the test user we created)
        const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'testclubadmin@test.com',
            password: 'password123'
        });

        console.log('Login response:', loginResponse.data);
        const token = loginResponse.data.token;
        console.log('Token received:', token.substring(0, 50) + '...');

        console.log('\nStep 2: Testing authentication with token...');

        // Test authentication
        const authResponse = await axios.get('http://localhost:3001/test-auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Auth test response:', authResponse.data);

        console.log('\nStep 3: Testing Club Admin role access...');

        // Test Club Admin role access
        const roleResponse = await axios.get('http://localhost:3001/test-club-admin', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Role test response:', roleResponse.data);

        console.log('\nStep 4: Testing club request creation...');

        // Test actual club request creation
        const clubRequestResponse = await axios.post('http://localhost:5001/api/club-requests', {
            name: 'Test Club',
            description: 'Test description',
            category: 'Academic',
            contactEmail: 'testclubadmin@test.com'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Club request creation response:', clubRequestResponse.data);

    } catch (error) {
        console.error('Error during test:', error.response?.data || error.message);
    }
}

testAuth();
