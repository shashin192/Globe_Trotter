const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('profilePhoto').optional().isURL().withMessage('Profile photo must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, profilePhoto } = req.body;
    const updateFields = {};

    if (name) updateFields.name = name;
    if (profilePhoto !== undefined) updateFields.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('language').optional().isIn(['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh']).withMessage('Invalid language'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR']).withMessage('Invalid currency'),
  body('budgetRange').optional().isIn(['budget', 'mid-range', 'luxury', 'mixed']).withMessage('Invalid budget range'),
  body('travelStyle').optional().isArray().withMessage('Travel style must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { language, currency, budgetRange, travelStyle } = req.body;
    const updateFields = {};

    if (language) updateFields['preferences.language'] = language;
    if (currency) updateFields['preferences.currency'] = currency;
    if (budgetRange) updateFields['preferences.budgetRange'] = budgetRange;
    if (travelStyle) updateFields['preferences.travelStyle'] = travelStyle;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/saved-destinations
// @desc    Add city to saved destinations
// @access  Private
router.post('/saved-destinations', auth, [
  body('cityId').isMongoId().withMessage('Invalid city ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { cityId } = req.body;
    const user = await User.findById(req.user._id);

    // Check if city is already saved
    const isAlreadySaved = user.savedDestinations.some(
      dest => dest.cityId.toString() === cityId
    );

    if (isAlreadySaved) {
      return res.status(400).json({ message: 'City is already in saved destinations' });
    }

    user.savedDestinations.push({ cityId });
    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('savedDestinations.cityId', 'name country images');

    res.json({
      message: 'City added to saved destinations',
      savedDestinations: updatedUser.savedDestinations
    });
  } catch (error) {
    console.error('Add saved destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/saved-destinations/:cityId
// @desc    Remove city from saved destinations
// @access  Private
router.delete('/saved-destinations/:cityId', auth, async (req, res) => {
  try {
    const { cityId } = req.params;
    const user = await User.findById(req.user._id);

    user.savedDestinations = user.savedDestinations.filter(
      dest => dest.cityId.toString() !== cityId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id)
      .populate('savedDestinations.cityId', 'name country images');

    res.json({
      message: 'City removed from saved destinations',
      savedDestinations: updatedUser.savedDestinations
    });
  } catch (error) {
    console.error('Remove saved destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/saved-destinations
// @desc    Get user's saved destinations
// @access  Private
router.get('/saved-destinations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedDestinations.cityId', 'name country images costIndex popularityScore tags');

    res.json({
      savedDestinations: user.savedDestinations
    });
  } catch (error) {
    console.error('Get saved destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/account
// @desc    Deactivate user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;