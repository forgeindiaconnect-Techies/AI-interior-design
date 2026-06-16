const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend', 'controllers', 'adminController.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace .find(...) queries inside Promise.all with .lean()
// We'll just replace the specific lines by doing string replaces
content = content.replace("User.find({}).select('-password').sort('-createdAt'),", "User.find({}).select('-password').sort('-createdAt').lean(),");
content = content.replace("Vendor.find({}).populate('userId', 'name email phone').sort('-createdAt'),", "Vendor.find({}).populate('userId', 'name email phone').sort('-createdAt').lean(),");
content = content.replace("Product.find({}).populate('vendorId', 'companyName').sort('-createdAt'),", "Product.find({}).populate('vendorId', 'companyName').sort('-createdAt').lean(),");
content = content.replace(".populate('orderId')\n        .sort('-createdAt'),", ".populate('orderId')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace(".populate('orderId')\r\n        .sort('-createdAt'),", ".populate('orderId')\r\n        .sort('-createdAt')\r\n        .lean(),");
content = content.replace("InteriorDesignerRequest.find({}).populate('userId', 'name email').sort('-createdAt'),", "InteriorDesignerRequest.find({}).populate('userId', 'name email').sort('-createdAt').lean(),");
content = content.replace("Quotation.find({}),", "Quotation.find({}).lean(),");
content = content.replace(".populate('installationPartnerId', 'companyName')\n        .sort('-createdAt'),", ".populate('installationPartnerId', 'companyName')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace(".populate('installationPartnerId', 'companyName')\r\n        .sort('-createdAt'),", ".populate('installationPartnerId', 'companyName')\r\n        .sort('-createdAt')\r\n        .lean(),");
content = content.replace(".populate('items.vendorId', 'companyName')\n        .sort('-createdAt'),", ".populate('items.vendorId', 'companyName')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace(".populate('items.vendorId', 'companyName')\r\n        .sort('-createdAt'),", ".populate('items.vendorId', 'companyName')\r\n        .sort('-createdAt')\r\n        .lean(),");
content = content.replace("ManufacturingOrder.find({})", "ManufacturingOrder.find({}).lean()");

// Remove .toObject()
content = content.replace("...v.toObject(),", "...v,");

// Update DeliveryOrder and InstallationOrder queries
content = content.replace("dbDeliveryOrders = await DeliveryOrder.find({}).populate('deliveryPartnerId').sort('-createdAt');", "dbDeliveryOrders = await DeliveryOrder.find({}).populate('deliveryPartnerId').sort('-createdAt').lean();");
content = content.replace("dbInstallationOrders = await InstallationOrder.find({}).populate('installationPartnerId').sort('-createdAt');", "dbInstallationOrders = await InstallationOrder.find({}).populate('installationPartnerId').sort('-createdAt').lean();");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully optimized adminController.js!');
