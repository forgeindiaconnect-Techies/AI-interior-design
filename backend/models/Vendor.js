const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  businessType: { 
    type: String, 
    enum: ['seller', 'manufacturer', 'delivery', 'installation', 'designer'], 
    required: true 
  },
  description: { type: String },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  accountActivationStatus: { 
    type: String, 
    enum: ['Pending KYC', 'KYC Submitted', 'Deposit Pending', 'Under Review', 'Active', 'Rejected'], 
    default: 'Pending KYC' 
  },
  kycStatus: { type: String, enum: ['Pending', 'Submitted', 'Approved', 'Rejected'], default: 'Pending' },
  depositStatus: { type: String, enum: ['Pending', 'Paid', 'Verified', 'Failed'], default: 'Pending' },
  isActive: { type: Boolean, default: false },
  serviceAreas: [{ type: String }],
  specialization: { 
    type: String, 
    enum: ['Woodworks', 'Upholstery', 'Metal Fabrications', 'Modular Cabinets', 'Glass Works'], 
    default: 'Woodworks' 
  },
  monthlyCapacity: { type: Number, default: 50 },
  workloadLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Maxed Out'], 
    default: 'Medium' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);
