const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Activity name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sightseeing', 'adventure', 'cultural', 'food', 'shopping', 'nightlife', 'nature', 'sports', 'relaxation', 'transportation', 'accommodation']
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  pricing: {
    free: {
      type: Boolean,
      default: false
    },
    cost: {
      min: {
        type: Number,
        default: 0,
        min: 0
      },
      max: {
        type: Number,
        default: 0,
        min: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    priceCategory: {
      type: String,
      enum: ['free', 'budget', 'mid-range', 'expensive', 'luxury'],
      required: true
    }
  },
  duration: {
    min: {
      type: Number, // in minutes
      default: 60
    },
    max: {
      type: Number, // in minutes
      default: 120
    }
  },
  location: {
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: false } }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    enum: ['popular', 'hidden-gem', 'family-friendly', 'romantic', 'group-activity', 'solo-friendly', 'instagram-worthy', 'local-favorite', 'tourist-attraction', 'seasonal']
  }],
  requirements: {
    ageRestriction: {
      min: Number,
      max: Number
    },
    fitnessLevel: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'extreme']
    },
    bookingRequired: {
      type: Boolean,
      default: false
    },
    groupSize: {
      min: Number,
      max: Number
    }
  },
  seasonality: {
    bestMonths: [{
      type: String,
      enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],
    weatherDependent: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search functionality
activitySchema.index({ name: 'text', description: 'text', category: 'text' });
activitySchema.index({ city: 1, category: 1 });
activitySchema.index({ 'pricing.priceCategory': 1 });

module.exports = mongoose.model('Activity', activitySchema);