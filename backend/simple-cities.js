const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const createCities = async () => {
  try {
    // Use the cities collection directly
    const db = mongoose.connection.db;
    const cities = db.collection('cities');
    
    // Clear existing
    await cities.deleteMany({});
    
    // Insert simple cities
    const result = await cities.insertMany([
      {
        name: 'Paris',
        country: 'France',
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
        description: 'The City of Light',
        costIndex: 4,
        popularityScore: 95,
        timezone: 'Europe/Paris',
        currency: 'EUR',
        tags: ['city', 'cultural'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        coordinates: { latitude: 35.6762, longitude: 139.6503 },
        description: 'Modern metropolis',
        costIndex: 4,
        popularityScore: 90,
        timezone: 'Asia/Tokyo',
        currency: 'JPY',
        tags: ['city', 'cultural'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'London',
        country: 'United Kingdom',
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
        description: 'Historic capital',
        costIndex: 4,
        popularityScore: 89,
        timezone: 'Europe/London',
        currency: 'GBP',
        tags: ['city', 'historical'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Cities created successfully!');
    console.log('\n🎯 City IDs for testing:');
    result.insertedIds.forEach((id, index) => {
      const cityNames = ['Paris', 'Tokyo', 'London'];
      console.log(`${cityNames[index]}: ${id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createCities();