const cron = require('node-cron');
const Event = require('../models/Event');
const Club = require('../models/Club');
const User = require('../models/User');
const { notifyUser } = require('../utils/notifier');

function startNotificationScheduler() {
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

module.exports = { startNotificationScheduler };
