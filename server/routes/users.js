const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        university: req.user.university,
        major: req.user.major,
        year: req.user.year,
        bio: req.user.bio,
        interests: req.user.interests,
        profilePicture: req.user.profilePicture
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, university, major, year, bio, interests } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        university,
        major,
        year,
        bio,
        interests
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users
// @desc    Get users - all users for admin, filtered by university for others
// @access  Private
router.get('/', verifyToken, async (req, res) => {
  try {
    let users;

    if (req.user.role === 'Administrator') {
      // Administrators can see all users
      users = await User.find({})
        .select('-password')
        .populate('university', 'name code location type')
        .sort({ createdAt: -1 });
    } else {
      // Regular users only see users from same university (excluding themselves)
      users = await User.find({
        _id: { $ne: req.user._id },
        university: req.user.university._id
      })
        .select('-password')
        .populate('university', 'name code')
        .limit(20);
    }

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/users/:id/deactivate
// @desc    Deactivate/reactivate a user
// @access  Private (Administrator only)
router.patch('/:id/deactivate', verifyToken, requireRole('Administrator'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
