const express = require('express');
const jwt = require('jsonwebtoken');
const Club = require('../models/Club');
const User = require('../models/User');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// @route   GET /api/clubs
// @desc    Get all clubs (optionally filtered by university)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, search, page = 1, limit = 12, university } = req.query;
        let query = { isActive: true };

        // Filter by university if specified
        if (university) {
            query.university = university;
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const clubs = await Club.find(query)
            .populate('president', 'name email')
            .populate('members.user', 'name email')
            .populate('university', 'name code location')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Club.countDocuments(query);

        res.json({
            clubs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get clubs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});// @route   GET /api/clubs/:id
// @desc    Get club by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const club = await Club.findById(req.params.id)
            .populate('president', 'name email profilePicture')
            .populate('members.user', 'name email profilePicture major year')
            .populate('university', 'name code location');

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        res.json(club);
    } catch (error) {
        console.error('Get club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/clubs
// @desc    Create a new club
// @access  Private (Club Admin or Administrator only)
router.post('/', verifyToken, requireRole('Club Admin', 'Administrator'), async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            contactEmail,
            advisors,
            socialMedia,
            meetingSchedule,
            membershipFee
        } = req.body;

        // Check if club with same name exists at the same university
        const existingClub = await Club.findOne({
            name,
            university: req.user.university
        });
        if (existingClub) {
            return res.status(400).json({ message: 'Club with this name already exists at your university' });
        }

        const club = new Club({
            name,
            description,
            category,
            president: req.user._id,
            university: req.user.university, // Associate club with user's university
            contactEmail,
            advisors,
            socialMedia,
            meetingSchedule,
            membershipFee,
            members: [{
                user: req.user._id,
                role: 'President'
            }]
        });

        await club.save();

        // Add club to user's memberships
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                clubMemberships: {
                    club: club._id,
                    role: 'President'
                }
            }
        });

        const populatedClub = await Club.findById(club._id)
            .populate('president', 'name email')
            .populate('members.user', 'name email')
            .populate('university', 'name code location');

        res.status(201).json({
            message: 'Club created successfully',
            club: populatedClub
        });
    } catch (error) {
        console.error('Create club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/clubs/:id/join
// @desc    Join a club
// @access  Private
router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id).populate('university');

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if club belongs to user's university
        const userUniversityId = req.user.university?._id || req.user.university;
        if (club.university._id.toString() !== userUniversityId.toString()) {
            return res.status(403).json({ message: 'You can only join clubs at your university' });
        }

        // Check if user is already a member
        const isMember = club.members.some(
            member => member.user.toString() === req.user._id.toString()
        );

        if (isMember) {
            return res.status(400).json({ message: 'You are already a member of this club' });
        }

        // Add user to club members
        club.members.push({
            user: req.user._id,
            role: 'Member'
        });

        await club.save();

        // Add club to user's memberships
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                clubMemberships: {
                    club: club._id,
                    role: 'Member'
                }
            }
        });

        res.json({ message: 'Successfully joined the club' });
    } catch (error) {
        console.error('Join club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/clubs/:id/leave
// @desc    Leave a club
// @access  Private
router.post('/:id/leave', verifyToken, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if user is the president
        if (club.president.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'President cannot leave the club. Transfer presidency first.' });
        }

        // Remove user from club members
        club.members = club.members.filter(
            member => member.user.toString() !== req.user._id.toString()
        );

        await club.save();

        // Remove club from user's memberships
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                clubMemberships: { club: club._id }
            }
        });

        res.json({ message: 'Successfully left the club' });
    } catch (error) {
        console.error('Leave club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
