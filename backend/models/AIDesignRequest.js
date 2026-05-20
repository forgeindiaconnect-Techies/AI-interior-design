const mongoose = require('mongoose');

const AIDesignRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomType: { type: String, required: true }, // e.g., Kitchen, Living Room, Bedroom
  originalImage: { type: String, required: true },
  generatedImage: { type: String }, // Stable Diffusion output
  stylePreference: { type: String, default: 'Modern Minimalist' },
  assignedVendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  orderStatus: { 
    type: String, 
    enum: ['Not Converted', 'Pending Manufacturing', 'In Production', 'Dispatched', 'Completed'], 
    default: 'Not Converted' 
  },
  aiSuggestion: {
    furniture: [{ type: String }],
    materials: [{ type: String }],
    colorPalette: [{ type: String }],
    budgetEstimate: { type: Number }
  },
  status: { 
    type: String, 
    enum: ['pending', 'generated', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIDesignRequest', AIDesignRequestSchema);
