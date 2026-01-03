const express = require('express');
const { body, validationResult } = require('express-validator');
const Trip = require('../models/Trip');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/trips
// @desc    Create a new trip
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Trip name is required and must be less than 100 characters'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, description, startDate, endDate, coverPhoto, privacy, travelers, tags } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const trip = new Trip({
      name,
      description,
      user: req.user._id,
      startDate: start,
      endDate: end,
      coverPhoto: coverPhoto || '',
      privacy: privacy || 'private',
      travelers: travelers || { adults: 1, children: 0 },
      tags: tags || []
    });

    await trip.save();

    // Add trip to user's trips array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { trips: trip._id }
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('user', 'name email')
      .populate('stops.city', 'name country images');

    res.status(201).json({
      message: 'Trip created successfully',
      trip: populatedTrip
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips
// @desc    Get user's trips
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .populate('stops.city', 'name country images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Trip.countDocuments(query);

    res.json({
      trips,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get trip by ID
// @access  Private/Public (based on privacy settings)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('user', 'name email profilePhoto')
      .populate('stops.city', 'name country images coordinates costIndex')
      .populate('stops.activities.activity', 'name description category pricing duration images');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check access permissions
    const isOwner = req.user && trip.user._id.toString() === req.user._id.toString();
    const isCollaborator = req.user && trip.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString()
    );

    if (trip.privacy === 'private' && !isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (trip.privacy === 'friends' && !isOwner && !isCollaborator) {
      // TODO: Implement friends logic
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count if not owner
    if (!isOwner) {
      trip.views += 1;
      await trip.save();
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Trip name must be less than 100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user owns the trip or is an admin collaborator
    const isOwner = trip.user.toString() === req.user._id.toString();
    const isAdminCollaborator = trip.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString() && collab.role === 'admin'
    );

    if (!isOwner && !isAdminCollaborator) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateFields = {};
    const allowedFields = ['name', 'description', 'coverPhoto', 'privacy', 'status', 'travelers', 'tags'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('stops.city', 'name country images');

    res.json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Only owner can delete trip
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Trip.findByIdAndDelete(req.params.id);

    // Remove trip from user's trips array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { trips: req.params.id }
    });

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/trips/:id/stops
// @desc    Add stop to trip
// @access  Private
router.post('/:id/stops', auth, [
  body('cityId').isMongoId().withMessage('Valid city ID is required'),
  body('arrivalDate').isISO8601().withMessage('Valid arrival date is required'),
  body('departureDate').isISO8601().withMessage('Valid departure date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check permissions
    const isOwner = trip.user.toString() === req.user._id.toString();
    const canEdit = trip.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString() && 
      ['editor', 'admin'].includes(collab.role)
    );

    if (!isOwner && !canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { cityId, arrivalDate, departureDate, accommodation, notes } = req.body;
    
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    
    if (departure <= arrival) {
      return res.status(400).json({ message: 'Departure date must be after arrival date' });
    }

    const duration = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
    const order = trip.stops.length + 1;

    const newStop = {
      city: cityId,
      arrivalDate: arrival,
      departureDate: departure,
      duration,
      order,
      accommodation: accommodation || {},
      activities: [],
      notes: notes || ''
    };

    trip.stops.push(newStop);
    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id)
      .populate('stops.city', 'name country images coordinates');

    res.json({
      message: 'Stop added successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Add stop error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/trips/:id/stops/:stopId/activities
// @desc    Add/update activities for a stop
// @access  Private
router.put('/:id/stops/:stopId/activities', auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check permissions
    const isOwner = trip.user.toString() === req.user._id.toString();
    const canEdit = trip.collaborators.some(
      collab => collab.user.toString() === req.user._id.toString() && 
      ['editor', 'admin'].includes(collab.role)
    );

    if (!isOwner && !canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }

    const { activities } = req.body;
    
    // Update activities and recalculate budget
    stop.activities = activities.map(activity => ({
      ...activity,
      addedToTotal: activity.isSelected || false
    }));

    // Recalculate trip budget
    trip.calculateTotalBudget();
    await trip.save();

    const updatedTrip = await Trip.findById(req.params.id)
      .populate('stops.city', 'name country images')
      .populate('stops.activities.activity', 'name description category pricing');

    res.json({
      message: 'Activities updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Update activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trips/public/:shareableLink
// @desc    Get public trip by shareable link
// @access  Public
router.get('/public/:shareableLink', async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      shareableLink: req.params.shareableLink,
      privacy: 'public'
    })
    .populate('user', 'name profilePhoto')
    .populate('stops.city', 'name country images coordinates')
    .populate('stops.activities.activity', 'name description category pricing duration images');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or not public' });
    }

    // Increment view count
    trip.views += 1;
    await trip.save();

    res.json({ trip });
  } catch (error) {
    console.error('Get public trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;