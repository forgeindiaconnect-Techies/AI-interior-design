const mongoose = require('mongoose');

const ManualDesignRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomType: { type: String, required: true },
  style: { type: String, required: true },
  budget: { type: String, required: true },
  size: { type: String, required: true },
  materials: { type: String, required: false },
  requirements: { type: String, required: false },
  referenceImages: [{ type: String }],
  ownMaterialsAvailable: { type: String, enum: ['Yes', 'No'], default: 'No' },
  materialDetails: { type: String },
  materialQuantity: { type: String },
  materialImages: [{ type: String }],
  pickupAddress: { type: String },
  materialPickupNeeded: { type: String, enum: ['Yes', 'No'], default: 'No' },
  timeline: { type: String },
  needDesignerHelp: { type: String, enum: ['Yes', 'No'], default: 'No' },
  serviceAddress: { type: String },
  vendorPreference: { type: String, enum: ['Any Vendor', 'Nearby Vendor', 'Top Rated Vendor'], default: 'Any Vendor' },
  quotationType: { type: String, enum: ['Fixed Budget', 'Open Bidding'], default: 'Fixed Budget' },
  status: { 
    type: String, 
    enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Quotation Sent', 'Approved', 'Production Started', 'Manufacturing', 'Ready for Delivery', 'Delivered', 'Installation Completed'], 
    default: 'Submitted' 
  },
  quotationAmount: { type: String },
  quotationMaterials: { type: String },
  quotationTime: { type: String },
  originalImage: { type: String },
  generatedImage: { type: String },
  aiSuggestion: {
    furniture: [{ type: String }],
    materials: [{ type: String }],
    colorPalette: [{ type: String }],
    budgetEstimate: { type: Number }
  },
  requestType: { type: String, enum: ['Manual Design', 'Interior Designer Help', 'AI Generated'], default: 'Manual Design' },
  assignedVendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  assignedDesignerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ManualDesignRequest', ManualDesignRequestSchema);
