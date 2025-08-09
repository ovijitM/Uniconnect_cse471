const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        maxlength: 2000
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: [true, 'Club is required']
    },
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: [
            'Workshop',
            'Seminar',
            'Competition',
            'Social Event',
            'Meeting',
            'Conference',
            'Cultural Program',
            'Sports Event',
            'Fundraiser',
            'Community Service',
            'Other'
        ]
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    venue: {
        type: String,
        required: [true, 'Venue is required'],
        trim: true
    },
    maxAttendees: {
        type: Number,
        min: 1
    },
    registrationFee: {
        type: Number,
        default: 0,
        min: 0
    },
    registrationDeadline: {
        type: Date
    },
    isRegistrationRequired: {
        type: Boolean,
        default: false
    },
    attendees: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        attended: {
            type: Boolean,
            default: false
        }
    }],
    organizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    poster: {
        type: String,
        default: ''
    },
    requirements: {
        type: String,
        maxlength: 500
    },
    contactPerson: {
        name: String,
        email: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Cancelled', 'Completed'],
        default: 'Draft'
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better search and query performance
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ club: 1, startDate: 1 });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function () {
    return this.startDate > new Date();
});

// Virtual for checking if event is ongoing
eventSchema.virtual('isOngoing').get(function () {
    const now = new Date();
    return this.startDate <= now && this.endDate >= now;
});

module.exports = mongoose.model('Event', eventSchema);
