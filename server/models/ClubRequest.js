const mongoose = require('mongoose');

const clubRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Academic', 'Sports', 'Cultural', 'Technical', 'Social', 'Professional', 'Arts', 'Environment', 'Community Service', 'Other']
    },
    contactEmail: {
        type: String,
        required: true
    },
    membershipFee: {
        type: Number,
        default: 0,
        min: 0
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club' // Reference to the actual club once approved
    }
}, {
    timestamps: true
});

// Index for faster queries
clubRequestSchema.index({ status: 1, university: 1 });
clubRequestSchema.index({ requestedBy: 1 });

module.exports = mongoose.model('ClubRequest', clubRequestSchema);
