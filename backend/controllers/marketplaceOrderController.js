const MarketplaceOrder = require('../models/MarketplaceOrder');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Mock Orders
let mockOrders = [];

// @desc    Create new marketplace order from cart
// @route   POST /api/marketplace-orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, items, totalAmount } = req.body;
    


    // Actual DB Logic
    const order = await MarketplaceOrder.create({
      userId: req.user.id,
      items: items,
      subtotal: totalAmount,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], subtotal: 0 });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's marketplace orders
// @route   GET /api/marketplace-orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {


    const orders = await MarketplaceOrder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
