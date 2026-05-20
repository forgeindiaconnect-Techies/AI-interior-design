const mongoose = require('mongoose');

const QuotationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  designType: { type: String, enum: ['ai', 'manual'], required: true },
  designRequestId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Refers to AIDesignRequest or ManualDesignRequest
  budgetAmount: { type: Number, required: true },
  materialsBreakdown: { type: String, required: true },
  estimatedTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quotation', QuotationSchema);
