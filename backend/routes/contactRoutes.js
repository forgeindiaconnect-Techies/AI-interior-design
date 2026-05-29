const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, updateMessageStatus } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to submit a contact form
router.route('/').post(submitMessage);

// Admin routes to view and update messages
router.route('/')
  .get(protect, admin, getMessages);

router.route('/:id/status')
  .put(protect, admin, updateMessageStatus);

module.exports = router;
