const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'backend', 'controllers', 'adminController.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("const payments = await Payment.find({ status: 'success' });", "const payments = await Payment.find({ status: 'success' }).lean();");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully optimized Payment.find in adminController.js!');
