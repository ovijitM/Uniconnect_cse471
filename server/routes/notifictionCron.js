const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { notifyUser } = require('../utils/notifier');

// GET endpoint to fetch notifications for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(req.query.limit) || 50);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT endpoint to mark notifications as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Start the notification scheduler
const startNotificationScheduler = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running notification scheduler...');

    try {
      const now = new Date();

      // 1. Notify about event registration deadlines coming up in 24 hours
      const deadlineThreshold = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
      const eventsWithDeadlineSoon = await Event.find({
        registrationDeadline: { $gte: now, $lte: deadlineThreshold },
        isRegistrationRequired: true,
        status: 'Published'
      }).populate('attendees.user').populate('club');

      for (const event of eventsWithDeadlineSoon) {
        // Notify all attendees who are registered but haven't been notified yet
        for (const attendee of event.attendees) {
          // Optional: Check if notification for this deadline was already sent (implement flag if needed)
          const message = `Reminder: Registration deadline for event "${event.title}" is approaching on ${event.registrationDeadline.toLocaleString()}.`;
          await notifyUser(attendee.user._id, message);
        }
      }

      // 2. Notify about events starting soon (e.g., 1 hour before start)
      const startThreshold = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
      const upcomingEvents = await Event.find({
        startDate: { $gte: now, $lte: startThreshold },
        status: 'Published'
      }).populate('attendees.user').populate('club');

      for (const event of upcomingEvents) {
        for (const attendee of event.attendees) {
          const message = `Reminder: Event "${event.title}" is starting soon at ${event.startTime} in ${event.venue}.`;
          await notifyUser(attendee.user._id, message);
        }
      }

      // 3. Notify club members about new announcements (for example, recent announcements from last hour)
      const Announcement = require('../models/Announcement');
      const recentAnnouncements = await Announcement.find({
        createdAt: { $gte: new Date(now.getTime() - 60 * 60 * 1000) } // last 1 hour
      }).populate('club');

      for (const announcement of recentAnnouncements) {
        if (!announcement.club) continue;
        // Get club members
        const club = await Club.findById(announcement.club._id).populate('members.user');
        for (const member of club.members) {
          const message = `New announcement from ${club.name}: "${announcement.title}"`;
          await notifyUser(member.user._id, message);
        }
      }

      console.log('Notification scheduler finished.');
    } catch (error) {
      console.error('Error in notification scheduler:', error);
    }
  });
}

// Start the scheduler when this module is loaded
startNotificationScheduler();

// Route to manually trigger notifications (for testing/debugging)
router.post('/trigger', async (req, res) => {
  try {
    await startNotificationScheduler();
    res.json({ message: 'Notifications triggered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to trigger notifications' });
  }
});

module.exports = router;
