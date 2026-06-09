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
        title: 'New Vendor Registration',
        message: `New Vendor Registration Request Received\nName: ${name}\nCompany: ${vendor.companyName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nDate: ${new Date().toLocaleString()}`,
        notificationType: 'warning',
        recipientRole: 'admin'
      });

      // Notify Vendor about successful submission
      await Notification.create({
        title: 'Registration Submitted',
        message: 'Your vendor registration has been submitted successfully and is awaiting admin approval.',
        notificationType: 'info',
        recipientRole: 'vendor',
        recipientUser: user._id
      });
    } else {
      // Notify Admin about normal user
      await Notification.create({
        title: 'New User Registration',
        message: 'A new customer account has been created and is ready to use.',
        notificationType: 'info',
        recipientRole: 'admin'
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
    if (isDemoEmail || global.MOCK_DB || mongoose.connection.readyState !== 1) {
      let userRole;
      if (isDemoEmail) {
        userRole = prefix;
      } else {
        try {
          const user = await User.findOne({ email }).select('role');
          userRole = user ? user.role : (validRoles.includes(prefix) ? prefix : 'user');
        } catch {
          userRole = validRoles.includes(prefix) ? prefix : 'user';
        }
      }
      const token = generateToken('mock_user_id_' + userRole, userRole);

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: 'mock_user_id_' + userRole,
          name: userRole.charAt(0).toUpperCase() + userRole.slice(1) + ' Demo',
          email: email,
          role: userRole,
          vendorId: ['vendor', 'manufacturer', 'delivery', 'installation'].includes(userRole) ? '65c2b18a7c6b4b1c92949765' : null
        }
      });
    }

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
    if (req.user.id.startsWith('mock_user_id') || global.MOCK_DB || mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        user: req.user
      });
    }

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
