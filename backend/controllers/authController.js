const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const VendorVerification = require('../models/VendorVerification');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const generateToken = (id, role) => {
  return jwt.sign({ id, role: role || 'user' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user or vendor
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, companyName, businessType } = req.body;



    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let finalRole = role || 'user';
    let finalStatus = 'Active';

    if (finalRole !== 'user') {
      finalRole = 'vendor';
      finalStatus = 'Pending';
    }

    user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      phone,
      address,
      status: finalStatus
    });

    if (finalRole === 'vendor') {
      const vendor = await Vendor.create({
        userId: user._id,
        companyName: companyName || `${name}'s Business`,
        businessType: 'seller' // Enforce seller as per requirement
      });

      await VendorVerification.create({
        vendorId: vendor._id,
        status: 'Not Submitted'
      });

      // Notify Admin about new vendor
      await Notification.create({
        isAdmin: true,
        message: `New Vendor Registration Request Received\nName: ${name}\nCompany: ${vendor.companyName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nDate: ${new Date().toLocaleString()}`,
        type: 'warning'
      });

      // Notify Vendor about successful submission
      await Notification.create({
        userId: user._id,
        message: 'Your vendor registration has been submitted successfully and is awaiting admin approval.',
        type: 'info'
      });
    } else {
      // Notify Admin about normal user
      await Notification.create({
        isAdmin: true,
        message: 'New User Registration: A new customer account has been created and is ready to use.',
        type: 'info'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const validRoles = ['user', 'vendor', 'admin', 'manufacturer', 'delivery', 'installation'];
    const prefix = email.split('@')[0];
    const isDemoEmail = email.endsWith('@example.com') && validRoles.includes(prefix);
    // Removed Mock DB fallback to enforce real DB usage

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Users with 'Pending' or 'Rejected' statuses are allowed to log in,
    // but the frontend will restrict their access based on their status.
    const token = generateToken(user._id, user.role);

    let vendorProfile = null;
    if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(user.role)) {
      vendorProfile = await Vendor.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: vendorProfile ? vendorProfile._id : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Removed MOCK_DB check

    const user = await User.findById(req.user.id).select('-password');
    let vendorProfile = null;
    if (['vendor', 'manufacturer', 'delivery', 'installation'].includes(user.role)) {
      vendorProfile = await Vendor.findOne({ userId: user._id });
    }
    res.status(200).json({ 
      success: true, 
      user: {
        ...user._doc,
        vendorId: vendorProfile ? vendorProfile._id : null
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
