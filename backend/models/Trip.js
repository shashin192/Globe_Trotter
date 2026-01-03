const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trip name is required'],
    trim: true,
    maxlength: [100, 'Trip name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverPhoto: {
    type: String,
    default: ''
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  privacy: {
    type: String,
    enum: ['private', 'public', 'friends'],
    default: 'private'
  },
  shareableLink: {
    type: String,
    unique: true,
    sparse: true
  },
  stops: [{
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true
    },
    arrivalDate: {
      type: Date,
      required: true
    },
    departureDate: {
      type: Date,
      required: true
    },
    duration: {
      type: Number, // days
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    accommodation: {
      name: String,
      type: {
        type: String,
        enum: ['hotel', 'hostel', 'airbnb', 'resort', 'guesthouse', 'camping', 'other']
      },
      address: String,
      cost: {
        amount: Number,
        currency: String,
        perNight: Boolean
      },
      checkIn: Date,
      checkOut: Date
    },
    activities: [{
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      },
      scheduledDate: Date,
      scheduledTime: String,
      duration: Number, // minutes
      cost: {
        amount: Number,
        currency: String
      },
      notes: String,
      isSelected: {
        type: Boolean,
        default: false
      },
      addedToTotal: {
        type: Boolean,
        default: false
      }
    }],
    transportation: {
      toThisStop: {
        method: {
          type: String,
          enum: ['flight', 'train', 'bus', 'car', 'boat', 'other']
        },
        cost: {
          amount: Number,
          currency: String
        },
        duration: String,
        details: String
      }
    },
    dailyBudget: {
      food: Number,
      activities: Number,
      transport: Number,
      miscellaneous: Number
    },
    notes: String
  }],
  budget: {
    total: {
      planned: {
        type: Number,
        default: 0
      },
      actual: {
        type: Number,
        default: 0
      }
    },
    currency: {
      type: String,
      default: 'USD'
    },
    breakdown: {
      accommodation: {
        planned: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      },
      transportation: {
        planned: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      },
      activities: {
        planned: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      },
      food: {
        planned: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      },
      miscellaneous: {
        planned: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      }
    }
  },
  travelers: {
    adults: {
      type: Number,
      default: 1,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  tags: [{
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'business', 'adventure', 'relaxation', 'cultural', 'food', 'budget', 'luxury']
  }],
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor', 'admin'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate totalDays and validate dates
tripSchema.pre('save', function(next) {
  // Validate that end date is after start date
  if (this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }
  
  // Calculate total days
  const timeDiff = this.endDate.getTime() - this.startDate.getTime();
  this.totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  // Generate shareable link if privacy is public
  if (this.privacy === 'public' && !this.shareableLink) {
    this.shareableLink = this._id.toString() + '-' + Date.now().toString(36);
  }
  
  next();
});

// Calculate total budget from breakdown
tripSchema.methods.calculateTotalBudget = function() {
  const breakdown = this.budget.breakdown;
  this.budget.total.planned = 
    breakdown.accommodation.planned +
    breakdown.transportation.planned +
    breakdown.activities.planned +
    breakdown.food.planned +
    breakdown.miscellaneous.planned;
  
  this.budget.total.actual = 
    breakdown.accommodation.actual +
    breakdown.transportation.actual +
    breakdown.activities.actual +
    breakdown.food.actual +
    breakdown.miscellaneous.actual;
};

// Virtual field to calculate totalDays
tripSchema.virtual('totalDaysCalculated').get(function() {
  if (this.startDate && this.endDate) {
    const timeDiff = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  return this.totalDays || 1;
});

// Include virtuals in JSON output
tripSchema.set('toJSON', { virtuals: true });

// Index for search and performance
tripSchema.index({ user: 1, status: 1 });
tripSchema.index({ privacy: 1 });
tripSchema.index({ shareableLink: 1 });
tripSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Trip', tripSchema);