const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function quickTest() {
  console.log('🚀 Quick API Test Starting...\n');

  try {
    // 1. Health Check
    console.log('1. Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health:', health.data.message);

    // 2. Get Cities
    console.log('\n2. Testing Get Cities...');
    const cities = await axios.get(`${BASE_URL}/cities`);
    console.log(`✅ Cities: Found ${cities.data.cities.length} cities`);
    
    if (cities.data.cities.length > 0) {
      const cityId = cities.data.cities[0]._id;
      console.log(`   First city: ${cities.data.cities[0].name} (${cityId})`);
      
      // 3. Get City by ID
      console.log('\n3. Testing Get City by ID...');
      const city = await axios.get(`${BASE_URL}/cities/${cityId}`);
      console.log(`✅ City Details: ${city.data.city.name}, ${city.data.city.country}`);
    }

    // 4. Register User
    console.log('\n4. Testing User Registration...');
    const userData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    };
    
    const register = await axios.post(`${BASE_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`✅ User Registered: ${register.data.user.name}`);
    
    const token = register.data.token;
    const userId = register.data.user.id;

    // 5. Get Current User
    console.log('\n5. Testing Get Current User...');
    const currentUser = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ Current User: ${currentUser.data.user.name}`);

    // 6. Create Trip
    console.log('\n6. Testing Create Trip...');
    const tripData = {
      name: 'Test Trip',
      description: 'A test trip',
      startDate: '2024-06-01',
      endDate: '2024-06-15'
    };
    
    const trip = await axios.post(`${BASE_URL}/trips`, tripData, {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(`✅ Trip Created: ${trip.data.trip.name} (${trip.data.trip._id})`);
    
    const tripId = trip.data.trip._id;

    // 7. Get User's Trips
    console.log('\n7. Testing Get User Trips...');
    const userTrips = await axios.get(`${BASE_URL}/trips`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ User Trips: Found ${userTrips.data.trips.length} trips`);

    // 8. Add Stop to Trip (if we have cities)
    if (cities.data.cities.length > 0) {
      console.log('\n8. Testing Add Stop to Trip...');
      const cityId = cities.data.cities[0]._id;
      const stopData = {
        cityId: cityId,
        arrivalDate: '2024-06-01',
        departureDate: '2024-06-05',
        notes: 'Test stop'
      };
      
      const addStop = await axios.post(`${BASE_URL}/trips/${tripId}/stops`, stopData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`✅ Stop Added: ${addStop.data.message}`);
    }

    // 9. Get Activities
    console.log('\n9. Testing Get Activities...');
    const activities = await axios.get(`${BASE_URL}/activities`);
    console.log(`✅ Activities: Found ${activities.data.activities.length} activities`);

    // 10. Popular Destinations
    console.log('\n10. Testing Popular Destinations...');
    const popular = await axios.get(`${BASE_URL}/cities/popular/destinations`);
    console.log(`✅ Popular Destinations: Found ${popular.data.cities.length} destinations`);

    console.log('\n🎉 All tests passed! API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

quickTest();