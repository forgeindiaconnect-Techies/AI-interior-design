const axios = require('axios');

async function testVendorLogin() {
  try {
    console.log('Logging in...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'vendor@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;

    const api = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { Authorization: `Bearer ${token}` }
    });

    const endpoints = [
      '/auth/me',
      '/vendor/profile',
      '/vendor/verification',
      '/vendor/store-setup',
      '/vendor/requests',
      '/vendor/orders',
      '/products?vendorId=null',
      '/notifications',
      '/vendor/reviews',
      '/chat/sync'
    ];

    await Promise.all(endpoints.map(async ep => {
      try {
        await api.get(ep);
        console.log(`${ep} SUCCESS`);
      } catch (e) {
        console.log(`${ep} ERROR:`, e.response?.status, e.response?.data);
      }
    }));
  } catch (error) {
    console.error('Login failed:', error.response?.status, error.response?.data);
  }
}

testVendorLogin();
