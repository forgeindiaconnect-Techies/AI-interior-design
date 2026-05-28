const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Sync endpoints
router.get('/sync', chatController.getSyncedChat);
router.put('/sync', chatController.updateSyncedChat);

module.exports = router;
