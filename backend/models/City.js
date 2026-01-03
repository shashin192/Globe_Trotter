const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'City name is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  costIndex: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
    required: true
  },
  averageCosts: {
    accommodation: {
      budget: { type: Number, default: 0 },
      midRange: { type: Number, default: 0 },
      luxury: { type: Number, default: 0 }
    },
    food: {
      budget: { type: Number, default: 0 },
      midRange: { type: Number, default: 0 },
      luxury: { type: Number, default: 0 }
    },
    transport: {
      local: { type: Number, default: 0 },
      taxi: { type: Number, default: 0 }
    }
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  bestTimeToVisit: [{
    month: {
      type: String,
      enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    weather: String,
    crowdLevel: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  tags: [{
    type: String,
    enum: ['beach', 'mountains', 'city', 'historical', 'cultural', 'adventure', 'nightlife', 'food', 'shopping', 'nature', 'romantic', 'family-friendly']
  }],
  timezone: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  language: [String],
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }]
}, {
  timestamps: true
});

// Index for search functionality
citySchema.index({ name: 'text', country: 'text', region: 'text' });
citySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('City', citySchema);