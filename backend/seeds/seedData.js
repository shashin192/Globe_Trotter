const mongoose = require('mongoose');
const City = require('../models/City');
const Activity = require('../models/Activity');
require('dotenv').config();

const cities = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    coordinates: { latitude: 48.8566, longitude: 2.3522 },
    description: 'The City of Light, known for its art, fashion, gastronomy, and culture.',
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52', caption: 'Eiffel Tower', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114', caption: 'Seine River' }
    ],
    costIndex: 4,
    averageCosts: {
      accommodation: { budget: 50, midRange: 120, luxury: 300 },
      food: { budget: 25, midRange: 50, luxury: 100 },
      transport: { local: 15, taxi: 25 }
    },
    popularityScore: 95,
    bestTimeToVisit: [
      { month: 'Apr', weather: 'Mild', crowdLevel: 'medium' },
      { month: 'May', weather: 'Pleasant', crowdLevel: 'medium' },
      { month: 'Sep', weather: 'Pleasant', crowdLevel: 'medium' },
      { month: 'Oct', weather: 'Cool', crowdLevel: 'low' }
    ],
    tags: ['city', 'cultural', 'romantic', 'historical', 'food'],
    timezone: 'Europe/Paris',
    currency: 'EUR',
    language: ['French', 'English']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    coordinates: { latitude: 35.6762, longitude: 139.6503 },
    description: 'A bustling metropolis blending traditional culture with cutting-edge technology.',
    images: [
      { url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', caption: 'Tokyo Skyline', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8', caption: 'Traditional Temple' }
    ],
    costIndex: 4,
    averageCosts: {
      accommodation: { budget: 40, midRange: 100, luxury: 250 },
      food: { budget: 20, midRange: 40, luxury: 80 },
      transport: { local: 10, taxi: 30 }
    },
    popularityScore: 90,
    bestTimeToVisit: [
      { month: 'Mar', weather: 'Cherry Blossoms', crowdLevel: 'high' },
      { month: 'Apr', weather: 'Pleasant', crowdLevel: 'high' },
      { month: 'Oct', weather: 'Cool', crowdLevel: 'medium' },
      { month: 'Nov', weather: 'Autumn Colors', crowdLevel: 'medium' }
    ],
    tags: ['city', 'cultural', 'food', 'shopping', 'nightlife'],
    timezone: 'Asia/Tokyo',
    currency: 'JPY',
    language: ['Japanese', 'English']
  },
  {
    name: 'New York',
    country: 'United States',
    region: 'North America',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    description: 'The Big Apple - a global hub for finance, arts, fashion, and culture.',
    images: [
      { url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', caption: 'Manhattan Skyline', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25', caption: 'Central Park' }
    ],
    costIndex: 5,
    averageCosts: {
      accommodation: { budget: 80, midRange: 200, luxury: 500 },
      food: { budget: 30, midRange: 60, luxury: 120 },
      transport: { local: 12, taxi: 35 }
    },
    popularityScore: 92,
    bestTimeToVisit: [
      { month: 'Apr', weather: 'Spring', crowdLevel: 'medium' },
      { month: 'May', weather: 'Pleasant', crowdLevel: 'medium' },
      { month: 'Sep', weather: 'Fall', crowdLevel: 'medium' },
      { month: 'Oct', weather: 'Cool', crowdLevel: 'medium' }
    ],
    tags: ['city', 'cultural', 'shopping', 'nightlife', 'food'],
    timezone: 'America/New_York',
    currency: 'USD',
    language: ['English']
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    coordinates: { latitude: -8.3405, longitude: 115.0920 },
    description: 'Tropical paradise known for beautiful beaches, temples, and vibrant culture.',
    images: [
      { url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1', caption: 'Rice Terraces', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2', caption: 'Beach Sunset' }
    ],
    costIndex: 2,
    averageCosts: {
      accommodation: { budget: 15, midRange: 40, luxury: 120 },
      food: { budget: 8, midRange: 15, luxury: 35 },
      transport: { local: 3, taxi: 8 }
    },
    popularityScore: 88,
    bestTimeToVisit: [
      { month: 'Apr', weather: 'Dry Season', crowdLevel: 'medium' },
      { month: 'May', weather: 'Dry Season', crowdLevel: 'medium' },
      { month: 'Jun', weather: 'Dry Season', crowdLevel: 'high' },
      { month: 'Jul', weather: 'Dry Season', crowdLevel: 'high' }
    ],
    tags: ['beach', 'cultural', 'nature', 'relaxation', 'adventure'],
    timezone: 'Asia/Makassar',
    currency: 'IDR',
    language: ['Indonesian', 'English']
  },
  {
    name: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    description: 'Historic capital with royal palaces, world-class museums, and vibrant culture.',
    images: [
      { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad', caption: 'Big Ben', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1520986606214-8b456906c813', caption: 'Tower Bridge' }
    ],
    costIndex: 4,
    averageCosts: {
      accommodation: { budget: 60, midRange: 150, luxury: 350 },
      food: { budget: 20, midRange: 45, luxury: 90 },
      transport: { local: 18, taxi: 30 }
    },
    popularityScore: 89,
    bestTimeToVisit: [
      { month: 'May', weather: 'Spring', crowdLevel: 'medium' },
      { month: 'Jun', weather: 'Summer', crowdLevel: 'high' },
      { month: 'Jul', weather: 'Summer', crowdLevel: 'high' },
      { month: 'Sep', weather: 'Autumn', crowdLevel: 'medium' }
    ],
    tags: ['city', 'historical', 'cultural', 'shopping', 'nightlife'],
    timezone: 'Europe/London',
    currency: 'GBP',
    language: ['English']
  }
];

const activities = [
  // Paris Activities
  {
    name: 'Eiffel Tower Visit',
    description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris from the top.',
    category: 'sightseeing',
    subcategory: 'landmarks',
    images: [
      { url: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52', caption: 'Eiffel Tower', isPrimary: true }
    ],
    pricing: {
      free: false,
      cost: { min: 25, max: 35, currency: 'EUR' },
      priceCategory: 'mid-range'
    },
    duration: { min: 120, max: 180 },
    location: {
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
      coordinates: { latitude: 48.8584, longitude: 2.2945 }
    },
    rating: { average: 4.5, count: 15420 },
    tags: ['popular', 'tourist-attraction', 'instagram-worthy'],
    requirements: { bookingRequired: true }
  },
  {
    name: 'Louvre Museum',
    description: 'Explore the world\'s largest art museum and see the Mona Lisa.',
    category: 'cultural',
    subcategory: 'museums',
    images: [
      { url: 'https://images.unsplash.com/photo-1566139884669-4b9356b4c040', caption: 'Louvre Pyramid', isPrimary: true }
    ],
    pricing: {
      free: false,
      cost: { min: 17, max: 17, currency: 'EUR' },
      priceCategory: 'mid-range'
    },
    duration: { min: 180, max: 300 },
    location: {
      address: 'Rue de Rivoli, 75001 Paris',
      coordinates: { latitude: 48.8606, longitude: 2.3376 }
    },
    rating: { average: 4.6, count: 8930 },
    tags: ['popular', 'cultural', 'tourist-attraction'],
    requirements: { bookingRequired: true }
  },
  // Tokyo Activities
  {
    name: 'Senso-ji Temple',
    description: 'Visit Tokyo\'s oldest temple in the historic Asakusa district.',
    category: 'cultural',
    subcategory: 'temples',
    images: [
      { url: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8', caption: 'Senso-ji Temple', isPrimary: true }
    ],
    pricing: {
      free: true,
      cost: { min: 0, max: 0, currency: 'JPY' },
      priceCategory: 'free'
    },
    duration: { min: 60, max: 120 },
    location: {
      address: '2-3-1 Asakusa, Taito City, Tokyo',
      coordinates: { latitude: 35.7148, longitude: 139.7967 }
    },
    rating: { average: 4.4, count: 12500 },
    tags: ['cultural', 'historical', 'free'],
    requirements: { bookingRequired: false }
  },
  {
    name: 'Tsukiji Fish Market',
    description: 'Experience the famous fish market and enjoy fresh sushi breakfast.',
    category: 'food',
    subcategory: 'markets',
    images: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96', caption: 'Fish Market', isPrimary: true }
    ],
    pricing: {
      free: false,
      cost: { min: 2000, max: 5000, currency: 'JPY' },
      priceCategory: 'budget'
    },
    duration: { min: 120, max: 180 },
    location: {
      address: '5-2-1 Tsukiji, Chuo City, Tokyo',
      coordinates: { latitude: 35.6654, longitude: 139.7707 }
    },
    rating: { average: 4.3, count: 6780 },
    tags: ['food', 'local-favorite', 'early-morning'],
    requirements: { bookingRequired: false }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await City.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing data');

    // Insert cities
    const insertedCities = await City.insertMany(cities);
    console.log(`Inserted ${insertedCities.length} cities`);

    // Map city names to IDs for activities
    const cityMap = {};
    insertedCities.forEach(city => {
      cityMap[city.name] = city._id;
    });

    // Add city references to activities
    const activitiesWithCityRefs = activities.map(activity => {
      let cityName;
      if (activity.name.includes('Eiffel') || activity.name.includes('Louvre')) {
        cityName = 'Paris';
      } else if (activity.name.includes('Senso-ji') || activity.name.includes('Tsukiji')) {
        cityName = 'Tokyo';
      }
      
      return {
        ...activity,
        city: cityMap[cityName]
      };
    });

    // Insert activities
    const insertedActivities = await Activity.insertMany(activitiesWithCityRefs);
    console.log(`Inserted ${insertedActivities.length} activities`);

    // Update cities with activity references
    for (const activity of insertedActivities) {
      await City.findByIdAndUpdate(
        activity.city,
        { $push: { activities: activity._id } }
      );
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };