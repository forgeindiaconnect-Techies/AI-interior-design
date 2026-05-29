const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, updateMessageStatus } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to submit a contact form
router.route('/').post(submitMessage);

// Admin routes to view and update messages
router.route('/')
  .get(protect, authorize('admin'), getMessages);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateMessageStatus);

module.exports = router;
