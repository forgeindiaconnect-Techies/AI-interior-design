const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove All Roles filter and change grid-cols-3 to grid-cols-2
const gridColsRegex = /<div className="grid grid-cols-3 gap-3 md:w-auto w-full">/;
content = content.replace(gridColsRegex, '<div className="grid grid-cols-2 gap-3 md:w-auto w-full">');

const roleFilterBlock = `                <div className="flex items-center gap-1.5 bg-white border border-[#D4A373]/30 px-3 py-2 rounded-xl">
                  <Filter className="text-gray-400 w-3.5 h-3.5" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Customers</option>
                    <option value="vendor">Vendors</option>
                    <option value="manufacturer">Manufacturers</option>
                    <option value="delivery">Delivery</option>
                    <option value="installation">Installation</option>
                  </select>
                </div>`;
content = content.replace(roleFilterBlock, '');

// 2. Remove Shipping Address
const shippingAddressLine = `                  <p><strong>Shipping Address:</strong> {viewOrder.shippingAddress || 'Not Provided'}</p>`;
content = content.replace(shippingAddressLine, '');

// 3. Remove Workflow Partner Team block
const workflowPartnerTeamBlockRegex = /<div>\s*<h4 className="font-bold text-sm text-gray-800 mb-2 border-b pb-1">Workflow Partner Team<\/h4>\s*<div className="text-xs space-y-2">\s*<div className="flex justify-between border-b py-1">\s*<span className="text-gray-400 font-bold uppercase text-\[9px\] tracking-wider">Vendor Partner:<\/span>\s*<span className="font-bold text-gray-700">{viewOrder\.vendorId\?\.companyName \|\| 'Not Assigned'}<\/span>\s*<\/div>\s*\{viewOrder\.orderType !== 'Marketplace Product' && \(\s*<div className="flex justify-between border-b py-1">\s*<span className="text-gray-400 font-bold uppercase text-\[9px\] tracking-wider">Manufacturing Partner:<\/span>\s*<span className="font-bold text-gray-700">{viewOrder\.manufacturerId\?\.companyName \|\| 'Not Assigned'}<\/span>\s*<\/div>\s*\)\}\s*<div className="flex justify-between border-b py-1">\s*<span className="text-gray-400 font-bold uppercase text-\[9px\] tracking-wider">Logistics Partner:<\/span>\s*<span className="font-bold text-gray-700">{viewOrder\.deliveryPartnerId\?\.companyName \|\| 'Not Assigned'}<\/span>\s*<\/div>\s*<div className="flex justify-between py-1">\s*<span className="text-gray-400 font-bold uppercase text-\[9px\] tracking-wider">Installation Expert:<\/span>\s*<span className="font-bold text-gray-700">{viewOrder\.installationPartnerId\?\.companyName \|\| 'Not Assigned'}<\/span>\s*<\/div>\s*<\/div>\s*<\/div>/g;
content = content.replace(workflowPartnerTeamBlockRegex, '');

// 4. Update Payment & Workflow display
const paymentWorkflowOriginal = `<p className="font-bold text-gray-800 mt-1 uppercase text-[10px]">{viewOrder.paymentStatus} / {viewOrder.orderStatus}</p>`;
const paymentWorkflowNew = `<p className="font-bold text-gray-800 mt-1 uppercase text-[10px]">{viewOrder.paymentStatus?.toUpperCase() === 'PAID' ? 'PAID' : \`\${viewOrder.paymentStatus} / \${viewOrder.orderStatus}\`}</p>`;
content = content.replace(paymentWorkflowOriginal, paymentWorkflowNew);

// 5. Replace ₹ with $
content = content.replace(/₹/g, '$');

// Also remove empty lines left by role filter replacement
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated AdminDashboard.jsx');
