const mongoose = require('mongoose');

const SecurityDepositSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true, default: 25000 },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Verified', 'Failed'], default: 'Pending' },
  transactionId: { type: String },
  paymentDate: { type: Date },
  adminRemarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SecurityDeposit', SecurityDepositSchema);
