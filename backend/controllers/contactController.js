const ContactMessage = require('../models/ContactMessage');
const Notification = require('../models/Notification'); // For admin notifications (optional, but good)

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all fields' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message
    });

    // Create a notification for the admin (if a Notification model is being used)
    try {
      await Notification.create({
        user: null, // Global or admin specific
        title: 'New Contact Message',
        message: `New message from ${name} (${email})`,
        type: 'info',
        role: 'admin' // If you have role-based notifications
      });
    } catch (notifErr) {
      console.error('Failed to create admin notification for contact message:', notifErr);
    }

    res.status(201).json({
      success: true,
      data: contactMessage
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update contact message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    message.status = req.body.status;
    await message.save();

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
