const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      let decoded;
      
      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ success: false, message: 'Not authorized, token is null or undefined' });
      }
      
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (req.user && decoded.role) {
        req.user.role = decoded.role;
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // Allow /auth/me to return user data even when suspended/blocked so the frontend can show a proper message
      if (req.originalUrl !== '/api/auth/me' && req.path !== '/auth/me') {
        if (req.user.status === 'Suspended') {
          return res.status(403).json({ 
            success: false, 
            message: `Your account has been suspended. Reason: ${req.user.suspensionReason || 'No reason specified'}` 
          });
        }

        if (req.user.status === 'Blocked') {
          return res.status(403).json({ 
            success: false, 
            message: 'Your account has been blocked by system administrators.' 
          });
        }
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
