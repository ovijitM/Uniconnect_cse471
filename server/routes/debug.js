// Debug route - temporary for testing user data structure
const express = require('express');
const { verifyToken } = require('./auth');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/debug/user
// @desc    Get user data with full population for debugging
// @access  Private
router.get('/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('university', 'name code location type')
            .populate({
                path: 'clubMemberships.club',
                select: 'name category description university _id',
                populate: {
                    path: 'university',
                    select: 'name code'
                }
            })
            .populate({
                path: 'eventsAttended.event',
                select: 'title description eventType startDate venue university _id',
                populate: {
                    path: 'university',
                    select: 'name code'
                }
            });

        // Debug info
        console.log('=== SERVER DEBUG - USER DATA ===');
        console.log('User ID:', user._id);
        console.log('Club Memberships:', user.clubMemberships);
        console.log('Events Attended:', user.eventsAttended);

        res.json({
            success: true,
            user: user,
            debug: {
                clubCount: user.clubMemberships?.length || 0,
                eventCount: user.eventsAttended?.length || 0,
                clubIds: user.clubMemberships?.map(m => m.club?._id || m.club) || [],
                eventIds: user.eventsAttended?.map(a => a.event?._id || a.event) || []
            }
        });
    } catch (error) {
        console.error('Debug user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router;
