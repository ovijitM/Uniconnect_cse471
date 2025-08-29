const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { verifyToken, optionalAuth, requireRole } = require('./auth');

const router = express.Router();// @route   GET /api/events
// @desc    Get all events (with public/private access control)
// @access  Public (enhanced with optional authentication)
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            search,
            type,
            club,
            status,
            accessType,
            page = 1,
            limit = 12,
            university
        } = req.query;

        let query = {};

        // Implement access control based on accessType
        if (req.user) {
            // For authenticated users: show open events + university-exclusive events from their university
            const userUniversityId = req.user.university?._id || req.user.university;
            query.$or = [
                { accessType: 'open' }, // All open events
                { accessType: 'university-exclusive', university: userUniversityId } // University-exclusive events from user's university
            ];
        } else {
            // For non-authenticated users: only show open events
            query.accessType = 'open';
        }

        // Filter by university if specified
        if (university) {
            if (query.$or) {
                // Modify the existing $or condition to include university filter
                query.$or = query.$or.map(condition => ({
                    ...condition,
                    university: university
                }));
            } else {
                query.university = university;
            }
        }

        // Filter by event status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Filter by access type
        if (accessType && accessType !== 'all') {
            query.accessType = accessType;
        }

        // Filter by event type (category)
        if (type && type !== 'All') {
            query.eventType = type;
        }

        // Filter by club
        if (club) {
            query.club = club;
        }

        // Search functionality
        if (search) {
            const searchCondition = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ]
            };

            // Combine with existing query
            query = { $and: [query, searchCondition] };
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

// @route   GET /api/events/managed
// @desc    Get events for clubs managed by the current user
// @access  Private
router.get('/managed', verifyToken, async (req, res) => {
    try {
        // First find clubs where user is president
        const Club = require('../models/Club');
        const managedClubs = await Club.find({ president: req.user._id });
        const clubIds = managedClubs.map(club => club._id);

        // Find events for those clubs
        const events = await Event.find({ club: { $in: clubIds } })
            .populate('club', 'name')
            .populate('attendees.user', 'name email')
            .populate('organizers', 'name email')
            .sort({ startDate: -1 });

        res.json({ events });
    } catch (error) {
        console.error('Get managed events error:', error);
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
            tags,
            accessType = 'open'
        } = req.body;

        // Check if user is authorized to create events for this club
        const club = await Club.findById(organizer).populate('university');
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Verify club belongs to user's university
        const userUniversityId = req.user.university?._id || req.user.university;
        if (club.university._id.toString() !== userUniversityId.toString()) {
            return res.status(403).json({ message: 'You can only create events for clubs at your university' });
        }

        // Check authorization based on user role
        let authorized = false;

        if (req.user.role === 'Administrator') {
            // Administrators can create events for any club
            authorized = true;
        } else if (req.user.role === 'Club Admin') {
            // Club admins can only create events for clubs where they are president
            if (club.president && club.president.toString() === req.user._id.toString()) {
                authorized = true;
            }
        } else {
            // Regular students must be members of the club
            const isMember = club.members.some(
                member => member.user.toString() === req.user._id.toString()
            );
            authorized = isMember;
        }

        if (!authorized) {
            const roleMessage = req.user.role === 'Club Admin'
                ? 'You can only create events for clubs where you are the president'
                : 'You must be a member of the club to create events';
            return res.status(403).json({ message: roleMessage });
        }

        // Validate accessType
        if (!['open', 'university-exclusive'].includes(accessType)) {
            return res.status(400).json({ message: 'Invalid access type. Must be "open" or "university-exclusive"' });
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
            isRegistrationRequired: !!registrationRequired,
            registrationDeadline,
            registrationFee: entryFee || 0,
            requirements,
            contactInfo,
            tags,
            accessType: accessType,
            // Set legacy field for backward compatibility
            isPublic: accessType === 'open'
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

// @route   GET /api/events/:id/registration-data
// @desc    Get user's registration data for pre-filling forms
// @access  Private
router.get('/:id/registration-data', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get user data for pre-filling
        const user = await User.findById(req.user._id)
            .populate('university', 'name code')
            .select('name email phone university studentId major year');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const registrationData = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            university: user.university?.name || '',
            studentId: user.studentId || '',
            major: user.major || '',
            year: user.year || '',
            dietaryRestrictions: '',
            emergencyContact: {
                name: '',
                phone: '',
                relationship: ''
            },
            additionalInfo: ''
        };

        res.json({ registrationData });
    } catch (error) {
        console.error('Get registration data error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('university', 'name code');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Disallow registration if event has ended (closed phase)
        const now = new Date();
        if (event.endDate && new Date(event.endDate) < now) {
            return res.status(400).json({ message: 'This event has already ended. Registration is closed.' });
        }

        // Check if user can access this event based on accessType
        const userUniversityId = req.user.university?._id || req.user.university;

        if (event.accessType === 'university-exclusive') {
            // For university-exclusive events, user must be from the same university
            if (!userUniversityId || event.university._id.toString() !== userUniversityId.toString()) {
                return res.status(403).json({
                    message: 'This is a university-exclusive event. Only students from ' + event.university.name + ' can register.'
                });
            }
        }

        // Check if registration is required
        if (!event.isRegistrationRequired) {
            return res.status(400).json({ message: 'Registration is not required for this event' });
        }

        // Check if registration deadline has passed
        if (event.registrationDeadline && new Date() > event.registrationDeadline) {
            return res.status(400).json({ message: 'Registration deadline has passed' });
        }

        // If no explicit deadline, close registration at event start
        if (!event.registrationDeadline && new Date() >= event.startDate) {
            return res.status(400).json({ message: 'Registration is closed as the event has started' });
        }

        // Check if event is at capacity
        if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        // Check if user is already registered
        const isRegistered = event.attendees.some(
            attendee => attendee.user.toString() === req.user._id.toString()
        );

        if (isRegistered) {
            return res.status(400).json({ message: 'You are already registered for this event' });
        }

        // Registration data is optional; fall back to user's profile where possible
        const incoming = (req.body && typeof req.body.registrationData === 'object') ? req.body.registrationData : {};
        // Fetch user to fill defaults
        const user = await User.findById(req.user._id)
            .populate('university', 'name code')
            .select('name email phone university studentId major year');

        const safeTrim = (v) => (typeof v === 'string' ? v.trim() : '');

        const attendeeData = {
            user: req.user._id,
            registeredAt: new Date(),
            attended: false,
            registrationData: {
                name: safeTrim(incoming.name) || user?.name || '',
                email: (safeTrim(incoming.email) || user?.email || '').toLowerCase(),
                phone: safeTrim(incoming.phone) || user?.phone || '',
                university: safeTrim(incoming.university) || user?.university?.name || '',
                studentId: safeTrim(incoming.studentId) || user?.studentId || '',
                major: safeTrim(incoming.major) || user?.major || '',
                year: incoming.year || user?.year || '',
                dietaryRestrictions: safeTrim(incoming.dietaryRestrictions),
                emergencyContact: {
                    name: safeTrim(incoming.emergencyContact?.name),
                    phone: safeTrim(incoming.emergencyContact?.phone),
                    relationship: safeTrim(incoming.emergencyContact?.relationship)
                },
                additionalInfo: safeTrim(incoming.additionalInfo)
            }
        };

        event.attendees.push(attendeeData);
        await event.save();

        // Add event to user's attended events
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                eventsAttended: {
                    event: event._id,
                    attendedDate: new Date()
                }
            }
        });

        res.json({ 
            message: 'Successfully registered for the event',
            registrationData: attendeeData.registrationData
        });
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

        // Check if user is registered
        const attendeeIndex = event.attendees.findIndex(
            attendee => attendee.user.toString() === req.user._id.toString()
        );

        if (attendeeIndex === -1) {
            return res.status(400).json({ message: 'You are not registered for this event' });
        }

        // Remove user from event attendees
        event.attendees.splice(attendeeIndex, 1);

        await event.save();

        // Remove event from user's attended events
        await User.findByIdAndUpdate(req.user._id, {
            $pull: {
                eventsAttended: { event: event._id }
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
        let query = { club: req.params.clubId };

        // Filter upcoming events
        if (upcoming === 'true') {
            query.startDate = { $gte: new Date() };
        }

        const events = await Event.find(query)
            .populate('club', 'name category')
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
        console.error('Get club events error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/events/:id
// @desc    Update event details (club president only)
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('club');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the club president or admin
        if (event.club?.president?.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const {
            title, description, eventType, startDate, endDate, startTime, endTime,
            venue, maxAttendees, registrationFee, registrationDeadline,
            isRegistrationRequired, tags, poster, accessType
        } = req.body;

        // Update event fields
        if (title) event.title = title;
        if (description) event.description = description;
        if (eventType) event.eventType = eventType;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;
        if (startTime) event.startTime = startTime;
        if (endTime) event.endTime = endTime;
        if (venue) event.venue = venue;
        if (maxAttendees !== undefined) event.maxAttendees = maxAttendees;
        if (registrationFee !== undefined) event.registrationFee = registrationFee;
        if (registrationDeadline) event.registrationDeadline = registrationDeadline;
        if (isRegistrationRequired !== undefined) event.isRegistrationRequired = !!isRegistrationRequired;
        if (Array.isArray(tags)) event.tags = tags;
        if (poster) event.poster = poster;
        if (accessType && ['open', 'university-exclusive'].includes(accessType)) event.accessType = accessType;

        await event.save();

        const updatedEvent = await Event.findById(event._id)
            .populate('club', 'name')
            .populate('attendees.user', 'name email')
            .populate('organizers', 'name email');

        res.json({ event: updatedEvent });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/events/:id/attendees/:userId/attendance
// @desc    Mark attendee attendance (club president only)
// @access  Private
router.put('/:id/attendees/:userId/attendance', verifyToken, async (req, res) => {
    try {
        const { attended } = req.body;
        const event = await Event.findById(req.params.id).populate('club');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the club president or admin
        if (event.club?.president?.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to mark attendance for this event' });
        }

        // Find attendee
        const attendee = event.attendees?.find(attendee =>
            attendee?.user?.toString() === req.params.userId
        );

        if (!attendee) {
            return res.status(404).json({ message: 'Attendee not found in this event' });
        }

        // Update attendance
        attendee.attended = attended;
        await event.save();

        const updatedEvent = await Event.findById(event._id)
            .populate('club', 'name')
            .populate('attendees.user', 'name email')
            .populate('organizers', 'name email');

        res.json({ event: updatedEvent });
    } catch (error) {
        console.error('Update attendance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id/attendees/:userId
// @desc    Remove attendee from event (club president only)
// @access  Private
router.delete('/:id/attendees/:userId', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('club');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the club president or admin
        if (event.club?.president?.toString() !== req.user._id.toString() && req.user.role !== 'Administrator') {
            return res.status(403).json({ message: 'Not authorized to remove attendees from this event' });
        }

        // Find and remove attendee
        const attendeeIndex = event.attendees?.findIndex(attendee =>
            attendee?.user?.toString() === req.params.userId
        );

        if (attendeeIndex === -1) {
            return res.status(404).json({ message: 'Attendee not found in this event' });
        }

        event.attendees.splice(attendeeIndex, 1);
        await event.save();

        const updatedEvent = await Event.findById(event._id)
            .populate('club', 'name')
            .populate('attendees.user', 'name email')
            .populate('organizers', 'name email');

        res.json({ event: updatedEvent });
    } catch (error) {
        console.error('Remove attendee error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (Administrator, Club President, or Event Organizer)
// @access  Private (Administrator, Club President, or Event Organizer)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('club');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is Administrator, club president, or event organizer
        const isAdmin = req.user.role === 'Administrator';
        const isClubPresident = event.club?.president?.toString() === req.user._id.toString();
        const isOrganizer = event.organizers && Array.isArray(event.organizers) &&
            event.organizers.some(org => org && org.toString && org.toString() === req.user._id.toString());

        // Debug logging
        console.log('Event delete authorization check:', {
            userId: req.user._id.toString(),
            userRole: req.user.role,
            eventId: event._id.toString(),
            eventTitle: event.title,
            clubId: event.club?._id?.toString(),
            clubPresidentId: event.club?.president?.toString(),
            organizers: event.organizers?.map(org => org.toString()),
            isAdmin,
            isClubPresident,
            isOrganizer
        });

        if (!isAdmin && !isClubPresident && !isOrganizer) {
            console.log('Access denied for event deletion');
            return res.status(403).json({
                message: 'Access denied. Only administrators, club presidents, or event organizers can delete events.'
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
