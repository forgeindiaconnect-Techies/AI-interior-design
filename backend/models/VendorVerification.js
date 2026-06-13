const mongoose = require('mongoose');

const VendorVerificationSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
  businessName: { type: String },
  ownerName: { type: String },
  phone: { type: String },
  email: { type: String },
  gstNumber: { type: String },
  panNumber: { type: String },
  businessAddress: { type: String },
  idProofUrl: { type: String },
  addressProofUrl: { type: String },
  gstCertificateUrl: { type: String },
  businessLicenseUrl: { type: String },
  bankDetails: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String }
  },
  status: {
    type: String,
    enum: ['Not Submitted', 'Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Not Submitted'
  },
  adminRemarks: { type: String, default: '' },
  submittedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorVerification', VendorVerificationSchema);
