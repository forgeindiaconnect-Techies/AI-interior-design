const Vendor = require('../models/Vendor');
const ManualDesignRequest = require('../models/ManualDesignRequest');
const Quotation = require('../models/Quotation');
const Order = require('../models/Order');
const ManufacturingOrder = require('../models/ManufacturingOrder');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { mockManualDesigns } = require('./designController');
const VendorVerification = require('../models/VendorVerification');

// In-memory mock states for Demo Mode
let mockVerification = {};
let mockStoreSetup = {};

// @desc    Get vendor profile & stats
// @route   GET /api/vendor/profile
// @access  Private (Vendor)
exports.getVendorProfile = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({
        success: true,
        data: {
          vendor: {
            _id: 'mock_vendor_id_123',
            companyName: 'Artisan Furniture Ltd',
            businessType: req.user.role === 'vendor' ? 'seller' : req.user.role,
            isVerified: true
          },
          stats: { totalOrders: 15, totalQuotations: 8, revenue: 24500 }
        }
      });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    const orders = await Order.find({ vendorId: vendor._id });
    const quotations = await Quotation.find({ vendorId: vendor._id });

    res.status(200).json({ 
      success: true, 
      data: {
        vendor,
        stats: {
          totalOrders: orders.length, totalQuotations: quotations.length,
          revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((acc, o) => acc + o.totalAmount, 0)
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get custom design requests assigned to vendor
// @route   GET /api/vendor/requests
// @access  Private (Vendor)
exports.getCustomRequests = async (req, res) => {
  try {
    let requests = [];
    if (!global.MOCK_DB && mongoose.connection.readyState === 1) {
      try {
        requests = await ManualDesignRequest.find({}).populate('userId', 'name email phone').sort('-createdAt').lean();
      } catch (err) {
        console.error('DB fetch failed in getCustomRequests:', err);
      }
    }

    const merged = [...mockManualDesigns];
    requests.forEach(r => {
      if (!merged.some(m => m._id.toString() === r._id.toString())) {
        merged.push(r);
      }
    });

    res.status(200).json({ success: true, data: merged });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send budget quotation to user
// @route   POST /api/vendor/quotations
// @access  Private (Vendor)
exports.sendQuotation = async (req, res) => {
  try {
    const { userId, designType, designRequestId, budgetAmount, materialsBreakdown, estimatedTime } = req.body;
    
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const idx = mockManualDesigns.findIndex(m => m._id === designRequestId);
      if (idx !== -1) {
        mockManualDesigns[idx].status = 'Quotation Sent';
      }
      return res.status(201).json({ success: true, data: { _id: 'quote_' + Date.now(), ...req.body, status: 'pending' } });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    const quotation = await Quotation.create({ vendorId: vendor._id, userId, designType, designRequestId, budgetAmount, materialsBreakdown, estimatedTime, status: 'pending' });
    if (designType === 'manual') await ManualDesignRequest.findByIdAndUpdate(designRequestId, { status: 'Quotation Sent' });

    await Notification.create({ userId, message: `Vendor ${vendor.companyName} shared a budget quotation.` });
    await Notification.create({ isAdmin: true, message: `Quotation sent to user by vendor.` });

    res.status(201).json({ success: true, data: quotation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suggest another vendor
// @route   POST /api/vendor/suggest-vendor
// @access  Private (Vendor)
exports.suggestVendor = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, message: 'Forwarded to suggested vendor successfully' });
    }

    const { requestId, suggestedVendorId, note } = req.body;
    const suggestedVendor = await Vendor.findById(suggestedVendorId);
    const request = await ManualDesignRequest.findById(requestId);
    if (!suggestedVendor || !request) return res.status(404).json({ success: false, message: 'Vendor or Request not found' });

    request.assignedVendorId = suggestedVendorId;
    await request.save();
    await Notification.create({ userId: request.userId, message: `Your design request was forwarded.` });
    res.status(200).json({ success: true, message: 'Forwarded to suggested vendor successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forward custom order to manufacturer
// @route   POST /api/vendor/forward-manufacturer
// @access  Private (Vendor)
exports.forwardToManufacturer = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(201).json({ success: true, data: { _id: 'mfg_' + Date.now(), ...req.body, status: 'Pending' } });
    }

    const { orderId, manufacturerId, designDetails, measurements, materials, budget } = req.body;
    const manufacturingOrder = await ManufacturingOrder.create({ orderId, manufacturerId, designDetails, measurements, materials, budget, status: 'Pending' });

    const order = await Order.findById(orderId);
    if (order) {
      order.manufacturerId = manufacturerId;
      order.orderStatus = 'Manufacturing';
      await order.save();
      await Notification.create({ userId: order.userId, message: 'Manufacturing started for your order.' });
    }

    await Notification.create({ isAdmin: true, message: `Manufacturer assigned for order ${orderId}.` });
    res.status(201).json({ success: true, data: manufacturingOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept design request
// @route   POST /api/vendor/requests/:id/accept
// @access  Private (Vendor)
exports.acceptRequest = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const idx = mockManualDesigns.findIndex(m => m._id === req.params.id);
      if (idx !== -1) mockManualDesigns[idx].status = 'Vendor Review';
      return res.status(200).json({ success: true, message: 'Request accepted successfully' });
    }

    const request = await ManualDesignRequest.findByIdAndUpdate(req.params.id, { status: 'Vendor Review' }, { new: true });
    if (request) {
      await Notification.create({ userId: request.userId, message: `Vendor accepted your design request and is reviewing it.` });
    }
    res.status(200).json({ success: true, message: 'Request accepted successfully', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject design request
// @route   POST /api/vendor/requests/:id/reject
// @access  Private (Vendor)
exports.rejectRequest = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const idx = mockManualDesigns.findIndex(m => m._id === req.params.id);
      if (idx !== -1) mockManualDesigns[idx].status = 'Rejected';
      return res.status(200).json({ success: true, message: 'Request rejected' });
    }

    const request = await ManualDesignRequest.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
    if (request) {
      await Notification.create({ userId: request.userId, message: `Vendor rejected your design request.` });
    }
    res.status(200).json({ success: true, message: 'Request rejected', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Business Verification details
// @route   POST /api/vendor/verification
// @access  Private (Vendor)
exports.submitVerification = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const existing = mockVerification[req.user.id];
      if (existing && (existing.status === 'Approved' || existing.status === 'Under Review')) {
        return res.status(409).json({ success: false, message: 'Verification already ' + existing.status.toLowerCase() + '. Cannot resubmit.' });
      }
      mockVerification[req.user.id] = {
        ...req.body,
        status: 'Pending',
        submittedAt: new Date(),
        updatedAt: new Date()
      };
      return res.status(201).json({ success: true, message: 'Verification details submitted successfully', data: mockVerification[req.user.id] });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    let verification = await VendorVerification.findOne({ vendorId: vendor._id });

    if (verification && (verification.status === 'Approved' || verification.status === 'Under Review')) {
      return res.status(409).json({ success: false, message: 'Verification already ' + verification.status.toLowerCase() + '. Cannot resubmit.' });
    }

    const fields = {
      businessName: req.body.businessName,
      ownerName: req.body.ownerName,
      phone: req.body.phone,
      email: req.body.email,
      gstNumber: req.body.gstNumber,
      panNumber: req.body.panNumber,
      businessAddress: req.body.businessAddress,
      idProofUrl: req.body.idProofUrl,
      addressProofUrl: req.body.addressProofUrl,
      gstCertificateUrl: req.body.gstCertificateUrl,
      businessLicenseUrl: req.body.businessLicenseUrl,
      bankDetails: req.body.bankDetails,
      status: 'Pending',
      adminRemarks: '',
      submittedAt: new Date(),
      updatedAt: new Date()
    };

    if (verification) {
      Object.assign(verification, fields);
      await verification.save();
    } else {
      verification = await VendorVerification.create({ vendorId: vendor._id, ...fields });
    }

    vendor.verificationStatus = 'Submitted';
    vendor.accountActivationStatus = 'Verification Submitted';
    await vendor.save();

    await Notification.create({ isAdmin: true, message: Vendor  submitted business verification details. });

    res.status(201).json({ success: true, message: 'Verification details submitted successfully', data: verification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Business Verification status
// @route   GET /api/vendor/verification
// @access  Private (Vendor)
exports.getVerificationStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      const data = mockVerification[req.user.id] || { status: 'Not Submitted' };
      return res.status(200).json({ success: true, data });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const verification = await VendorVerification.findOne({ vendorId: vendor._id });
    res.status(200).json({ success: true, data: verification || { status: 'Not Submitted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};exports.getVerificationStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: mockVerification[req.user.id] || { status: 'Not Submitted' } });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const verification = await VendorVerification.findOne({ vendorId: vendor._id });
    res.status(200).json({ success: true, data: verification || { status: 'Not Submitted' } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit Store/Profile Setup details
// @route   POST /api/vendor/store-setup
// @access  Private (Vendor)
exports.submitStoreSetup = async (req, res) => {
  try {
    const { description, specialization, monthlyCapacity, serviceAreas } = req.body;

    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      mockStoreSetup[req.user.id] = { description, specialization, monthlyCapacity, serviceAreas, status: 'Submitted', submittedAt: new Date() };
      return res.status(201).json({ success: true, message: 'Store Setup details submitted successfully', data: mockStoreSetup[req.user.id] });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    vendor.description = description || vendor.description;
    vendor.specialization = specialization || vendor.specialization;
    vendor.monthlyCapacity = monthlyCapacity || vendor.monthlyCapacity;
    vendor.serviceAreas = serviceAreas || vendor.serviceAreas;
    vendor.storeSetupStatus = 'Submitted';
    vendor.accountActivationStatus = 'Under Review';
    await vendor.save();

    await Notification.create({ isAdmin: true, message: `Vendor ${vendor.companyName} submitted store setup details for approval.` });

    res.status(201).json({ success: true, message: 'Store Setup details submitted successfully', data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Store/Profile Setup status
// @route   GET /api/vendor/store-setup
// @access  Private (Vendor)
exports.getStoreSetupStatus = async (req, res) => {
  try {
    if (global.MOCK_DB || mongoose.connection.readyState !== 1 || (req.user && req.user.id && String(req.user.id).startsWith('mock_user_id'))) {
      return res.status(200).json({ success: true, data: mockStoreSetup[req.user.id] || { status: 'Pending' } });
    }

    const vendor = await Vendor.findOne({ userId: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    res.status(200).json({ 
      success: true, 
      data: { 
        status: vendor.storeSetupStatus || 'Pending', 
        description: vendor.description, 
        specialization: vendor.specialization, 
        monthlyCapacity: vendor.monthlyCapacity, 
        serviceAreas: vendor.serviceAreas 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

