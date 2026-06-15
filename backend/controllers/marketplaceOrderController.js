const MarketplaceOrder = require('../models/MarketplaceOrder');
const Cart = require('../models/Cart');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Create new marketplace order from cart
// @route   POST /api/marketplace-orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { shippingAddress, items, subtotal, tax, shippingFee, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const order = await MarketplaceOrder.create({
      userId: req.user.id,
      items: items,
      subtotal: subtotal || totalAmount,
      tax: tax || 0,
      shippingFee: shippingFee || 0,
      totalAmount: totalAmount,
      shippingAddress: shippingAddress || 'Default Address',
      paymentStatus: 'paid',
      orderStatus: 'Pending Confirmation',
      timeline: [{ status: 'Pending Confirmation', updatedBy: 'system' }]
    });

    // Create payment record
    const transactionId = 'TXN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    await Payment.create({
      marketplaceOrderId: order._id,
      userId: req.user.id,
      amount: totalAmount,
      paymentMethod: req.body.paymentMethod || 'Card',
      transactionId: transactionId,
      status: 'success'
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [], subtotal: 0 });

    // Notify each vendor about the order (send to vendor's user account)
    const uniqueVendorIds = [...new Set(items.map(i => i.vendorId.toString()))];
    for (const vendorId of uniqueVendorIds) {
      const vendor = await Vendor.findById(vendorId).populate('userId', '_id');
      if (vendor && vendor.userId) {
        await Notification.create({
          userId: vendor.userId._id,
          message: `New marketplace order received from a customer. Order #${order._id.toString().slice(-6)}.`,
          type: 'success'
        });
      }
    }

    // Notify admin
    await Notification.create({
      isAdmin: true,
      message: `New marketplace purchase placed: Order #${order._id.toString().slice(-6)} for $${totalAmount}.`,
      type: 'info'
    });

    const populatedOrder = await MarketplaceOrder.findById(order._id)
      .populate('items.productId')
      .populate('userId', 'name email');

    res.status(201).json({ success: true, data: populatedOrder, payment: { transactionId, amount: totalAmount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's marketplace orders
// @route   GET /api/marketplace-orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await MarketplaceOrder.find({ userId: req.user.id })
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single marketplace order by ID
// @route   GET /api/marketplace-orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await MarketplaceOrder.findById(req.params.id)
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .populate('userId', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get marketplace orders for a vendor
// @route   GET /api/marketplace-orders/vendor
// @access  Private (Vendor)
exports.getVendorOrders = async (req, res) => {
  try {
    let vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor && req.user.role === 'admin') {
      const User = require('../models/User');
      const dbUser = await User.findById(req.user.id);
      vendor = await Vendor.create({
        userId: req.user.id,
        companyName: dbUser?.name ? `${dbUser.name}'s Store` : 'Admin Store',
        businessType: 'seller',
        isVerified: true,
        accountActivationStatus: 'Active',
        verificationStatus: 'Approved',
        storeSetupStatus: 'Approved',
        isActive: true,
      });
    }
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    const orders = await MarketplaceOrder.find({ 'items.vendorId': vendor._id })
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all marketplace orders (Admin)
// @route   GET /api/marketplace-orders/all
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await MarketplaceOrder.find({})
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update marketplace order status (Vendor/Admin)
// @route   PUT /api/marketplace-orders/:id/status
// @access  Private (Vendor/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'Pending Confirmation', 'Processing', 'Pending Dispatch',
      'Dispatched', 'Out For Delivery', 'Delivered', 'Completed', 'Cancelled'
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await MarketplaceOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization: vendor can only update their own orders
    if (req.user.role === 'vendor' || req.user.role === 'delivery' || req.user.role === 'installation') {
      const vendor = await Vendor.findOne({ userId: req.user.id });
      if (!vendor) return res.status(403).json({ success: false, message: 'Vendor not found' });
      const hasItem = order.items.some(i => i.vendorId.toString() === vendor._id.toString());
      if (!hasItem && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
      }
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    // Push new status to timeline
    const updatedByRole = req.user.role === 'vendor' ? 'vendor' : req.user.role === 'admin' ? 'admin' : 'system';
    order.timeline.push({ status, updatedBy: updatedByRole, updatedAt: new Date() });

    await order.save();

    // Notify user about status change with specific messages
    let userMessage = `Your marketplace order #${order._id.toString().slice(-6)} status updated: ${oldStatus} → ${status}.`;
    if (status === 'Processing') userMessage = "Your order is now being processed.";
    else if (status === 'Pending Dispatch') userMessage = "Your order is ready for dispatch.";
    else if (status === 'Dispatched') userMessage = "Your order has been dispatched.";
    else if (status === 'Out For Delivery') userMessage = "Your order is out for delivery.";
    else if (status === 'Delivered') userMessage = "Your order has been delivered.";
    else if (status === 'Completed') userMessage = "Order completed successfully.";

    await Notification.create({
      userId: order.userId,
      message: userMessage,
      type: 'info'
    });

    // Notify admin on significant status changes
    if (['Delivered', 'Completed', 'Cancelled'].includes(status)) {
      await Notification.create({
        isAdmin: true,
        message: `Marketplace order #${order._id.toString().slice(-6)} is now ${status}.`,
        type: 'info'
      });
    }

    const populatedOrder = await MarketplaceOrder.findById(order._id)
      .populate('items.productId')
      .populate('items.vendorId', 'companyName')
      .populate('userId', 'name email');

    res.status(200).json({ success: true, data: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
