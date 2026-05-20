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
    
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const newOrder = {
        _id: 'm_ord_' + Date.now(),
        userId: req.user ? req.user.id : 'user_mock',
        items: items || [],
        totalAmount: totalAmount || 0,
        shippingAddress: shippingAddress || '123 Fake St',
        orderStatus: 'Order Placed',
        createdAt: new Date()
      };
      mockOrders.push(newOrder);
      return res.status(201).json({ success: true, data: newOrder });
    }

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
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, count: mockOrders.length, data: mockOrders });
    }

    const orders = await MarketplaceOrder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
