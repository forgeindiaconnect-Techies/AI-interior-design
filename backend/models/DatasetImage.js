const mongoose = require('mongoose');

const DatasetImageSchema = new mongoose.Schema({
  roomType: { type: String, required: true }, // 'Bathroom', 'Bedroom', 'Kitchen', 'Living Room'
  style: { type: String, required: true }, // 'boho', 'industrial', 'minimalist', 'modern', 'scandinavian'
  filename: { type: String, required: true },
  url: { type: String, required: true }, // e.g. '/dataset/bathroom/modern/bathroom_modern_0.jpg'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DatasetImage', DatasetImageSchema);
