const mongoose = require('mongoose');

const GenerationHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIDesignRequest', required: true },
  uploadedImage: { type: String, required: true },
  generatedImage: { type: String, required: true },
  roomType: { type: String, required: true },
  designStyle: { type: String, default: 'Modern' },
  promptUsed: { type: String },
  seed: { type: Number, required: true },
  variationPrompt: { type: String },
  versionNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GenerationHistory', GenerationHistorySchema);
