const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Announcement title is required'],
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: [true, 'Announcement content is required'],
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['General', 'Event', 'Important', 'Urgent', 'Achievement'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Normal', 'High', 'Urgent'],
        default: 'Normal'
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    attachments: [{
        filename: String,
        url: String,
        fileType: String,
        fileSize: Number
    }],
    tags: [{
        type: String,
        trim: true
    }],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    comments: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isEdited: {
            type: Boolean,
            default: false
        },
        editedAt: {
            type: Date
        }
    }],
    scheduledFor: {
        type: Date
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for better performance
announcementSchema.index({ club: 1, createdAt: -1 });
announcementSchema.index({ author: 1, createdAt: -1 });
announcementSchema.index({ type: 1, priority: 1 });
announcementSchema.index({ isPinned: 1, createdAt: -1 });
announcementSchema.index({ tags: 1 });

// Virtual for like count
announcementSchema.virtual('likeCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

// Virtual for comment count
announcementSchema.virtual('commentCount').get(function () {
    return this.comments ? this.comments.length : 0;
});

// Method to check if user has liked the announcement
announcementSchema.methods.isLikedByUser = function (userId) {
    return this.likes.some(like => like.user.toString() === userId.toString());
};

// Method to toggle like
announcementSchema.methods.toggleLike = function (userId) {
    const existingLikeIndex = this.likes.findIndex(like => like.user.toString() === userId.toString());

    if (existingLikeIndex > -1) {
        // Unlike
        this.likes.splice(existingLikeIndex, 1);
        return false;
    } else {
        // Like
        this.likes.push({ user: userId });
        return true;
    }
};

// Method to add comment
announcementSchema.methods.addComment = function (userId, content) {
    this.comments.push({
        author: userId,
        content: content
    });
};

// Method to check if user can edit/delete announcement
announcementSchema.methods.canUserModify = async function (userId, userRole) {
    // Author can always modify
    if (this.author.toString() === userId.toString()) {
        return true;
    }

    // System administrators can modify any announcement
    if (userRole === 'Administrator') {
        return true;
    }

    // Club-specific permission check
    try {
        const Club = mongoose.model('Club');
        const club = await Club.findById(this.club).populate('members.user', '_id');

        if (club) {
            // Club president can modify
            if (club.president && club.president.toString() === userId.toString()) {
                return true;
            }

            // Club officers can modify
            const userMembership = club.members.find(member =>
                member.user._id.toString() === userId.toString()
            );

            if (userMembership && ['President', 'Vice President', 'Officer', 'Secretary'].includes(userMembership.role)) {
                return true;
            }
        }
    } catch (error) {
        console.error('Error checking club permissions:', error);
    }

    // Club Admin role users can only modify if they are the president of this specific club
    if (userRole === 'Club Admin') {
        try {
            const Club = mongoose.model('Club');
            const club = await Club.findById(this.club);
            if (club && club.president && club.president.toString() === userId.toString()) {
                return true;
            }
        } catch (error) {
            console.error('Error checking club admin permissions:', error);
        }
    }

    return false;
};

// Pre-save middleware to handle scheduled announcements
announcementSchema.pre('save', function (next) {
    // If scheduled for future, set isActive to false
    if (this.scheduledFor && this.scheduledFor > new Date()) {
        this.isActive = false;
    }

    // Check if announcement has expired
    if (this.expiresAt && this.expiresAt < new Date()) {
        this.isActive = false;
    }

    next();
});

// Static method to get active announcements for a club
announcementSchema.statics.getActiveAnnouncements = function (clubId, options = {}) {
    const {
        page = 1,
        limit = 10,
        type,
        priority,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = options;

    let query = {
        club: clubId,
        isActive: true,
        $or: [
            { scheduledFor: { $exists: false } },
            { scheduledFor: { $lte: new Date() } }
        ]
    };

    if (type && type !== 'all') {
        query.type = type;
    }

    if (priority && priority !== 'all') {
        query.priority = priority;
    }

    const sort = {};
    if (sortBy === 'priority') {
        sort.isPinned = -1; // Pinned first
        sort.priority = sortOrder === 'asc' ? 1 : -1;
        sort.createdAt = -1; // Then by date
    } else {
        sort.isPinned = -1; // Pinned first
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    return this.find(query)
        .populate('author', 'name email major year')
        .populate('comments.author', 'name email')
        .populate('likes.user', 'name')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit);
};

module.exports = mongoose.model('Announcement', announcementSchema);
