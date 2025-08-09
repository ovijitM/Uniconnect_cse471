const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Club name is required'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Club description is required'],
        maxlength: 1000
    },
    category: {
        type: String,
        required: [true, 'Club category is required'],
        enum: [
            'Academic',
            'Sports',
            'Cultural',
            'Technical',
            'Social Service',
            'Arts & Literature',
            'Music & Dance',
            'Photography',
            'Debate & Drama',
            'Other'
        ]
    },
    logo: {
        type: String,
        default: ''
    },
    founded: {
        type: Date,
        default: Date.now
    },
    president: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    advisors: [{
        type: String,
        trim: true
    }],
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['Member', 'Officer', 'President', 'Vice President', 'Secretary'],
            default: 'Member'
        },
        joinedDate: {
            type: Date,
            default: Date.now
        }
    }],
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String
    },
    meetingSchedule: {
        day: String,
        time: String,
        location: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    membershipFee: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for better search performance
clubSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Club', clubSchema);
