const Notification = require('../models/Notification');
const mongoose = require('mongoose');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const mockNotifs = [
        { _id: 'notif_1', message: 'Photo uploaded successfully. AI design is ready!', isRead: false, createdAt: new Date().toISOString() },
        { _id: 'notif_2', message: 'Vendor Artisan Workshop shared a budget quotation.', isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { _id: 'notif_3', message: 'Manufacturing started for your order #ord_102.', isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: 'notif_4', message: 'Delivery partner assigned for your shipment.', isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() }
      ];
      return res.status(200).json({ success: true, data: mockNotifs });
    }

    const filter = req.user.role === 'admin' ? { isAdmin: true } : { userId: req.user.id };
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
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: { _id: req.params.id, isRead: true } });
    }

    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
