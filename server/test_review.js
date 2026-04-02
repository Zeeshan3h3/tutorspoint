import axios from 'axios';
import mongoose from 'mongoose';

async function testFetch() {
    try {
        console.log("Requesting Tutor ID: 69ccdf8facc745e26cb7b265");

        // Let's first log in as Admin
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@tutorspoint.com', // Assume there's a default admin
            password: 'password123'
        });

        const token = loginRes.data.token;
        console.log("Login Success");

        // Try hitting the review endpoint
        const res = await axios.get('http://localhost:5000/api/admin/tutors/69ccdf8facc745e26cb7b265/review', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Success! Data:", res.data);
    } catch (e) {
        console.log("Error status:", e.response?.status);
        console.log("Error data:", e.response?.data);
        console.log("Error message:", e.message);
    }
}

testFetch();
