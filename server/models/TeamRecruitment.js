const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Application message is required'],
        maxlength: 1000
    },
    skills: [{
        type: String,
        trim: true
    }],
    portfolio: {
        type: String,
        trim: true
    },
    experience: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: {
        type: Date
    },
    reviewNote: {
        type: String,
        maxlength: 500
    }
});

const teamRecruitmentSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event is required']
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Poster is required']
    },
    title: {
        type: String,
        required: [true, 'Recruitment title is required'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: 1500
    },
    requiredSkills: [{
        type: String,
        trim: true
    }],
    preferredSkills: [{
        type: String,
        trim: true
    }],
    teamSize: {
        type: Number,
        required: [true, 'Team size is required'],
        min: 2,
        max: 10
    },
    currentMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requirements: {
        type: String,
        maxlength: 1000
    },
    contactMethod: {
        type: String,
        enum: ['Application', 'Direct Message', 'Email'],
        default: 'Application'
    },
    contactInfo: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Full', 'Inactive'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    deadline: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true
    }],
    applications: [applicationSchema],
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better performance
teamRecruitmentSchema.index({ event: 1, status: 1 });
teamRecruitmentSchema.index({ poster: 1, status: 1 });
teamRecruitmentSchema.index({ requiredSkills: 1 });
teamRecruitmentSchema.index({ createdAt: -1 });

// Virtual for available spots
teamRecruitmentSchema.virtual('availableSpots').get(function () {
    return Math.max(0, this.teamSize - this.currentMembers.length);
});

// Virtual for application count
teamRecruitmentSchema.virtual('applicationCount').get(function () {
    return this.applications.length;
});

// Virtual for pending applications
teamRecruitmentSchema.virtual('pendingApplications').get(function () {
    return this.applications.filter(app => app.status === 'Pending').length;
});

// Method to check if user can apply
teamRecruitmentSchema.methods.canUserApply = function (userId) {
    // Check if user is the poster
    if (this.poster.toString() === userId.toString()) {
        return { canApply: false, reason: 'You cannot apply to your own recruitment post' };
    }

    // Check if user is already a member
    if (this.currentMembers.some(member => member.toString() === userId.toString())) {
        return { canApply: false, reason: 'You are already a team member' };
    }

    // Check if user has already applied
    if (this.applications.some(app => app.applicant.toString() === userId.toString())) {
        return { canApply: false, reason: 'You have already applied to this team' };
    }

    // Check if recruitment is open
    if (this.status !== 'Open') {
        return { canApply: false, reason: 'This recruitment is no longer accepting applications' };
    }

    // Check if team is full
    if (this.availableSpots <= 0) {
        return { canApply: false, reason: 'This team is already full' };
    }

    // Check deadline
    if (this.deadline && new Date() > this.deadline) {
        return { canApply: false, reason: 'Application deadline has passed' };
    }

    return { canApply: true };
};

// Method to add team member
teamRecruitmentSchema.methods.addTeamMember = function (userId) {
    if (!this.currentMembers.includes(userId)) {
        this.currentMembers.push(userId);

        // Auto-close if team is full
        if (this.currentMembers.length >= this.teamSize) {
            this.status = 'Full';
        }
    }
};

module.exports = mongoose.model('TeamRecruitment', teamRecruitmentSchema);
