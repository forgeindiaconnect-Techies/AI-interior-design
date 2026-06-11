const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Sync endpoints
router.get('/sync', chatController.getSyncedChat);
router.put('/sync', chatController.updateSyncedChat);

// Catch-all for Vercel AI agent chat stream requests
router.all('/:chatId/stream', (req, res) => {
  res.status(404).json({ success: false, message: 'Chat stream not available', error: 'not_found' });
});

module.exports = router;
