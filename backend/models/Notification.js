const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  notificationType: { type: String, default: 'info' }, // 'info', 'success', 'warning', 'error'
  title: { type: String, required: true },
  message: { type: String, required: true },
  recipientRole: { type: String, required: true }, // 'admin', 'vendor', 'user'
  recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, targeted user
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
