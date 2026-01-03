const express = require('express');
const City = require('../models/City');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cities
// @desc    Get cities with search and filtering
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      search, 
      country, 
      region, 
      costIndex, 
      tags, 
      page = 1, 
      limit = 20,
      sortBy = 'popularityScore',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (country) {
      query.country = new RegExp(country, 'i');
    }

    if (region) {
      query.region = new RegExp(region, 'i');
    }

    if (costIndex) {
      const costIndexArray = Array.isArray(costIndex) ? costIndex : [costIndex];
      query.costIndex = { $in: costIndexArray.map(Number) };
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagsArray };
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const cities = await City.find(query)
      .select('name country region coordinates description images costIndex averageCosts popularityScore tags timezone currency language')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await City.countDocuments(query);

    res.json({
      cities,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cities/:id
// @desc    Get city by ID with activities
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const city = await City.findById(req.params.id)
      .populate({
        path: 'activities',
        select: 'name description category pricing duration images rating tags requirements',
        match: { isActive: true }
      });

    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.json({ city });
  } catch (error) {
    console.error('Get city error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cities/search/suggestions
// @desc    Get city search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const suggestions = await City.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { country: new RegExp(q, 'i') },
        { region: new RegExp(q, 'i') }
      ]
    })
    .select('name country region images popularityScore')
    .sort({ popularityScore: -1 })
    .limit(10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cities/popular/destinations
// @desc    Get popular destinations
// @access  Public
router.get('/popular/destinations', async (req, res) => {
  try {
    const { limit = 12 } = req.query;

    const popularCities = await City.find()
      .select('name country images popularityScore costIndex tags')
      .sort({ popularityScore: -1 })
      .limit(parseInt(limit));

    res.json({ cities: popularCities });
  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cities/nearby/:id
// @desc    Get nearby cities
// @access  Public
router.get('/nearby/:id', async (req, res) => {
  try {
    const { maxDistance = 500, limit = 10 } = req.query; // maxDistance in km
    
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    const nearbyCities = await City.find({
      _id: { $ne: city._id },
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [city.coordinates.longitude, city.coordinates.latitude]
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      }
    })
    .select('name country images coordinates popularityScore costIndex')
    .limit(parseInt(limit));

    res.json({ nearbyCities });
  } catch (error) {
    console.error('Get nearby cities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cities/countries/list
// @desc    Get list of countries with city counts
// @access  Public
router.get('/countries/list', async (req, res) => {
  try {
    const countries = await City.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          avgCostIndex: { $avg: '$costIndex' },
          popularCities: {
            $push: {
              $cond: {
                if: { $gte: ['$popularityScore', 70] },
                then: { name: '$name', popularityScore: '$popularityScore' },
                else: '$$REMOVE'
              }
            }
          }
        }
      },
      {
        $project: {
          country: '$_id',
          cityCount: '$count',
          avgCostIndex: { $round: ['$avgCostIndex', 1] },
          popularCities: { $slice: ['$popularCities', 3] }
        }
      },
      { $sort: { cityCount: -1 } }
    ]);

    res.json({ countries });
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;