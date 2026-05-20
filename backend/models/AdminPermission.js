const mongoose = require('mongoose');

const AdminPermissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  roleName: { type: String, default: 'Moderator' },
  permissions: {
    userManagement: { type: Boolean, default: false },
    vendorKYC: { type: Boolean, default: false },
    ordersWorkflow: { type: Boolean, default: false },
    supportTickets: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false },
    notifications: { type: Boolean, default: false }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminPermission', AdminPermissionSchema);
