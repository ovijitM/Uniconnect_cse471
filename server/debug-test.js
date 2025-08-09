const axios = require('axios');

async function debugTest() {
    try {
        console.log('Step 1: Logging in as Club Admin...');

        // Login as Club Admin
        const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'testclubadmin@test.com',
            password: 'password123'
        });

        const token = loginResponse.data.token;
        console.log('Login successful, user role:', loginResponse.data.user.role);

        console.log('\nStep 2: Testing with debug server...');

        // Test with debug server
        const debugResponse = await axios.post('http://localhost:3002/debug-club-request', {
            name: 'Test Club',
            description: 'Test description'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Debug response:', debugResponse.data);

    } catch (error) {
        console.error('Debug test error:');
        console.error('Status:', error.response?.status);
        console.error('Response:', error.response?.data);
    }
}

debugTest();
