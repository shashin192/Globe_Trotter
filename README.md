# WanderWise - Complete Travel Planning Application 🌍✈️

A comprehensive full-stack travel planning application that combines a modern React frontend with a robust Node.js backend, featuring interactive maps, travel statistics, and seamless trip management.

## 🚀 Project Structure

```
Globe_Trotter/
├── backend/                    # Node.js/Express backend with MySQL
│   ├── backend/               # Core backend application
│   │   ├── config/           # Database and app configuration
│   │   ├── models/           # MySQL data models
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Authentication & validation
│   │   └── seeds/            # Database seeding scripts
│   ├── mysql_schema.sql      # Complete MySQL database schema
│   └── MYSQL_SETUP.md        # Database setup instructions
│
└── frontend/                  # React/TypeScript frontend
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/           # Application pages
    │   ├── hooks/           # Custom React hooks
    │   ├── services/        # API integration layer
    │   └── utils/           # Utility functions
    ├── supabase/            # Database migrations
    └── public/              # Static assets
```

## ✨ Key Features

### 🎨 **Travel Wrap** - Spotify-Style Year Review
- 8 beautifully animated cards showing travel statistics
- Framer Motion animations with smooth transitions
- Shareable travel achievements and milestones
- Mobile-responsive design with touch interactions

### 🗺️ **Interactive Maps**
- Migrated from Mapbox to Leaflet (no API key required)
- OpenStreetMap integration with custom markers
- Route visualization and destination exploration
- Responsive map controls and zoom functionality

### 💰 **Multi-Currency Support**
- Automatic currency detection (₹ for India, $ for others)
- 10+ Indian destinations with realistic rupee pricing
- Dynamic pricing display across all components
- Budget tracking and expense management

### 📱 **Activity Management**
- Dual-mode activity popup (explore/trip-edit)
- Category-based activity organization
- Bulk selection and trip integration
- Detailed activity information with ratings

### 🔐 **User Authentication**
- Supabase integration for secure authentication
- User profile management and preferences
- Protected routes and session handling
- Social login capabilities

### 🌍 **Trip Planning**
- Comprehensive itinerary builder
- Multi-destination trip support
- Collaborative trip planning
- Trip sharing and public galleries

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **Framer Motion** for animations
- **Leaflet** for interactive maps
- **Supabase** for backend services

### Backend
- **Node.js** with Express framework
- **MySQL** database with comprehensive schema
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** for cross-origin requests
- **Helmet** for security headers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MySQL 8.0+
- Git

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend/backend
npm install
# Configure MySQL database (see MYSQL_SETUP.md)
npm start
```

### Database Setup
1. Create MySQL database: `wanderwise`
2. Run schema: `mysql -u root -p wanderwise < ../mysql_schema.sql`
3. Configure environment variables in `.env`

## 📚 Documentation

- **[MAP_MIGRATION.md](frontend/MAP_MIGRATION.md)** - Mapbox to Leaflet migration guide
- **[TRAVEL_WRAP_FEATURE.md](frontend/TRAVEL_WRAP_FEATURE.md)** - Complete Travel Wrap documentation
- **[ACTIVITY_POPUP_FEATURE.md](frontend/ACTIVITY_POPUP_FEATURE.md)** - Activity component usage
- **[INDIAN_DESTINATIONS_SETUP.md](frontend/INDIAN_DESTINATIONS_SETUP.md)** - Destination data setup
- **[MYSQL_SETUP.md](MYSQL_SETUP.md)** - Database configuration guide

## 🌟 Highlights

### Travel Wrap Feature
- **8 Animated Cards**: Welcome, Adventures, Favorite Destination, Budget, Activities, Countries, Personality, Share
- **Beautiful Animations**: Smooth transitions, floating effects, gradient backgrounds
- **Interactive Elements**: Navigation controls, progress indicators, share functionality
- **Mobile Optimized**: Touch-friendly interactions and responsive design

### Map System
- **No API Keys Required**: Uses free OpenStreetMap tiles
- **Lightweight**: Smaller bundle size compared to Mapbox
- **Feature Complete**: Markers, popups, routes, and custom controls
- **Responsive**: Works seamlessly across all device sizes

### Indian Destinations
- **10 Major Cities**: Mumbai, Delhi, Goa, Jaipur, Kerala, Agra, Varanasi, Udaipur, Rishikesh, Hampi
- **60+ Activities**: Authentic local experiences with realistic pricing
- **Cultural Accuracy**: Proper currency symbols and local context
- **Rich Content**: Detailed descriptions and high-quality images

## 🔧 Configuration

### Environment Variables
```env
# Frontend (.env)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_URL=http://localhost:5000/api

# Backend (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=wanderwise
JWT_SECRET=your_jwt_secret
PORT=5000
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend/backend
# Configure production environment variables
# Deploy with your preferred platform
```

### Database (PlanetScale/AWS RDS)
- Import `mysql_schema.sql`
- Configure connection strings
- Run seeding scripts if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenStreetMap** for free map tiles
- **Unsplash** for beautiful travel photography
- **shadcn/ui** for excellent component library
- **Supabase** for backend-as-a-service
- **Framer Motion** for smooth animations

## 📞 Support

For support, email support@wanderwise.com or join our Discord community.

---

**Built with ❤️ for travelers around the world** 🌍✈️🎒