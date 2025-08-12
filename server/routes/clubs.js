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

// @route   DELETE /api/clubs/:id
// @desc    Delete a club (Admin only)
// @access  Private (Administrator only)
router.delete('/:id', verifyToken, requireRole('Administrator'), async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        await Club.findByIdAndDelete(req.params.id);

        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Delete club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/clubs/managed
// @desc    Get clubs managed by the current user (president)
// @access  Private
router.get('/managed', verifyToken, async (req, res) => {
    try {
        const clubs = await Club.find({ president: req.user.id })
            .populate('members.user', 'name email')
            .populate('university', 'name code location')
            .sort({ createdAt: -1 });

        res.json({ clubs });
    } catch (error) {
        console.error('Get managed clubs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/clubs/:id
// @desc    Update club details (president only)
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if user is the president or admin
        if (club.president.toString() !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to update this club' });
        }

        const {
            name, description, category, logo, contactEmail, socialMedia,
            meetingSchedule, membershipFee, advisors
        } = req.body;

        // Update club fields
        if (name) club.name = name;
        if (description) club.description = description;
        if (category) club.category = category;
        if (logo) club.logo = logo;
        if (contactEmail) club.contactEmail = contactEmail;
        if (socialMedia) club.socialMedia = socialMedia;
        if (meetingSchedule) club.meetingSchedule = meetingSchedule;
        if (membershipFee !== undefined) club.membershipFee = membershipFee;
        if (advisors) club.advisors = advisors;

        await club.save();

        const updatedClub = await Club.findById(club._id)
            .populate('president', 'name email')
            .populate('members.user', 'name email')
            .populate('university', 'name code location');

        res.json({ club: updatedClub });
    } catch (error) {
        console.error('Update club error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/clubs/:id/members
// @desc    Add member to club (president only)
// @access  Private
router.post('/:id/members', verifyToken, async (req, res) => {
    try {
        const { userId, role = 'Member' } = req.body;
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if user is the president or admin
        if (club.president.toString() !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to add members to this club' });
        }

        // Check if user exists
        const userToAdd = await User.findById(userId);
        if (!userToAdd) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user is already a member
        const existingMember = club.members.find(member =>
            member.user.toString() === userId
        );

        if (existingMember) {
            return res.status(400).json({ message: 'User is already a member' });
        }

        // Add member
        club.members.push({
            user: userId,
            role: role,
            joinedDate: new Date()
        });

        await club.save();

        const updatedClub = await Club.findById(club._id)
            .populate('members.user', 'name email')
            .populate('president', 'name email')
            .populate('university', 'name code location');

        res.json({ club: updatedClub });
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/clubs/:id/members/:userId
// @desc    Remove member from club (president only)
// @access  Private
router.delete('/:id/members/:userId', verifyToken, async (req, res) => {
    try {
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if user is the president or admin
        if (club.president.toString() !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to remove members from this club' });
        }

        // Find and remove member
        const memberIndex = club.members.findIndex(member =>
            member.user.toString() === req.params.userId
        );

        if (memberIndex === -1) {
            return res.status(404).json({ message: 'Member not found in this club' });
        }

        // Don't allow removing the president
        if (club.president.toString() === req.params.userId) {
            return res.status(400).json({ message: 'Cannot remove the president from the club' });
        }

        club.members.splice(memberIndex, 1);
        await club.save();

        const updatedClub = await Club.findById(club._id)
            .populate('members.user', 'name email')
            .populate('president', 'name email')
            .populate('university', 'name code location');

        res.json({ club: updatedClub });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/clubs/:id/members/:userId/role
// @desc    Update member role (president only)
// @access  Private
router.put('/:id/members/:userId/role', verifyToken, async (req, res) => {
    try {
        const { role } = req.body;
        const club = await Club.findById(req.params.id);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Check if user is the president or admin
        if (club.president.toString() !== req.user.id && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to update member roles in this club' });
        }

        // Find member
        const member = club.members.find(member =>
            member.user.toString() === req.params.userId
        );

        if (!member) {
            return res.status(404).json({ message: 'Member not found in this club' });
        }

        // Update role
        member.role = role;
        await club.save();

        const updatedClub = await Club.findById(club._id)
            .populate('members.user', 'name email')
            .populate('president', 'name email')
            .populate('university', 'name code location');

        res.json({ club: updatedClub });
    } catch (error) {
        console.error('Update member role error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
