const Order = require('../models/Order');
const Quotation = require('../models/Quotation');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const DeliveryOrder = require('../models/DeliveryOrder');
const InstallationOrder = require('../models/InstallationOrder');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const SupportTicket = require('../models/SupportTicket');
const Notification = require('../models/Notification');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const newOrder = { _id: 'ord_' + Date.now(), ...req.body, orderStatus: 'Request Submitted', paymentStatus: 'pending', createdAt: new Date().toISOString() };
      return res.status(201).json({ success: true, data: newOrder });
    }

    const { vendorId, orderType, referenceId, totalAmount, shippingAddress } = req.body;
    const order = await Order.create({ userId: req.user.id, vendorId, orderType, referenceId, totalAmount, shippingAddress, orderStatus: 'Request Submitted' });

    await Notification.create({ userId: req.user.id, message: 'Order placed successfully.' });
    await Notification.create({ isAdmin: true, message: `New order placed.` });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const mockOrders = [
        { _id: 'ord_101', orderType: 'product', totalAmount: 1299, paymentStatus: 'pending', orderStatus: 'Request Submitted', vendorId: { companyName: 'Artisan Workshop' }, createdAt: new Date().toISOString() },
        { _id: 'ord_102', orderType: 'custom_design', totalAmount: 4850, paymentStatus: 'paid', orderStatus: 'Manufacturing', vendorId: { companyName: 'Luxury Living Inc' }, createdAt: new Date().toISOString() }
      ];
      return res.status(200).json({ success: true, data: mockOrders });
    }

    const orders = await Order.find({ userId: req.user.id }).populate('vendorId', 'companyName').sort('-createdAt');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Quotation Budget
// @route   POST /api/orders/approve-budget
// @access  Private
exports.approveQuotation = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const newOrder = { _id: 'ord_' + Date.now(), orderType: 'custom_design', totalAmount: 4850, paymentStatus: 'pending', orderStatus: 'User Approved', vendorId: { companyName: 'Artisan Workshop' }, createdAt: new Date().toISOString() };
      return res.status(200).json({ success: true, data: newOrder });
    }

    const { quotationId, shippingAddress } = req.body;
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });

    quotation.status = 'approved';
    await quotation.save();

    const order = await Order.create({ userId: req.user.id, vendorId: quotation.vendorId, orderType: 'custom_design', referenceId: quotation._id, totalAmount: quotation.budgetAmount, shippingAddress, orderStatus: 'User Approved' });

    await Notification.create({ userId: req.user.id, message: 'Quotation approved. Order confirmed.' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Manufacturing Status
// @route   PUT /api/orders/manufacturing/:id
// @access  Private (Manufacturer)
exports.updateManufacturingStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: { _id: req.params.id, status: req.body.status } });
    }

    const { status, progressImage } = req.body;
    const mOrder = await ManufacturingOrder.findById(req.params.id);
    if (!mOrder) return res.status(404).json({ success: false, message: 'Manufacturing order not found' });

    mOrder.status = status;
    if (progressImage) mOrder.progressImages.push(progressImage);
    await mOrder.save();

    const order = await Order.findById(mOrder.orderId);
    if (order) {
      if (status === 'Ready for Delivery') {
        order.orderStatus = 'Quality Check';
        await Notification.create({ isAdmin: true, message: `Manufacturing completed.` });
      }
      await order.save();
    }
    res.status(200).json({ success: true, data: mOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Delivery Status
// @route   PUT /api/orders/delivery/:id
// @access  Private (Delivery Partner)
exports.updateDeliveryStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: { _id: req.params.id, status: req.body.status } });
    }

    const { status, trackingNotes } = req.body;
    const dOrder = await DeliveryOrder.findById(req.params.id);
    if (!dOrder) return res.status(404).json({ success: false, message: 'Delivery order not found' });

    dOrder.status = status;
    if (trackingNotes) dOrder.trackingNotes = trackingNotes;
    await dOrder.save();

    const order = await Order.findById(dOrder.orderId);
    if (order) {
      if (status === 'Picked Up') order.orderStatus = 'Delivery Assigned';
      if (status === 'Delivered') order.orderStatus = 'Installation Assigned';
      await order.save();
    }
    res.status(200).json({ success: true, data: dOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Installation Status
// @route   PUT /api/orders/installation/:id
// @access  Private (Installation Partner)
exports.updateInstallationStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: { _id: req.params.id, status: req.body.status } });
    }

    const { status, proofImage, notes } = req.body;
    const iOrder = await InstallationOrder.findById(req.params.id);
    if (!iOrder) return res.status(404).json({ success: false, message: 'Installation order not found' });

    iOrder.status = status;
    if (proofImage) iOrder.proofImages.push(proofImage);
    if (notes) iOrder.notes = notes;
    await iOrder.save();

    const order = await Order.findById(iOrder.orderId);
    if (order) {
      if (status === 'Installation Completed') order.orderStatus = 'Completed';
      await order.save();
    }
    res.status(200).json({ success: true, data: iOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Payment
// @route   POST /api/orders/payment
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(201).json({ success: true, data: { _id: 'pay_' + Date.now(), amount: req.body.amount, status: 'success' } });
    }

    const { orderId, amount, transactionId, paymentMethod } = req.body;
    const payment = await Payment.create({ orderId, userId: req.user.id, amount, transactionId, paymentMethod, status: 'success' });
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Review/Rating
// @route   POST /api/orders/review
// @access  Private
exports.createReview = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(201).json({ success: true, data: { _id: 'rev_' + Date.now(), ...req.body } });
    }

    const { vendorId, productId, rating, comment } = req.body;
    const review = await Review.create({ userId: req.user.id, vendorId, productId, rating, comment });
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Support Ticket
// @route   POST /api/orders/ticket
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      global.mockTickets = global.mockTickets || [
        {
          _id: 't_1',
          subject: 'Delivery Delay Inquiry',
          message: "The assigned delivery partner hasn't updated tracking for 2 days.",
          status: 'open',
          userId: { _id: 'u_mock_1', name: 'John Doe', email: 'john@example.com' },
          createdAt: new Date(Date.now() - 3600000 * 24 * 1)
        }
      ];
      const newTicket = {
        _id: 'tick_' + Date.now(),
        userId: req.user ? { _id: req.user.id, name: req.user.name, email: req.user.email } : { _id: 'u_mock_1', name: 'John Doe', email: 'john@example.com' },
        subject,
        message,
        status: 'open',
        createdAt: new Date()
      };
      global.mockTickets.unshift(newTicket);
      return res.status(201).json({ success: true, data: newTicket });
    }

    const ticket = await SupportTicket.create({ userId: req.user.id, subject, message });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all synchronized prototype orders
// @route   GET /api/orders/sync
// @access  Public (for prototype)
exports.getSyncedOrders = (req, res) => {
  global.mockOrders = global.mockOrders || [];
  res.status(200).json({ success: true, data: global.mockOrders });
};

// @desc    Update or create a synchronized prototype order
// @route   PUT /api/orders/sync
// @access  Public (for prototype)
exports.updateSyncedOrder = (req, res) => {
  global.mockOrders = global.mockOrders || [];
  const updatedOrders = req.body.orders;
  
  if (Array.isArray(updatedOrders)) {
    global.mockOrders = updatedOrders;
  }
  
  res.status(200).json({ success: true, data: global.mockOrders });
};
