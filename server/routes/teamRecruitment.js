const express = require('express');
const TeamRecruitment = require('../models/TeamRecruitment');
const Event = require('../models/Event');
const User = require('../models/User');
const { verifyToken } = require('./auth');

const router = express.Router();

// @route   GET /api/team-recruitment
// @desc    Get all active recruitment posts filtered by university
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { university, status, skills, page = 1, limit = 20, sortBy = 'createdAt' } = req.query;

        // Build filter
        let filter = {
            isActive: true
        };

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            filter.requiredSkills = { $in: skillsArray };
        }

        // Build sort
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'priority':
                sort.priority = -1;
                sort.createdAt = -1;
                break;
            case 'deadline':
                sort.deadline = 1;
                break;
            default:
                sort.createdAt = -1;
        }

        let query = TeamRecruitment.find(filter)
            .populate('event', 'title date location university')
            .populate('poster', 'name email avatar')
            .populate('applications.applicant', 'name email avatar')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const recruitments = await query.exec();

        // Filter by university if provided
        let filteredRecruitments = recruitments;
        if (university) {
            filteredRecruitments = recruitments.filter(recruitment =>
                recruitment.event &&
                recruitment.event.university &&
                recruitment.event.university.toString() === university.toString()
            );
        }

        const total = await TeamRecruitment.countDocuments(filter);

        res.json({
            success: true,
            recruitments: filteredRecruitments,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                total,
                hasNext: page < Math.ceil(total / limit),
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching recruitment posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recruitment posts',
            error: error.message
        });
    }
});

// @route   GET /api/team-recruitment/events/:eventId
// @desc    Get all recruitment posts for an event
// @access  Public
router.get('/events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { status, skills, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        // Build filter
        let filter = {
            event: eventId,
            isActive: true
        };

        if (status && status !== 'all') {
            filter.status = status;
        }

        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            filter.requiredSkills = { $in: skillsArray };
        }

        // Build sort
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort.createdAt = -1;
                break;
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'priority':
                sort.priority = -1;
                sort.createdAt = -1;
                break;
            case 'deadline':
                sort.deadline = 1;
                break;
            default:
                sort.createdAt = -1;
        }

        const recruitments = await TeamRecruitment.find(filter)
            .populate('poster', 'name email major year')
            .populate('currentMembers', 'name email major year')
            .populate('applications.applicant', 'name email major year')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TeamRecruitment.countDocuments(filter);

        res.json({
            recruitments,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
            hasMore: page * limit < total
        });
    } catch (error) {
        console.error('Get event recruitments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/team-recruitment/events/:eventId
// @desc    Create new recruitment post
// @access  Private
router.post('/events/:eventId', verifyToken, async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            title,
            description,
            requiredSkills,
            preferredSkills,
            teamSize,
            requirements,
            contactMethod,
            contactInfo,
            priority,
            deadline,
            tags
        } = req.body;

        // Verify event exists and user can post
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is registered for the event (optional check)
        // You might want to add this based on your event registration system

        const recruitment = new TeamRecruitment({
            event: eventId,
            poster: req.user._id,
            title,
            description,
            requiredSkills: requiredSkills || [],
            preferredSkills: preferredSkills || [],
            teamSize,
            requirements,
            contactMethod: contactMethod || 'Application',
            contactInfo,
            priority: priority || 'Medium',
            deadline,
            tags: tags || [],
            currentMembers: [req.user._id] // Poster is automatically a member
        });

        await recruitment.save();

        const populatedRecruitment = await TeamRecruitment.findById(recruitment._id)
            .populate('poster', 'name email major year')
            .populate('currentMembers', 'name email major year');

        res.status(201).json({
            message: 'Recruitment post created successfully',
            recruitment: populatedRecruitment
        });
    } catch (error) {
        console.error('Create recruitment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/team-recruitment/:id
// @desc    Get specific recruitment details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const recruitment = await TeamRecruitment.findById(req.params.id)
            .populate('event', 'title eventType startDate endDate')
            .populate('poster', 'name email major year bio')
            .populate('currentMembers', 'name email major year')
            .populate('applications.applicant', 'name email major year');

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }

        // Increment view count
        recruitment.views += 1;
        await recruitment.save();

        res.json({ recruitment });
    } catch (error) {
        console.error('Get recruitment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/team-recruitment/:id
// @desc    Update recruitment post
// @access  Private (Owner only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const recruitment = await TeamRecruitment.findById(req.params.id);

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }

        // Check if user is the poster
        if (recruitment.poster.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this recruitment' });
        }

        const {
            title,
            description,
            requiredSkills,
            preferredSkills,
            teamSize,
            requirements,
            contactMethod,
            contactInfo,
            priority,
            deadline,
            tags,
            status
        } = req.body;

        // Update fields
        if (title) recruitment.title = title;
        if (description) recruitment.description = description;
        if (requiredSkills) recruitment.requiredSkills = requiredSkills;
        if (preferredSkills) recruitment.preferredSkills = preferredSkills;
        if (teamSize) recruitment.teamSize = teamSize;
        if (requirements) recruitment.requirements = requirements;
        if (contactMethod) recruitment.contactMethod = contactMethod;
        if (contactInfo) recruitment.contactInfo = contactInfo;
        if (priority) recruitment.priority = priority;
        if (deadline) recruitment.deadline = deadline;
        if (tags) recruitment.tags = tags;
        if (status) recruitment.status = status;

        await recruitment.save();

        const updatedRecruitment = await TeamRecruitment.findById(recruitment._id)
            .populate('poster', 'name email major year')
            .populate('currentMembers', 'name email major year');

        res.json({
            message: 'Recruitment updated successfully',
            recruitment: updatedRecruitment
        });
    } catch (error) {
        console.error('Update recruitment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/team-recruitment/:id
// @desc    Delete recruitment post
// @access  Private (Owner only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const recruitment = await TeamRecruitment.findById(req.params.id);

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }

        // Check if user is the poster
        if (recruitment.poster.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this recruitment' });
        }

        await TeamRecruitment.findByIdAndDelete(req.params.id);

        res.json({ message: 'Recruitment post deleted successfully' });
    } catch (error) {
        console.error('Delete recruitment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/team-recruitment/:id/apply
// @desc    Apply to join a team
// @access  Private
router.post('/:id/apply', verifyToken, async (req, res) => {
    try {
        const { message, skills, portfolio, experience } = req.body;
        const recruitment = await TeamRecruitment.findById(req.params.id);

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }

        // Check if user can apply
        const canApply = recruitment.canUserApply(req.user._id);
        if (!canApply.canApply) {
            return res.status(400).json({ message: canApply.reason });
        }

        // Add application
        const application = {
            applicant: req.user._id,
            message,
            skills: skills || [],
            portfolio,
            experience
        };

        recruitment.applications.push(application);
        await recruitment.save();

        const updatedRecruitment = await TeamRecruitment.findById(recruitment._id)
            .populate('applications.applicant', 'name email major year');

        res.json({
            message: 'Application submitted successfully',
            application: updatedRecruitment.applications[updatedRecruitment.applications.length - 1]
        });
    } catch (error) {
        console.error('Apply to team error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/team-recruitment/:id/applications/:appId/status
// @desc    Accept/reject application
// @access  Private (Poster only)
router.put('/:id/applications/:appId/status', verifyToken, async (req, res) => {
    try {
        const { status, reviewNote } = req.body;
        const recruitment = await TeamRecruitment.findById(req.params.id);

        if (!recruitment) {
            return res.status(404).json({ message: 'Recruitment post not found' });
        }

        // Check if user is the poster
        if (recruitment.poster.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to review applications' });
        }

        // Find application
        const application = recruitment.applications.id(req.params.appId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update application status
        application.status = status;
        application.reviewedAt = new Date();
        if (reviewNote) application.reviewNote = reviewNote;

        // If accepted, add to team members
        if (status === 'Accepted') {
            recruitment.addTeamMember(application.applicant);
        }

        await recruitment.save();

        res.json({
            message: `Application ${status.toLowerCase()} successfully`,
            application
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/team-recruitment/user/applications
// @desc    Get user's applications
// @access  Private
router.get('/user/applications', verifyToken, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let matchStage = {
            'applications.applicant': req.user._id
        };

        if (status && status !== 'all') {
            matchStage['applications.status'] = status;
        }

        const applications = await TeamRecruitment.aggregate([
            { $match: matchStage },
            { $unwind: '$applications' },
            { $match: { 'applications.applicant': req.user._id } },
            {
                $lookup: {
                    from: 'events',
                    localField: 'event',
                    foreignField: '_id',
                    as: 'event'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'poster',
                    foreignField: '_id',
                    as: 'poster'
                }
            },
            { $unwind: '$event' },
            { $unwind: '$poster' },
            {
                $project: {
                    recruitmentId: '$_id',
                    title: '$title',
                    event: { title: '$event.title', _id: '$event._id' },
                    poster: { name: '$poster.name', email: '$poster.email' },
                    application: '$applications',
                    status: '$status',
                    teamSize: '$teamSize',
                    currentMembers: '$currentMembers'
                }
            },
            { $sort: { 'application.appliedAt': -1 } },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ]);

        res.json({ applications });
    } catch (error) {
        console.error('Get user applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/team-recruitment/user/posts
// @desc    Get user's recruitment posts
// @access  Private
router.get('/user/posts', verifyToken, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let filter = { poster: req.user._id };
        if (status && status !== 'all') {
            filter.status = status;
        }

        const posts = await TeamRecruitment.find(filter)
            .populate('event', 'title eventType startDate')
            .populate('currentMembers', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await TeamRecruitment.countDocuments(filter);

        res.json({
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
