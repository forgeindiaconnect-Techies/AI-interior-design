const fs = require('fs');

const vendorFile = 'frontend/src/pages/VendorDashboard.jsx';
let vendorContent = fs.readFileSync(vendorFile, 'utf8');
vendorContent = vendorContent.replace(/\/api\/vendor\/payout/g, '/vendor/payout');
fs.writeFileSync(vendorFile, vendorContent, 'utf8');

const adminFile = 'frontend/src/pages/AdminDashboard.jsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');
adminContent = adminContent.replace(/\/api\/admin\/payouts/g, '/admin/payouts');
fs.writeFileSync(adminFile, adminContent, 'utf8');

console.log('Fixed Axios URL paths');
