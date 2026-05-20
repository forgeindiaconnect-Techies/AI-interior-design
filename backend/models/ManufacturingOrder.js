const mongoose = require('mongoose');

const ManufacturingOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  designDetails: { type: String, required: true },
  measurements: { type: String, required: true },
  materials: { type: String, required: true },
  budget: { type: Number, required: true },
  status: { 
    type: String, 
    enum: [
      'Pending',
      'Accepted', 
      'Material Checking', 
      'Production Started', 
      'In Progress', 
      'Quality Check', 
      'Ready for Delivery'
    ], 
    default: 'Pending' 
  },
  progressImages: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ManufacturingOrder', ManufacturingOrderSchema);
