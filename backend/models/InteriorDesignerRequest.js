const mongoose = require('mongoose');

const InteriorDesignerRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String, required: true },
  budget: { type: Number },
  status: { type: String, enum: ['pending', 'assigned', 'completed'], default: 'pending' },
  assignedDesignerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InteriorDesignerRequest', InteriorDesignerRequestSchema);
