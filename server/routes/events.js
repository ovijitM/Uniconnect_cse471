const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { verifyToken, requireRole } = require('./auth');

const router = express.Router();// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            search,
            type,
            club,
            upcoming = 'true',
            page = 1,
            limit = 12,
            university
        } = req.query;

        let query = {};

        // Filter by university if specified
        if (university) {
            query.university = university;
        }

        // Filter by event type
        if (type && type !== 'All') {
            query.eventType = type;
        }

        // Filter by club
        if (club) {
            query.club = club;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }        // Filter upcoming events
        if (upcoming === 'true') {
            query.startDate = { $gte: new Date() };
        }

        const events = await Event.find(query)
            .populate('club', 'name category university')
            .populate('university', 'name code location')
            .populate('attendees.user', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ startDate: 1 });

        const total = await Event.countDocuments(query);

        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('club', 'name category description president university')
            .populate('university', 'name code location')
            .populate('attendees.user', 'name email profilePicture major year');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Club members only)
router.post('/', verifyToken, async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            organizer,
            startDate,
            endDate,
            startTime,
            endTime,
            venue,
            capacity,
            registrationRequired,
            registrationDeadline,
            entryFee,
            requirements,
            contactInfo,
            tags
        } = req.body;

        // Verify user is a member of the organizing club
        const club = await Club.findById(organizer).populate('university');
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Verify club belongs to user's university
        const userUniversityId = req.user.university?._id || req.user.university;
        if (club.university._id.toString() !== userUniversityId.toString()) {
            return res.status(403).json({ message: 'You can only create events for clubs at your university' });
        }

        const isMember = club.members.some(
            member => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({ message: 'You must be a member of the club to create events' });
        }

        const event = new Event({
            title,
            description,
            eventType: type,
            club: organizer,
            university: club.university._id, // Associate event with university
            startDate,
            endDate,
            startTime: startTime || '09:00',
            endTime: endTime || '17:00',
            venue: venue || 'TBD',
            maxAttendees: capacity,
            isRegistrationRequired: registrationRequired,
            registrationDeadline,
            registrationFee: entryFee || 0,
            requirements,
            contactInfo,
            tags
        });

        await event.save();

        const populatedEvent = await Event.findById(event._id)
            .populate('club', 'name category')
            .populate('university', 'name code location')
            .populate('attendees.user', 'name email');

        res.status(201).json({
            message: 'Event created successfully',
            event: populatedEvent
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if registration is required
        if (!event.registrationRequired) {
            return res.status(400).json({ message: 'Registration is not required for this event' });
        }

        // Check if registration deadline has passed
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            return res.status(400).json({ message: 'Registration deadline has passed' });
        }

        // Check if event is at capacity
        if (event.capacity && event.attendees.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        // Check if user is already registered
        const isRegistered = event.attendees.some(
            attendee => attendee.toString() === req.user._id.toString()
        );

        if (isRegistered) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Add user to event attendees
        event.attendees.push(req.user._id);
        await event.save();

        // Add event to user's attended events
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                eventsAttended: event._id
            }
        });

        res.json({ message: 'Successfully registered for the event' });
    } catch (error) {
        console.error('Register event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events/:id/unregister
// @desc    Unregister from an event
// @access  Private
router.post('/:id/unregister', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event has already started
        if (new Date() >= event.startDate) {
            return res.status(400).json({ message: 'Cannot unregister from an event that has already started' });
        }

        // Remove user from event attendees
        event.attendees = event.attendees.filter(
            attendee => attendee.toString() !== req.user._id.toString()
        );

        await event.save();

        // Remove event from user's attended events
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                eventsAttended: event._id
            }
        });

        res.json({ message: 'Successfully unregistered from the event' });
    } catch (error) {
        console.error('Unregister event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/club/:clubId
// @desc    Get events by club
// @access  Public
router.get('/club/:clubId', async (req, res) => {
    try {
        const { upcoming = true, page = 1, limit = 12 } = req.query;
        let query = { organizer: req.params.clubId };

        // Filter upcoming events
        if (upcoming === 'true') {
            query.startDate = { $gte: new Date() };
        }

        const events = await Event.find(query)
            .populate('organizer', 'name category')
            .populate('attendees', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ startDate: 1 });

        const total = await Event.countDocuments(query);

        res.json({
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Get club events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
