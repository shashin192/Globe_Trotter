const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123'
};

const testTrip = {
  name: 'European Adventure',
  description: 'A wonderful trip across Europe',
  startDate: '2024-06-01',
  endDate: '2024-06-15',
  privacy: 'public'
};

let authToken = '';
let userId = '';
let tripId = '';

async function testAPI() {
  try {
    console.log('🚀 Starting GlobeTrotter API Tests...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id;
    console.log('✅ User Registered:', registerResponse.data.user.name);

    // Test 3: User Login
    console.log('\n3. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User Logged In:', loginResponse.data.user.name);

    // Test 4: Get Current User
    console.log('\n4. Testing Get Current User...');
    const userResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Current User:', userResponse.data.user.name);

    // Test 5: Get Cities
    console.log('\n5. Testing Get Cities...');
    const citiesResponse = await axios.get(`${BASE_URL}/cities?limit=3`);
    console.log('✅ Cities Retrieved:', citiesResponse.data.cities.length, 'cities');
    citiesResponse.data.cities.forEach(city => {
      console.log(`   - ${city.name}, ${city.country}`);
    });

    // Test 6: Search Cities
    console.log('\n6. Testing City Search...');
    const searchResponse = await axios.get(`${BASE_URL}/cities?search=Paris`);
    console.log('✅ City Search Results:', searchResponse.data.cities.length);

    // Test 7: Get Activities
    console.log('\n7. Testing Get Activities...');
    const activitiesResponse = await axios.get(`${BASE_URL}/activities?limit=3`);
    console.log('✅ Activities Retrieved:', activitiesResponse.data.activities.length, 'activities');

    // Test 8: Create Trip
    console.log('\n8. Testing Create Trip...');
    const tripResponse = await axios.post(`${BASE_URL}/trips`, testTrip, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    tripId = tripResponse.data.trip._id;
    console.log('✅ Trip Created:', tripResponse.data.trip.name);

    // Test 9: Get User's Trips
    console.log('\n9. Testing Get User Trips...');
    const userTripsResponse = await axios.get(`${BASE_URL}/trips`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User Trips:', userTripsResponse.data.trips.length, 'trips');

    // Test 10: Add Stop to Trip
    if (citiesResponse.data.cities.length > 0) {
      console.log('\n10. Testing Add Stop to Trip...');
      const cityId = citiesResponse.data.cities[0]._id;
      const stopData = {
        cityId: cityId,
        arrivalDate: '2024-06-01',
        departureDate: '2024-06-05',
        notes: 'First stop of the trip'
      };
      
      const addStopResponse = await axios.post(`${BASE_URL}/trips/${tripId}/stops`, stopData, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('✅ Stop Added to Trip:', addStopResponse.data.message);
    }

    // Test 11: Get Trip Details
    console.log('\n11. Testing Get Trip Details...');
    const tripDetailsResponse = await axios.get(`${BASE_URL}/trips/${tripId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Trip Details Retrieved:', tripDetailsResponse.data.trip.name);
    console.log('   Stops:', tripDetailsResponse.data.trip.stops.length);

    // Test 12: Update User Preferences
    console.log('\n12. Testing Update User Preferences...');
    const preferencesData = {
      language: 'en',
      currency: 'USD',
      budgetRange: 'mid-range',
      travelStyle: ['cultural', 'food', 'adventure']
    };
    
    const preferencesResponse = await axios.put(`${BASE_URL}/users/preferences`, preferencesData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Preferences Updated:', preferencesResponse.data.message);

    // Test 13: Get Popular Destinations
    console.log('\n13. Testing Get Popular Destinations...');
    const popularResponse = await axios.get(`${BASE_URL}/cities/popular/destinations?limit=5`);
    console.log('✅ Popular Destinations:', popularResponse.data.cities.length);

    // Test 14: Get Activity Categories
    console.log('\n14. Testing Get Activity Categories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/activities/categories/list`);
    console.log('✅ Activity Categories:', categoriesResponse.data.categories.length);

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('- User Registration & Authentication: ✅');
    console.log('- City Search & Discovery: ✅');
    console.log('- Activity Management: ✅');
    console.log('- Trip Creation & Management: ✅');
    console.log('- User Preferences: ✅');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation Errors:', error.response.data.errors);
    }
  }
}

// Run tests only if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };