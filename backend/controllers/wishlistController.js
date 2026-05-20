const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose');

// Mock Wishlist
let mockWishlist = [];

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: mockWishlist });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const idx = mockWishlist.findIndex(id => id === productId);
      if (idx > -1) mockWishlist.splice(idx, 1);
      else mockWishlist.push(productId);
      return res.status(200).json({ success: true, data: mockWishlist });
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, products: [] });
    }

    const idx = wishlist.products.indexOf(productId);
    if (idx > -1) {
      wishlist.products.splice(idx, 1);
    } else {
      wishlist.products.push(productId);
    }
    
    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
