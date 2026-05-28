// backend/controllers/chatController.js
// Global in-memory storage for prototype sync
global.mockSharedChat = global.mockSharedChat || [];

exports.getSyncedChat = (req, res) => {
  try {
    res.status(200).json({ success: true, data: global.mockSharedChat });
  } catch (error) {
    console.error('Error fetching synced chat:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSyncedChat = (req, res) => {
  try {
    const { chat } = req.body;
    if (chat && Array.isArray(chat)) {
      global.mockSharedChat = chat;
      res.status(200).json({ success: true, message: 'Chat synced successfully', data: global.mockSharedChat });
    } else {
      res.status(400).json({ success: false, message: 'Invalid chat data' });
    }
  } catch (error) {
    console.error('Error updating synced chat:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
