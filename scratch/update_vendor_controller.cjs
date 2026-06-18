const fs = require('fs');
let file = 'backend/controllers/vendorController.js';
let content = fs.readFileSync(file, 'utf8');

const oldFunc = `exports.createPayoutRequest = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, ifscCode, accountHolderName } = req.body;
    
    if (!amount || !bankName || !accountNumber || !ifscCode || !accountHolderName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const PayoutRequest = require('../models/PayoutRequest');
    const Notification = require('../models/Notification');

    const newRequest = new PayoutRequest({
      vendorId: req.user._id,
      amount,
      bankDetails: {
        bankName,
        accountNumber,
        ifscCode,
        accountHolderName
      }
    });`;

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

if (content.includes("bankDetails: {")) {
  content = content.replace(oldFunc, newFunc);
  fs.writeFileSync(file, content, 'utf8');
  console.log('vendorController updated');
} else {
  console.log('Could not find oldFunc');
}
