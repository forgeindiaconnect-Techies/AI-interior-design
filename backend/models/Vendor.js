const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
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
    enum: ['Pending Verification', 'Verification Submitted', 'Under Review', 'Store Setup Pending', 'Active', 'Rejected', 'Suspended'], 
    default: 'Pending Verification' 
  },
  verificationStatus: { type: String, enum: ['Pending', 'Submitted', 'Under Review', 'Approved', 'Rejected'], default: 'Pending' },
  storeSetupStatus: { type: String, enum: ['Pending', 'Submitted', 'Approved', 'Rejected'], default: 'Pending' },
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
  businessCategory: {
    type: String,
    enum: ['Furniture', 'Decor', 'Lighting', 'Interior Design', 'Modular Kitchen', 'Custom Furniture', 'Other']
  },
  yearsOfExperience: { type: Number },
  websiteUrl: { type: String },
  socialMediaUrl: { type: String },
  documents: {
    registrationCert: { type: String },
    idProof: { type: String },
    profilePhoto: { type: String },
    gstCert: { type: String },
    companyLogo: { type: String },
    portfolioImages: [{ type: String }],
    bankVerification: { type: String }
  },
  documentVerificationStatus: {
    type: String,
    enum: ['Pending Verification', 'Approved', 'Rejected'],
    default: 'Pending Verification'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);
