const express = require('express');
const Activity = require('../models/Activity');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/activities
// @desc    Get activities with search and filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      cityId,
      search, 
      category, 
      priceCategory,
      tags,
      duration,
      rating,
      page = 1, 
      limit = 20,
      sortBy = 'rating.average',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    // City filter (required for most searches)
    if (cityId) {
      query.city = cityId;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      const categoryArray = Array.isArray(category) ? category : [category];
      query.category = { $in: categoryArray };
    }

    // Price category filter
    if (priceCategory) {
      const priceArray = Array.isArray(priceCategory) ? priceCategory : [priceCategory];
      query['pricing.priceCategory'] = { $in: priceArray };
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagsArray };
    }

    // Duration filter (in hours)
    if (duration) {
      const [minDuration, maxDuration] = duration.split('-').map(Number);
      query['duration.min'] = { $lte: maxDuration * 60 }; // Convert hours to minutes
      query['duration.max'] = { $gte: minDuration * 60 };
    }

    // Rating filter
    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const activities = await Activity.find(query)
      .populate('city', 'name country')
      .select('name description category subcategory images pricing duration location rating tags requirements seasonality')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('city', 'name country coordinates timezone currency');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (!activity.isActive) {
      return res.status(404).json({ message: 'Activity not available' });
    }

    res.json({ activity });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/city/:cityId/recommended
// @desc    Get recommended activities for a city
// @access  Public
router.get('/city/:cityId/recommended', optionalAuth, async (req, res) => {
  try {
    const { limit = 10, budgetRange = 'mid-range' } = req.query;
    
    // Define price categories based on budget range
    let priceCategoryFilter = [];
    switch (budgetRange) {
      case 'budget':
        priceCategoryFilter = ['free', 'budget'];
        break;
      case 'mid-range':
        priceCategoryFilter = ['free', 'budget', 'mid-range'];
        break;
      case 'luxury':
        priceCategoryFilter = ['mid-range', 'expensive', 'luxury'];
        break;
      default:
        priceCategoryFilter = ['free', 'budget', 'mid-range', 'expensive'];
    }

    const recommendedActivities = await Activity.find({
      city: req.params.cityId,
      isActive: true,
      'pricing.priceCategory': { $in: priceCategoryFilter },
      'rating.average': { $gte: 3.5 }
    })
    .select('name description category pricing duration images rating tags')
    .sort({ 
      'rating.average': -1, 
      'rating.count': -1 
    })
    .limit(parseInt(limit));

    // Group by category for better recommendations
    const groupedActivities = recommendedActivities.reduce((acc, activity) => {
      if (!acc[activity.category]) {
        acc[activity.category] = [];
      }
      acc[activity.category].push(activity);
      return acc;
    }, {});

    res.json({ 
      recommendedActivities,
      groupedByCategory: groupedActivities
    });
  } catch (error) {
    console.error('Get recommended activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/categories/list
// @desc    Get list of activity categories with counts
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const { cityId } = req.query;
    const matchQuery = { isActive: true };
    
    if (cityId) {
      matchQuery.city = cityId;
    }

    const categories = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating.average' },
          priceRange: {
            $push: '$pricing.priceCategory'
          }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          avgRating: { $round: ['$avgRating', 1] },
          availablePriceCategories: {
            $setUnion: ['$priceRange', []]
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/activities/search/suggestions
// @desc    Get activity search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, cityId } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const query = {
      isActive: true,
      $or: [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
        { subcategory: new RegExp(q, 'i') }
      ]
    };

    if (cityId) {
      query.city = cityId;
    }

    const suggestions = await Activity.find(query)
      .populate('city', 'name country')
      .select('name category pricing.priceCategory rating.average images')
      .sort({ 'rating.average': -1, 'rating.count': -1 })
      .limit(8);

    res.json({ suggestions });
  } catch (error) {
    console.error('Get activity suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/activities/bulk-pricing
// @desc    Get pricing for multiple activities
// @access  Public
router.post('/bulk-pricing', async (req, res) => {
  try {
    const { activityIds } = req.body;
    
    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return res.status(400).json({ message: 'Activity IDs array is required' });
    }

    const activities = await Activity.find({
      _id: { $in: activityIds },
      isActive: true
    })
    .select('name pricing duration category');

    const pricingInfo = activities.map(activity => ({
      id: activity._id,
      name: activity.name,
      category: activity.category,
      pricing: activity.pricing,
      duration: activity.duration,
      estimatedCost: activity.pricing.free ? 0 : 
        (activity.pricing.cost.min + activity.pricing.cost.max) / 2
    }));

    const totalEstimatedCost = pricingInfo.reduce((sum, item) => sum + item.estimatedCost, 0);

    res.json({ 
      activities: pricingInfo,
      totalEstimatedCost,
      currency: pricingInfo[0]?.pricing?.cost?.currency || 'USD'
    });
  } catch (error) {
    console.error('Get bulk pricing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;