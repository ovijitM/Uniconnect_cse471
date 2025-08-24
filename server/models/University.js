const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'University name is required'],
        trim: true,
        unique: true
    },
    code: {
        type: String,
        required: [true, 'University code is required'],
        trim: true,
        uppercase: true,
        unique: true
    },
    location: {
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            required: [true, 'Country is required'],
            trim: true,
            default: 'USA'
        }
    },
    type: {
        type: String,
        enum: ['Public', 'Private', 'Community College', 'Research University'],
        default: 'Public'
    },
    website: {
        type: String,
        trim: true
    },
    establishedYear: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for better search performance
universitySchema.index({ name: 'text', 'location.city': 'text' });

module.exports = mongoose.model('University', universitySchema);
