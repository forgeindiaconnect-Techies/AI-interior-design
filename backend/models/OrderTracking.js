const mongoose = require('mongoose');

const TrackingStageSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: String, enum: ['user', 'vendor', 'admin', 'system'], default: 'system' },
  note: { type: String, default: '' }
}, { _id: false });

const OrderTrackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  customerName: { type: String, default: '' },
  vendorName: { type: String, default: '' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'], default: 'UPI' },
  transactionId: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['Completed', 'Pending', 'Failed'], default: 'Completed' },
  orderStatus: { type: String, default: 'Awaiting Vendor Verification' },
  stages: [TrackingStageSchema],
  progressImages: [{ type: String }],
  expectedDeliveryDate: { type: Date },
  deliveryDetails: {
    partner: { type: String, default: '' },
    trackingId: { type: String, default: '' },
    notes: { type: String, default: '' }
  },
  installationDetails: {
    partner: { type: String, default: '' },
    scheduledDate: { type: Date },
    installationDate: { type: Date },
    installationTime: { type: String, default: '' },
    technicianName: { type: String, default: '' },
    technicianContact: { type: String, default: '' },
    installationAddress: { type: String, default: '' },
    expectedCompletionDate: { type: Date },
    installationStatus: { type: String, enum: ['', 'Scheduled', 'In Progress', 'Completed'], default: '' },
    notes: { type: String, default: '' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('OrderTracking', OrderTrackingSchema);