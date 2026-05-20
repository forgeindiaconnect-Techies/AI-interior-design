const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Mock Cart Storage
let mockCart = {
  items: [],
  subtotal: 0
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: mockCart });
    }

    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], subtotal: 0 });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      // Mock logic
      const existing = mockCart.items.find(i => i.productId === productId);
      if (existing) {
        existing.quantity += (quantity || 1);
      } else {
        mockCart.items.push({
          productId,
          quantity: quantity || 1,
          priceAtTime: req.body.price || 100 // fallback
        });
      }
      mockCart.subtotal = mockCart.items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);
      return res.status(200).json({ success: true, data: mockCart });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], subtotal: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += (quantity || 1);
    } else {
      cart.items.push({ productId, quantity: quantity || 1, priceAtTime: product.price });
    }

    cart.subtotal = cart.items.reduce((acc, item) => acc + (item.priceAtTime * item.quantity), 0);
    await cart.save();
    
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      mockCart = { items: [], subtotal: 0 };
      return res.status(200).json({ success: true, data: mockCart });
    }

    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], subtotal: 0 });
    res.status(200).json({ success: true, data: { items: [], subtotal: 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
