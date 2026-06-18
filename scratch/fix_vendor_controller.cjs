const fs = require('fs');
const filePath = 'backend/controllers/vendorController.js';
let content = fs.readFileSync(filePath, 'utf8');

const newFunc = `exports.createPayoutRequest = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;
    
    if (!amount || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Amount and payment method are required' });
    }

    const PayoutRequest = require('../models/PayoutRequest');
    const Notification = require('../models/Notification');

    const newRequest = new PayoutRequest({
      vendorId: req.user._id,
      amount,
      paymentMethod,
      paymentDetails: paymentDetails || {}
    });`;

// We'll replace from `exports.createPayoutRequest = async` to `});` just before `await newRequest.save();`
content = content.replace(/exports\.createPayoutRequest = async \(req, res\) => \{[\s\S]*?const newRequest = new PayoutRequest\(\{\s*vendorId: req\.user\._id,\s*amount,\s*bankDetails: \{[\s\S]*?\}\s*\}\);/, newFunc);

fs.writeFileSync(filePath, content, 'utf8');
console.log('vendorController replaced successfully.');
