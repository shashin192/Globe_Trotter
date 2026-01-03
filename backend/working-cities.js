const mongoose = require('mongoose');
require('dotenv').config();

// Connect and wait for connection
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB');
};

const createCities = async () => {
  try {
    await connectDB();
    
    // Use direct collection access to avoid schema conflicts
    const db = mongoose.connection.db;
    const citiesCollection = db.collection('cities');
    
    // Clear existing
    await citiesCollection.deleteMany({});
    console.log('Cleared existing cities');
    
    // Create cities with simple coordinate format
    const cities = [
      {
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        coordinates: {
          latitude: 48.8566,
          longitude: 2.3522
        },
        description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
        costIndex: 4,
        popularityScore: 95,
        timezone: 'Europe/Paris',
        currency: 'EUR',
        tags: ['city', 'cultural', 'romantic'],
        averageCosts: {
          accommodation: { budget: 50, midRange: 120, luxury: 300 },
          food: { budget: 25, midRange: 50, luxury: 100 },
          transport: { local: 15, taxi: 25 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        coordinates: {
          latitude: 35.6762,
          longitude: 139.6503
        },
        description: 'A bustling metropolis blending traditional culture with cutting-edge technology.',
        costIndex: 4,
        popularityScore: 90,
        timezone: 'Asia/Tokyo',
        currency: 'JPY',
        tags: ['city', 'cultural', 'food'],
        averageCosts: {
          accommodation: { budget: 40, midRange: 100, luxury: 250 },
          food: { budget: 20, midRange: 40, luxury: 80 },
          transport: { local: 10, taxi: 30 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'London',
        country: 'United Kingdom',
        region: 'Europe',
        coordinates: {
          latitude: 51.5074,
          longitude: -0.1278
        },
        description: 'Historic capital with royal palaces, world-class museums, and vibrant culture.',
        costIndex: 4,
        popularityScore: 89,
        timezone: 'Europe/London',
        currency: 'GBP',
        tags: ['city', 'historical', 'cultural'],
        averageCosts: {
          accommodation: { budget: 60, midRange: 150, luxury: 350 },
          food: { budget: 20, midRange: 45, luxury: 90 },
          transport: { local: 18, taxi: 30 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'New York',
        country: 'United States',
        region: 'North America',
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        description: 'The Big Apple - a global hub for finance, arts, fashion, and culture.',
        costIndex: 5,
        popularityScore: 92,
        timezone: 'America/New_York',
        currency: 'USD',
        tags: ['city', 'cultural', 'shopping'],
        averageCosts: {
          accommodation: { budget: 80, midRange: 200, luxury: 500 },
          food: { budget: 30, midRange: 60, luxury: 120 },
          transport: { local: 12, taxi: 35 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Insert one by one to avoid bulk errors
    const insertedCities = [];
    for (const city of cities) {
      try {
        const result = await citiesCollection.insertOne(city);
        insertedCities.push({ name: city.name, _id: result.insertedId });
        console.log(`✅ Created ${city.name}: ${result.insertedId}`);
      } catch (error) {
        console.log(`❌ Failed to create ${city.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully created ${insertedCities.length} cities!`);
    console.log('\n🎯 City IDs for testing:');
    insertedCities.forEach(city => {
      console.log(`${city.name}: ${city._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createCities();