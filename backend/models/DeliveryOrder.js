const mongoose = require('mongoose');

const DeliveryOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  shippingAddress: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Assigned', 'Picked Up', 'Out for Delivery', 'Delivered'], 
    default: 'Assigned' 
  },
  trackingNotes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DeliveryOrder', DeliveryOrderSchema);
