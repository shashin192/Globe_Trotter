# GlobeTrotter API - Postman Collection Guide

Base URL: `http://localhost:5000`

## 🔐 Authentication Routes

### 1. Health Check
**GET** `http://localhost:5000/api/health`

**Headers:** None required

**Sample Output:**
```json
{
  "status": "OK",
  "message": "GlobeTrotter API is running"
}
```

---

### 2. Register User
**POST** `http://localhost:5000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Sample Input:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Sample Output:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "budgetRange": "mid-range",
      "travelStyle": []
    }
  }
}
```

---

### 3. Login User
**POST** `http://localhost:5000/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Sample Input:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Sample Output:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "budgetRange": "mid-range",
      "travelStyle": []
    },
    "lastLogin": "2024-01-03T10:30:00.000Z"
  }
}
```

---

### 4. Get Current User
**GET** `http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Output:**
```json
{
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "profilePhoto": "",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "budgetRange": "mid-range",
      "travelStyle": ["cultural", "food"]
    },
    "savedDestinations": [],
    "trips": [],
    "lastLogin": "2024-01-03T10:30:00.000Z"
  }
}
```

---

### 5. Forgot Password
**POST** `http://localhost:5000/api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Sample Input:**
```json
{
  "email": "john.doe@example.com"
}
```

**Sample Output:**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

## 👤 User Routes

### 6. Update User Profile
**PUT** `http://localhost:5000/api/users/profile`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "name": "John Smith",
  "profilePhoto": "https://example.com/photo.jpg"
}
```

**Sample Output:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "profilePhoto": "https://example.com/photo.jpg",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "budgetRange": "mid-range",
      "travelStyle": []
    }
  }
}
```

---

### 7. Update User Preferences
**PUT** `http://localhost:5000/api/users/preferences`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "language": "en",
  "currency": "EUR",
  "budgetRange": "luxury",
  "travelStyle": ["cultural", "food", "adventure"]
}
```

**Sample Output:**
```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "language": "en",
    "currency": "EUR",
    "budgetRange": "luxury",
    "travelStyle": ["cultural", "food", "adventure"]
  }
}
```

---

### 8. Add Saved Destination
**POST** `http://localhost:5000/api/users/saved-destinations`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "cityId": "65f1234567890abcdef67890"
}
```

**Sample Output:**
```json
{
  "message": "City added to saved destinations",
  "savedDestinations": [
    {
      "cityId": {
        "_id": "65f1234567890abcdef67890",
        "name": "Paris",
        "country": "France",
        "images": [...]
      },
      "savedAt": "2024-01-03T10:30:00.000Z"
    }
  ]
}
```

---

### 9. Remove Saved Destination
**DELETE** `http://localhost:5000/api/users/saved-destinations/65f1234567890abcdef67890`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Output:**
```json
{
  "message": "City removed from saved destinations",
  "savedDestinations": []
}
```

---

### 10. Get Saved Destinations
**GET** `http://localhost:5000/api/users/saved-destinations`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Output:**
```json
{
  "savedDestinations": [
    {
      "cityId": {
        "_id": "65f1234567890abcdef67890",
        "name": "Paris",
        "country": "France",
        "images": [...],
        "costIndex": 4,
        "popularityScore": 95,
        "tags": ["city", "cultural", "romantic"]
      },
      "savedAt": "2024-01-03T10:30:00.000Z"
    }
  ]
}
```

---

## ✈️ Trip Routes

### 11. Create Trip
**POST** `http://localhost:5000/api/trips`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "name": "European Adventure",
  "description": "A wonderful trip across Europe",
  "startDate": "2024-06-01",
  "endDate": "2024-06-15",
  "coverPhoto": "https://example.com/trip-photo.jpg",
  "privacy": "public",
  "travelers": {
    "adults": 2,
    "children": 0
  },
  "tags": ["couple", "cultural", "food"]
}
```

**Sample Output:**
```json
{
  "message": "Trip created successfully",
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "name": "European Adventure",
    "description": "A wonderful trip across Europe",
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "totalDays": 15,
    "status": "planning",
    "privacy": "public",
    "shareableLink": "65f1234567890abcdef11111-abc123",
    "stops": [],
    "budget": {
      "total": { "planned": 0, "actual": 0 },
      "currency": "USD",
      "breakdown": {
        "accommodation": { "planned": 0, "actual": 0 },
        "transportation": { "planned": 0, "actual": 0 },
        "activities": { "planned": 0, "actual": 0 },
        "food": { "planned": 0, "actual": 0 },
        "miscellaneous": { "planned": 0, "actual": 0 }
      }
    },
    "travelers": { "adults": 2, "children": 0 },
    "tags": ["couple", "cultural", "food"],
    "views": 0,
    "createdAt": "2024-01-03T10:30:00.000Z"
  }
}
```

---

### 12. Get User's Trips
**GET** `http://localhost:5000/api/trips`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters (optional):**
- `status`: planning, confirmed, ongoing, completed, cancelled
- `page`: 1 (default)
- `limit`: 10 (default)

**Sample URL:** `http://localhost:5000/api/trips?status=planning&page=1&limit=5`

**Sample Output:**
```json
{
  "trips": [
    {
      "_id": "65f1234567890abcdef11111",
      "name": "European Adventure",
      "description": "A wonderful trip across Europe",
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-06-15T00:00:00.000Z",
      "status": "planning",
      "privacy": "public",
      "stops": [],
      "createdAt": "2024-01-03T10:30:00.000Z"
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1
}
```

---

### 13. Get Trip by ID
**GET** `http://localhost:5000/api/trips/65f1234567890abcdef11111`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Output:**
```json
{
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "name": "European Adventure",
    "description": "A wonderful trip across Europe",
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "profilePhoto": ""
    },
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "totalDays": 15,
    "status": "planning",
    "privacy": "public",
    "stops": [
      {
        "_id": "65f1234567890abcdef22222",
        "city": {
          "_id": "65f1234567890abcdef67890",
          "name": "Paris",
          "country": "France",
          "images": [...],
          "coordinates": { "latitude": 48.8566, "longitude": 2.3522 },
          "costIndex": 4
        },
        "arrivalDate": "2024-06-01T00:00:00.000Z",
        "departureDate": "2024-06-05T00:00:00.000Z",
        "duration": 4,
        "order": 1,
        "activities": [],
        "notes": "First stop of the trip"
      }
    ],
    "budget": {...},
    "travelers": { "adults": 2, "children": 0 },
    "tags": ["couple", "cultural", "food"],
    "views": 5
  }
}
```

---

### 14. Update Trip
**PUT** `http://localhost:5000/api/trips/65f1234567890abcdef11111`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "name": "Amazing European Journey",
  "description": "Updated description for the trip",
  "status": "confirmed",
  "privacy": "private"
}
```

**Sample Output:**
```json
{
  "message": "Trip updated successfully",
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "name": "Amazing European Journey",
    "description": "Updated description for the trip",
    "status": "confirmed",
    "privacy": "private",
    // ... other trip fields
  }
}
```

---

### 15. Delete Trip
**DELETE** `http://localhost:5000/api/trips/65f1234567890abcdef11111`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Output:**
```json
{
  "message": "Trip deleted successfully"
}
```

---

### 16. Add Stop to Trip
**POST** `http://localhost:5000/api/trips/65f1234567890abcdef11111/stops`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "cityId": "65f1234567890abcdef67890",
  "arrivalDate": "2024-06-01",
  "departureDate": "2024-06-05",
  "accommodation": {
    "name": "Hotel Paris",
    "type": "hotel",
    "address": "123 Rue de la Paix, Paris",
    "cost": {
      "amount": 120,
      "currency": "EUR",
      "perNight": true
    },
    "checkIn": "2024-06-01T15:00:00.000Z",
    "checkOut": "2024-06-05T11:00:00.000Z"
  },
  "notes": "First stop - explore the city center"
}
```

**Sample Output:**
```json
{
  "message": "Stop added successfully",
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "name": "European Adventure",
    "stops": [
      {
        "_id": "65f1234567890abcdef22222",
        "city": {
          "_id": "65f1234567890abcdef67890",
          "name": "Paris",
          "country": "France",
          "images": [...],
          "coordinates": { "latitude": 48.8566, "longitude": 2.3522 }
        },
        "arrivalDate": "2024-06-01T00:00:00.000Z",
        "departureDate": "2024-06-05T00:00:00.000Z",
        "duration": 4,
        "order": 1,
        "accommodation": {
          "name": "Hotel Paris",
          "type": "hotel",
          "address": "123 Rue de la Paix, Paris",
          "cost": { "amount": 120, "currency": "EUR", "perNight": true }
        },
        "activities": [],
        "notes": "First stop - explore the city center"
      }
    ]
  }
}
```

---

### 17. Update Stop Activities
**PUT** `http://localhost:5000/api/trips/65f1234567890abcdef11111/stops/65f1234567890abcdef22222/activities`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Sample Input:**
```json
{
  "activities": [
    {
      "activity": "65f1234567890abcdef33333",
      "scheduledDate": "2024-06-02",
      "scheduledTime": "10:00",
      "duration": 180,
      "cost": {
        "amount": 25,
        "currency": "EUR"
      },
      "notes": "Morning visit to Eiffel Tower",
      "isSelected": true
    },
    {
      "activity": "65f1234567890abcdef44444",
      "scheduledDate": "2024-06-03",
      "scheduledTime": "14:00",
      "duration": 240,
      "cost": {
        "amount": 17,
        "currency": "EUR"
      },
      "notes": "Afternoon at Louvre",
      "isSelected": true
    }
  ]
}
```

**Sample Output:**
```json
{
  "message": "Activities updated successfully",
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "stops": [
      {
        "_id": "65f1234567890abcdef22222",
        "city": {...},
        "activities": [
          {
            "activity": {
              "_id": "65f1234567890abcdef33333",
              "name": "Eiffel Tower Visit",
              "description": "Visit the iconic Eiffel Tower...",
              "category": "sightseeing",
              "pricing": {...}
            },
            "scheduledDate": "2024-06-02T00:00:00.000Z",
            "scheduledTime": "10:00",
            "duration": 180,
            "cost": { "amount": 25, "currency": "EUR" },
            "isSelected": true,
            "addedToTotal": true
          }
        ]
      }
    ],
    "budget": {
      "total": { "planned": 42, "actual": 0 },
      "breakdown": {
        "activities": { "planned": 42, "actual": 0 }
      }
    }
  }
}
```

---

### 18. Get Public Trip
**GET** `http://localhost:5000/api/trips/public/65f1234567890abcdef11111-abc123`

**Headers:** None required

**Sample Output:**
```json
{
  "trip": {
    "_id": "65f1234567890abcdef11111",
    "name": "European Adventure",
    "user": {
      "_id": "65f1234567890abcdef12345",
      "name": "John Doe",
      "profilePhoto": ""
    },
    "startDate": "2024-06-01T00:00:00.000Z",
    "endDate": "2024-06-15T00:00:00.000Z",
    "stops": [...],
    "views": 6
  }
}
```

---

## 🏙️ City Routes

### 19. Get Cities
**GET** `http://localhost:5000/api/cities`

**Headers:** None required

**Query Parameters (optional):**
- `search`: text search
- `country`: filter by country
- `region`: filter by region
- `costIndex`: 1,2,3,4,5 (can be array)
- `tags`: filter by tags (can be array)
- `page`: 1 (default)
- `limit`: 20 (default)
- `sortBy`: popularityScore (default), name, costIndex
- `sortOrder`: desc (default), asc

**Sample URL:** `http://localhost:5000/api/cities?search=Paris&costIndex=4&limit=5`

**Sample Output:**
```json
{
  "cities": [
    {
      "_id": "65f1234567890abcdef67890",
      "name": "Paris",
      "country": "France",
      "region": "Europe",
      "coordinates": { "latitude": 48.8566, "longitude": 2.3522 },
      "description": "The City of Light, known for its art, fashion, gastronomy, and culture.",
      "images": [
        {
          "url": "https://images.unsplash.com/photo-1502602898536-47ad22581b52",
          "caption": "Eiffel Tower",
          "isPrimary": true
        }
      ],
      "costIndex": 4,
      "averageCosts": {
        "accommodation": { "budget": 50, "midRange": 120, "luxury": 300 },
        "food": { "budget": 25, "midRange": 50, "luxury": 100 },
        "transport": { "local": 15, "taxi": 25 }
      },
      "popularityScore": 95,
      "tags": ["city", "cultural", "romantic", "historical", "food"],
      "timezone": "Europe/Paris",
      "currency": "EUR",
      "language": ["French", "English"]
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1,
  "hasMore": false
}
```

---

### 20. Get City by ID
**GET** `http://localhost:5000/api/cities/65f1234567890abcdef67890`

**Headers:** None required

**Sample Output:**
```json
{
  "city": {
    "_id": "65f1234567890abcdef67890",
    "name": "Paris",
    "country": "France",
    "region": "Europe",
    "coordinates": { "latitude": 48.8566, "longitude": 2.3522 },
    "description": "The City of Light, known for its art, fashion, gastronomy, and culture.",
    "images": [...],
    "costIndex": 4,
    "averageCosts": {...},
    "popularityScore": 95,
    "bestTimeToVisit": [
      { "month": "Apr", "weather": "Mild", "crowdLevel": "medium" },
      { "month": "May", "weather": "Pleasant", "crowdLevel": "medium" }
    ],
    "tags": ["city", "cultural", "romantic", "historical", "food"],
    "timezone": "Europe/Paris",
    "currency": "EUR",
    "language": ["French", "English"],
    "activities": [
      {
        "_id": "65f1234567890abcdef33333",
        "name": "Eiffel Tower Visit",
        "description": "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris from the top.",
        "category": "sightseeing",
        "pricing": {
          "free": false,
          "cost": { "min": 25, "max": 35, "currency": "EUR" },
          "priceCategory": "mid-range"
        },
        "duration": { "min": 120, "max": 180 },
        "images": [...],
        "rating": { "average": 4.5, "count": 15420 },
        "tags": ["popular", "tourist-attraction", "instagram-worthy"]
      }
    ]
  }
}
```

---

### 21. Get City Search Suggestions
**GET** `http://localhost:5000/api/cities/search/suggestions`

**Headers:** None required

**Query Parameters:**
- `q`: search query (minimum 2 characters)

**Sample URL:** `http://localhost:5000/api/cities/search/suggestions?q=Par`

**Sample Output:**
```json
{
  "suggestions": [
    {
      "_id": "65f1234567890abcdef67890",
      "name": "Paris",
      "country": "France",
      "region": "Europe",
      "images": [...],
      "popularityScore": 95
    }
  ]
}
```

---

### 22. Get Popular Destinations
**GET** `http://localhost:5000/api/cities/popular/destinations`

**Headers:** None required

**Query Parameters (optional):**
- `limit`: 12 (default)

**Sample URL:** `http://localhost:5000/api/cities/popular/destinations?limit=5`

**Sample Output:**
```json
{
  "cities": [
    {
      "_id": "65f1234567890abcdef67890",
      "name": "Paris",
      "country": "France",
      "images": [...],
      "popularityScore": 95,
      "costIndex": 4,
      "tags": ["city", "cultural", "romantic"]
    },
    {
      "_id": "65f1234567890abcdef67891",
      "name": "Tokyo",
      "country": "Japan",
      "images": [...],
      "popularityScore": 90,
      "costIndex": 4,
      "tags": ["city", "cultural", "food"]
    }
  ]
}
```

---

### 23. Get Nearby Cities
**GET** `http://localhost:5000/api/cities/nearby/65f1234567890abcdef67890`

**Headers:** None required

**Query Parameters (optional):**
- `maxDistance`: 500 (km, default)
- `limit`: 10 (default)

**Sample URL:** `http://localhost:5000/api/cities/nearby/65f1234567890abcdef67890?maxDistance=300&limit=5`

**Sample Output:**
```json
{
  "nearbyCities": [
    {
      "_id": "65f1234567890abcdef67892",
      "name": "London",
      "country": "United Kingdom",
      "images": [...],
      "coordinates": { "latitude": 51.5074, "longitude": -0.1278 },
      "popularityScore": 89,
      "costIndex": 4
    }
  ]
}
```

---

### 24. Get Countries List
**GET** `http://localhost:5000/api/cities/countries/list`

**Headers:** None required

**Sample Output:**
```json
{
  "countries": [
    {
      "country": "France",
      "cityCount": 1,
      "avgCostIndex": 4,
      "popularCities": [
        {
          "name": "Paris",
          "popularityScore": 95
        }
      ]
    },
    {
      "country": "Japan",
      "cityCount": 1,
      "avgCostIndex": 4,
      "popularCities": [
        {
          "name": "Tokyo",
          "popularityScore": 90
        }
      ]
    }
  ]
}
```

---

## 🎯 Activity Routes

### 25. Get Activities
**GET** `http://localhost:5000/api/activities`

**Headers:** None required

**Query Parameters (optional):**
- `cityId`: filter by city (recommended)
- `search`: text search
- `category`: sightseeing, adventure, cultural, food, shopping, nightlife, nature, sports, relaxation
- `priceCategory`: free, budget, mid-range, expensive, luxury
- `tags`: filter by tags
- `duration`: "1-2" (hours range)
- `rating`: minimum rating (e.g., "4")
- `page`: 1 (default)
- `limit`: 20 (default)
- `sortBy`: rating.average (default), name, pricing.cost.min
- `sortOrder`: desc (default), asc

**Sample URL:** `http://localhost:5000/api/activities?cityId=65f1234567890abcdef67890&category=sightseeing&limit=5`

**Sample Output:**
```json
{
  "activities": [
    {
      "_id": "65f1234567890abcdef33333",
      "name": "Eiffel Tower Visit",
      "description": "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris from the top.",
      "city": {
        "_id": "65f1234567890abcdef67890",
        "name": "Paris",
        "country": "France"
      },
      "category": "sightseeing",
      "subcategory": "landmarks",
      "images": [...],
      "pricing": {
        "free": false,
        "cost": { "min": 25, "max": 35, "currency": "EUR" },
        "priceCategory": "mid-range"
      },
      "duration": { "min": 120, "max": 180 },
      "location": {
        "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
        "coordinates": { "latitude": 48.8584, "longitude": 2.2945 }
      },
      "rating": { "average": 4.5, "count": 15420 },
      "tags": ["popular", "tourist-attraction", "instagram-worthy"],
      "requirements": { "bookingRequired": true }
    }
  ],
  "totalPages": 1,
  "currentPage": 1,
  "total": 1,
  "hasMore": false
}
```

---

### 26. Get Activity by ID
**GET** `http://localhost:5000/api/activities/65f1234567890abcdef33333`

**Headers:** None required

**Sample Output:**
```json
{
  "activity": {
    "_id": "65f1234567890abcdef33333",
    "name": "Eiffel Tower Visit",
    "description": "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris from the top.",
    "city": {
      "_id": "65f1234567890abcdef67890",
      "name": "Paris",
      "country": "France",
      "coordinates": { "latitude": 48.8566, "longitude": 2.3522 },
      "timezone": "Europe/Paris",
      "currency": "EUR"
    },
    "category": "sightseeing",
    "subcategory": "landmarks",
    "images": [...],
    "pricing": {
      "free": false,
      "cost": { "min": 25, "max": 35, "currency": "EUR" },
      "priceCategory": "mid-range"
    },
    "duration": { "min": 120, "max": 180 },
    "location": {
      "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
      "coordinates": { "latitude": 48.8584, "longitude": 2.2945 }
    },
    "operatingHours": {
      "monday": { "open": "09:30", "close": "23:45", "closed": false },
      "tuesday": { "open": "09:30", "close": "23:45", "closed": false }
    },
    "rating": { "average": 4.5, "count": 15420 },
    "tags": ["popular", "tourist-attraction", "instagram-worthy"],
    "requirements": {
      "ageRestriction": { "min": 0, "max": 99 },
      "fitnessLevel": "easy",
      "bookingRequired": true,
      "groupSize": { "min": 1, "max": 50 }
    },
    "seasonality": {
      "bestMonths": ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      "weatherDependent": false
    }
  }
}
```

---

### 27. Get Recommended Activities for City
**GET** `http://localhost:5000/api/activities/city/65f1234567890abcdef67890/recommended`

**Headers:** None required

**Query Parameters (optional):**
- `limit`: 10 (default)
- `budgetRange`: budget, mid-range, luxury, mixed

**Sample URL:** `http://localhost:5000/api/activities/city/65f1234567890abcdef67890/recommended?budgetRange=mid-range&limit=5`

**Sample Output:**
```json
{
  "recommendedActivities": [
    {
      "_id": "65f1234567890abcdef33333",
      "name": "Eiffel Tower Visit",
      "description": "Visit the iconic Eiffel Tower...",
      "category": "sightseeing",
      "pricing": {
        "free": false,
        "cost": { "min": 25, "max": 35, "currency": "EUR" },
        "priceCategory": "mid-range"
      },
      "duration": { "min": 120, "max": 180 },
      "images": [...],
      "rating": { "average": 4.5, "count": 15420 },
      "tags": ["popular", "tourist-attraction"]
    }
  ],
  "groupedByCategory": {
    "sightseeing": [
      {
        "_id": "65f1234567890abcdef33333",
        "name": "Eiffel Tower Visit",
        // ... activity details
      }
    ],
    "cultural": [
      {
        "_id": "65f1234567890abcdef44444",
        "name": "Louvre Museum",
        // ... activity details
      }
    ]
  }
}
```

---

### 28. Get Activity Categories
**GET** `http://localhost:5000/api/activities/categories/list`

**Headers:** None required

**Query Parameters (optional):**
- `cityId`: filter by city

**Sample URL:** `http://localhost:5000/api/activities/categories/list?cityId=65f1234567890abcdef67890`

**Sample Output:**
```json
{
  "categories": [
    {
      "category": "sightseeing",
      "count": 2,
      "avgRating": 4.5,
      "availablePriceCategories": ["mid-range", "expensive"]
    },
    {
      "category": "cultural",
      "count": 1,
      "avgRating": 4.6,
      "availablePriceCategories": ["mid-range"]
    },
    {
      "category": "food",
      "count": 1,
      "avgRating": 4.3,
      "availablePriceCategories": ["budget"]
    }
  ]
}
```

---

### 29. Get Activity Search Suggestions
**GET** `http://localhost:5000/api/activities/search/suggestions`

**Headers:** None required

**Query Parameters:**
- `q`: search query (minimum 2 characters)
- `cityId`: filter by city (optional)

**Sample URL:** `http://localhost:5000/api/activities/search/suggestions?q=Eiffel&cityId=65f1234567890abcdef67890`

**Sample Output:**
```json
{
  "suggestions": [
    {
      "_id": "65f1234567890abcdef33333",
      "name": "Eiffel Tower Visit",
      "city": {
        "_id": "65f1234567890abcdef67890",
        "name": "Paris",
        "country": "France"
      },
      "category": "sightseeing",
      "pricing": { "priceCategory": "mid-range" },
      "rating": { "average": 4.5 },
      "images": [...]
    }
  ]
}
```

---

### 30. Get Bulk Activity Pricing
**POST** `http://localhost:5000/api/activities/bulk-pricing`

**Headers:**
```
Content-Type: application/json
```

**Sample Input:**
```json
{
  "activityIds": [
    "65f1234567890abcdef33333",
    "65f1234567890abcdef44444"
  ]
}
```

**Sample Output:**
```json
{
  "activities": [
    {
      "id": "65f1234567890abcdef33333",
      "name": "Eiffel Tower Visit",
      "category": "sightseeing",
      "pricing": {
        "free": false,
        "cost": { "min": 25, "max": 35, "currency": "EUR" },
        "priceCategory": "mid-range"
      },
      "duration": { "min": 120, "max": 180 },
      "estimatedCost": 30
    },
    {
      "id": "65f1234567890abcdef44444",
      "name": "Louvre Museum",
      "category": "cultural",
      "pricing": {
        "free": false,
        "cost": { "min": 17, "max": 17, "currency": "EUR" },
        "priceCategory": "mid-range"
      },
      "duration": { "min": 180, "max": 300 },
      "estimatedCost": 17
    }
  ],
  "totalEstimatedCost": 47,
  "currency": "EUR"
}
```

---

## 🔧 Testing Tips

1. **Start with Authentication**: Always register/login first to get a JWT token
2. **Use the token**: Add `Authorization: Bearer YOUR_TOKEN` to protected routes
3. **Seed the database**: Run `npm run seed` to populate with sample data
4. **Test in order**: Follow the logical flow (register → login → create trip → add stops → add activities)
5. **Check IDs**: Use actual MongoDB ObjectIds from your database responses

## 📝 Postman Environment Variables

Create these variables in Postman:
- `baseUrl`: `http://localhost:5000`
- `authToken`: (set this after login)
- `userId`: (set this after login)
- `tripId`: (set this after creating a trip)
- `cityId`: (use from cities response)

This will make testing much easier!