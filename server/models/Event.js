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
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: [true, 'University is required']
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
            ref: 'User',
            required: true
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        attended: {
            type: Boolean,
            default: false
        },
        // Registration form data
        registrationData: {
            name: {
                type: String,
                required: false
            },
            email: {
                type: String,
                required: false
            },
            phone: {
                type: String,
                required: false
            },
            university: {
                type: String,
                required: false
            },
            studentId: {
                type: String
            },
            major: {
                type: String
            },
            year: {
                type: String
            },
            dietaryRestrictions: {
                type: String
            },
            emergencyContact: {
                name: String,
                phone: String,
                relationship: String
            },
            additionalInfo: {
                type: String,
                maxlength: 500
            }
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
        enum: ['upcoming', 'ongoing', 'closed'],
        default: 'upcoming'
    },
    accessType: {
        type: String,
        enum: ['university-exclusive', 'open'],
        default: 'open',
        required: [true, 'Access type is required']
    },
    // Legacy field for backward compatibility
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

// Virtual for checking if event is closed
eventSchema.virtual('isClosed').get(function () {
    return this.endDate < new Date();
});

// Method to automatically update status based on dates
eventSchema.methods.updateStatusBasedOnDates = function() {
    const now = new Date();
    if (this.endDate < now) {
        this.status = 'closed';
    } else if (this.startDate <= now && this.endDate >= now) {
        this.status = 'ongoing';
    } else {
        this.status = 'upcoming';
    }
    return this.status;
};

// Pre-save middleware to automatically update status
eventSchema.pre('save', function(next) {
    this.updateStatusBasedOnDates();
    next();
});

// Pre-update middleware to automatically update status
eventSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const update = this.getUpdate();
    if (update.startDate || update.update || update.$set) {
        const now = new Date();
        const startDate = update.startDate || update.$set?.startDate;
        const endDate = update.endDate || update.$set?.endDate;
        
        if (startDate && endDate) {
            let status;
            if (endDate < now) {
                status = 'closed';
            } else if (startDate <= now && endDate >= now) {
                status = 'ongoing';
            } else {
                status = 'upcoming';
            }
            
            if (update.$set) {
                update.$set.status = status;
            } else {
                update.status = status;
            }
        }
    }
    next();
});

// Ensure status is valid before validation runs
eventSchema.pre('validate', function(next) {
    // If current status is not one of allowed values, coerce based on dates
    const allowed = ['upcoming', 'ongoing', 'closed'];
    if (!allowed.includes(this.status)) {
        this.updateStatusBasedOnDates();
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
