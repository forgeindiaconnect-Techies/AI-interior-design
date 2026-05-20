const mongoose = require('mongoose');

const InstallationOrderSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  installationPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  scheduledDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Assigned', 'Installation Scheduled', 'Installation Started', 'Installation Completed'], 
    default: 'Assigned' 
  },
  proofImages: [{ type: String }],
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InstallationOrder', InstallationOrderSchema);
