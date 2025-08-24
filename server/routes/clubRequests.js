const express = require('express');
const ClubRequest = require('../models/ClubRequest');
const Club = require('../models/Club');
const User = require('../models/User');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();

// @route   GET /api/club-requests
// @desc    Get club requests (for club admin: their own requests, for admin: all requests)
// @access  Private
router.get('/', verifyToken, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'Club Admin') {
            // Club admins can only see their own requests
            query.requestedBy = req.user._id;
        } else if (req.user.role === 'Administrator') {
            // Administrators can see all requests
            const { status, university } = req.query;
            if (status && status !== 'all') {
                query.status = status;
            }
            if (university && university !== 'all') {
                query.university = university;
            }
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const requests = await ClubRequest.find(query)
            .populate('requestedBy', 'name email')
            .populate('university', 'name code location')
            .populate('reviewedBy', 'name email')
            .populate('clubId', 'name _id')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Error fetching club requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/club-requests/all
// @desc    Get all club requests (Administrator only)
// @access  Private (Administrator only)
router.get('/all', verifyToken, requireRole('Administrator'), async (req, res) => {
    try {
        const requests = await ClubRequest.find({})
            .populate('requestedBy', 'name email')
            .populate('university', 'name code location')
            .populate('reviewedBy', 'name email')
            .populate('clubId', 'name _id')
            .sort({ createdAt: -1 });

        res.json({ requests });
    } catch (error) {
        console.error('Error fetching all club requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/club-requests
// @desc    Create a new club request
// @access  Private (Club Admin only)
router.post('/', verifyToken, requireRole('Club Admin'), async (req, res) => {
    try {
        const { name, description, category, contactEmail, membershipFee } = req.body;

        // Check if user already has a pending request
        const existingRequest = await ClubRequest.findOne({
            requestedBy: req.user._id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'You already have a pending club request. Please wait for approval or contact an administrator.'
            });
        }

        // Check if club name already exists
        const existingClub = await Club.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingClub) {
            return res.status(400).json({ message: 'A club with this name already exists' });
        }

        // Check if there's already a request with the same name
        const existingNameRequest = await ClubRequest.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            status: 'pending'
        });
        if (existingNameRequest) {
            return res.status(400).json({ message: 'A club request with this name is already pending approval' });
        }

        const clubRequest = new ClubRequest({
            name,
            description,
            category,
            contactEmail,
            membershipFee: membershipFee || 0,
            requestedBy: req.user._id,
            university: req.user.university
        });

        await clubRequest.save();
        await clubRequest.populate('requestedBy', 'name email');
        await clubRequest.populate('university', 'name code location');

        res.status(201).json({
            message: 'Club request submitted successfully',
            request: clubRequest
        });
    } catch (error) {
        console.error('Error creating club request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/club-requests/:id/review
// @desc    Review a club request (approve/reject)
// @access  Private (Administrator only)
router.put('/:id/review', verifyToken, requireRole('Administrator'), async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
        }

        const clubRequest = await ClubRequest.findById(req.params.id)
            .populate('requestedBy', 'name email')
            .populate('university', 'name code location');

        if (!clubRequest) {
            return res.status(404).json({ message: 'Club request not found' });
        }

        if (clubRequest.status !== 'pending') {
            return res.status(400).json({ message: 'This request has already been reviewed' });
        }

        clubRequest.status = status;
        clubRequest.adminNotes = adminNotes || '';
        clubRequest.reviewedBy = req.user._id;
        clubRequest.reviewedAt = new Date();

        if (status === 'approved') {
            // Create the actual club
            const club = new Club({
                name: clubRequest.name,
                description: clubRequest.description,
                category: clubRequest.category,
                contactEmail: clubRequest.contactEmail,
                membershipFee: clubRequest.membershipFee,
                president: clubRequest.requestedBy._id,
                university: clubRequest.university._id,
                members: [{
                    user: clubRequest.requestedBy._id,
                    joinedAt: new Date(),
                    role: 'President'
                }],
                isActive: true
            });

            await club.save();
            clubRequest.clubId = club._id;
        }

        await clubRequest.save();
        await clubRequest.populate('reviewedBy', 'name email');
        await clubRequest.populate('clubId', 'name _id');

        res.json({
            message: `Club request ${status} successfully`,
            request: clubRequest
        });
    } catch (error) {
        console.error('Error reviewing club request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/club-requests/:id
// @desc    Delete a club request (only if pending and own request)
// @access  Private (Club Admin only)
router.delete('/:id', verifyToken, requireRole('Club Admin'), async (req, res) => {
    try {
        const clubRequest = await ClubRequest.findById(req.params.id);

        if (!clubRequest) {
            return res.status(404).json({ message: 'Club request not found' });
        }

        if (clubRequest.requestedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only delete your own requests' });
        }

        if (clubRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot delete a request that has been reviewed' });
        }

        await ClubRequest.findByIdAndDelete(req.params.id);

        res.json({ message: 'Club request deleted successfully' });
    } catch (error) {
        console.error('Error deleting club request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
