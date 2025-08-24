const Notification = require("../models/Notification");

// Create notification
async function notifyUser(userId, message) {
  await Notification.create({ user: userId, message });
}

module.exports = { notifyUser };
