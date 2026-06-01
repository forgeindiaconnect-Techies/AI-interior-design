const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  orderType: { type: String, enum: ['product', 'custom_design'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Product ID or Quotation ID
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    enum: [
      'Request Submitted', 
      'Vendor Review', 
      'Budget Shared', 
      'User Approved', 
      'Quotation Sent',
      'Quotation Accepted',
      'Payment Completed',
      'Awaiting Vendor Verification',
      'Production Started',
      'Manufacturer Assigned',
      'Manufacturing Started',
      'Manufacturing', 
      'Quality Check', 
      'Delivery Assigned', 
      'Out for Delivery',
      'Installation Assigned', 
      'Installation Completed',
      'Completed',
      'Order Completed',
      'Cancelled'
    ], 
    default: 'Request Submitted' 
  },
  expectedDeliveryDate: { type: Date },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  installationPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
