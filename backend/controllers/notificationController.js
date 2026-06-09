const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {


    const filter = {
      $or: [
        { recipientUser: req.user.id },
        { recipientRole: req.user.role, recipientUser: null },
        { recipientRole: req.user.role, recipientUser: { $exists: false } }
      ]
    };
    const notifications = await Notification.find(filter).sort('-createdAt');
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {


    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { returnDocument: 'after' });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
