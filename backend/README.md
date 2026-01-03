# GlobeTrotter - Travel Planning Backend API

A comprehensive travel planning application backend built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and profile management
- **Trip Management**: Create, update, and manage multi-city travel itineraries
- **City & Activity Discovery**: Search and explore cities and activities worldwide
- **Budget Tracking**: Automatic cost calculation and budget breakdown
- **Collaborative Planning**: Share trips and collaborate with others
- **Personalized Recommendations**: Activity suggestions based on user preferences

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Project Structure

```
├── models/
│   ├── User.js          # User schema with preferences and saved destinations
│   ├── Trip.js          # Trip schema with stops, activities, and budget
│   ├── City.js          # City schema with location and cost data
│   └── Activity.js      # Activity schema with pricing and details
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── users.js         # User profile and preferences
│   ├── trips.js         # Trip CRUD operations
│   ├── cities.js        # City search and discovery
│   └── activities.js    # Activity search and recommendations
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── seeds/
│   └── seedData.js      # Sample data for development
├── server.js            # Main application entry point
└── package.json         # Dependencies and scripts
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- MongoDB Compass (recommended for database management)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/globetrotter
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. If using MongoDB Compass, connect to `mongodb://localhost:27017`.

### 4. Seed the Database

Populate the database with sample cities and activities:

```bash
node seeds/seedData.js
```

### 5. Start the Server

For development with auto-restart:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/forgot-password` - Request password reset

### Users
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/preferences` - Update user preferences
- `POST /api/users/saved-destinations` - Save a destination
- `DELETE /api/users/saved-destinations/:cityId` - Remove saved destination
- `GET /api/users/saved-destinations` - Get saved destinations

### Trips
- `POST /api/trips` - Create new trip
- `GET /api/trips` - Get user's trips
- `GET /api/trips/:id` - Get trip by ID
- `PUT /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip
- `POST /api/trips/:id/stops` - Add stop to trip
- `PUT /api/trips/:id/stops/:stopId/activities` - Update stop activities
- `GET /api/trips/public/:shareableLink` - Get public trip

### Cities
- `GET /api/cities` - Search cities with filters
- `GET /api/cities/:id` - Get city details with activities
- `GET /api/cities/search/suggestions` - Get search suggestions
- `GET /api/cities/popular/destinations` - Get popular destinations
- `GET /api/cities/nearby/:id` - Get nearby cities
- `GET /api/cities/countries/list` - Get countries list

### Activities
- `GET /api/activities` - Search activities with filters
- `GET /api/activities/:id` - Get activity details
- `GET /api/activities/city/:cityId/recommended` - Get recommended activities
- `GET /api/activities/categories/list` - Get activity categories
- `GET /api/activities/search/suggestions` - Get activity suggestions
- `POST /api/activities/bulk-pricing` - Get pricing for multiple activities

## Key Features Explained

### User Schema
- Complete user profiles with preferences (language, currency, budget range, travel style)
- Saved destinations for quick access
- Trip history and collaboration tracking

### Trip Schema
- Multi-city itineraries with flexible stop management
- Automatic budget calculation with breakdown by category
- Activity selection with checkbox functionality for cost calculation
- Privacy settings (private, public, friends)
- Shareable links for public trips

### Activity Selection & Pricing
When users select activities for their trip stops:
1. Activities are displayed with checkboxes
2. Checking an activity adds its cost to the trip total
3. Budget breakdown is automatically updated
4. Users can see real-time cost changes

### Search & Discovery
- Full-text search across cities and activities
- Filtering by cost, category, tags, and ratings
- Personalized recommendations based on user preferences
- Geolocation-based nearby suggestions

## Database Schema Highlights

### User Model
- Authentication with bcrypt password hashing
- Comprehensive preferences system
- Saved destinations with timestamps
- Trip references for quick access

### Trip Model
- Flexible stop system with arrival/departure dates
- Activity selection with cost tracking
- Budget breakdown by category (accommodation, transport, activities, food)
- Collaboration and sharing features

### City Model
- Geographic coordinates for mapping
- Cost index and average prices by category
- Popularity scoring for recommendations
- Best time to visit information

### Activity Model
- Detailed pricing with min/max ranges
- Duration estimates and operating hours
- Rating system and user reviews
- Seasonal availability and requirements

## Development Notes

- All passwords are hashed using bcrypt with salt rounds of 12
- JWT tokens expire after 7 days
- Rate limiting: 100 requests per 15 minutes per IP
- Input validation on all endpoints
- Comprehensive error handling and logging
- MongoDB indexes for optimal search performance

## Testing the API

Use tools like Postman or curl to test the endpoints. Start with:

1. Register a user: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Create a trip: `POST /api/trips`
4. Search cities: `GET /api/cities`
5. Add activities to trip stops

## Next Steps

This backend is ready for frontend integration. Consider building:
- React/Vue.js frontend application
- Mobile app using React Native or Flutter
- Admin dashboard for content management
- Email service integration for notifications
- Payment processing for bookings
- Real-time collaboration features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.