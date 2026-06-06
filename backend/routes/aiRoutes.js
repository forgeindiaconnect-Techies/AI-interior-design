const express = require('express');
const router = express.Router();
const { generateAIImage } = require('../controllers/aiController');

// Route to handle AI image generation
router.post('/generate', generateAIImage);

module.exports = router;
