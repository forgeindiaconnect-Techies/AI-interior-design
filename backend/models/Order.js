const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  orderType: { type: String, enum: ['product', 'custom_design'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Product ID or Quotation ID
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: { 
    type: String, 
    default: 'Pending Confirmation' 
  },
  timeline: [{
    status: { type: String, required: true },
    updatedBy: { type: String, enum: ['system', 'vendor', 'admin'], default: 'system' },
    updatedAt: { type: Date, default: Date.now }
  }],
  expectedDeliveryDate: { type: Date },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  installationPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  shippingAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
