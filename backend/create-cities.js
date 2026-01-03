const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Simple city schema without strict validation
const citySchema = new mongoose.Schema({
  name: String,
  country: String,
  region: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  description: String,
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  costIndex: Number,
  averageCosts: {
    accommodation: {
      budget: Number,
      midRange: Number,
      luxury: Number
    },
    food: {
      budget: Number,
      midRange: Number,
      luxury: Number
    },
    transport: {
      local: Number,
      taxi: Number
    }
  },
  popularityScore: Number,
  tags: [String], // No enum validation
  timezone: String,
  currency: String
}, { timestamps: true });

const SimpleCity = mongoose.model('SimpleCity', citySchema, 'cities');

const createCities = async () => {
  try {
    console.log('Connected to MongoDB');

    // Clear existing cities
    await SimpleCity.deleteMany({});
    console.log('Cleared existing cities');

    // Create simple cities
    const cities = [
      {
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
        description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
        costIndex: 4,
        popularityScore: 95,
        tags: ['city', 'cultural', 'romantic'],
        timezone: 'Europe/Paris',
        currency: 'EUR'
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        coordinates: { latitude: 35.6762, longitude: 139.6503 },
        description: 'A bustling metropolis blending traditional culture with cutting-edge technology.',
        costIndex: 4,
        popularityScore: 90,
        tags: ['city', 'cultural', 'food'],
        timezone: 'Asia/Tokyo',
        currency: 'JPY'
      },
      {
        name: 'New York',
        country: 'United States',
        region: 'North America',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        description: 'The Big Apple - a global hub for finance, arts, fashion, and culture.',
        costIndex: 5,
        popularityScore: 92,
        tags: ['city', 'cultural', 'shopping'],
        timezone: 'America/New_York',
        currency: 'USD'
      },
      {
        name: 'London',
        country: 'United Kingdom',
        region: 'Europe',
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
        description: 'Historic capital with royal palaces, world-class museums, and vibrant culture.',
        costIndex: 4,
        popularityScore: 89,
        tags: ['city', 'historical', 'cultural'],
        timezone: 'Europe/London',
        currency: 'GBP'
      },
      {
        name: 'Bali',
        country: 'Indonesia',
        region: 'Southeast Asia',
        coordinates: { latitude: -8.3405, longitude: 115.0920 },
        description: 'Tropical paradise known for beautiful beaches, temples, and vibrant culture.',
        costIndex: 2,
        popularityScore: 88,
        tags: ['beach', 'cultural', 'nature'],
        timezone: 'Asia/Makassar',
        currency: 'IDR'
      }
    ];

    const insertedCities = await SimpleCity.insertMany(cities);
    console.log(`✅ Successfully inserted ${insertedCities.length} cities`);

    console.log('\n🎯 City IDs for testing:');
    insertedCities.forEach(city => {
      console.log(`${city.name}: ${city._id}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating cities:', error);
    process.exit(1);
  }
};

createCities();