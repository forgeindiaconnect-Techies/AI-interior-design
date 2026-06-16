const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'backend', 'controllers', 'adminController.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("User.find({}).select('-password').sort('-createdAt'),", "User.find({}).select('-password').sort('-createdAt').lean(),");
content = content.replace("Vendor.find({}).populate('userId', 'name email phone').sort('-createdAt'),", "Vendor.find({}).populate('userId', 'name email phone').sort('-createdAt').lean(),");
content = content.replace("Product.find({}).populate('vendorId', 'companyName').sort('-createdAt'),", "Product.find({}).populate('vendorId', 'companyName').sort('-createdAt').lean(),");
content = content.replace(/AIDesignRequest\.find\(\{\}\)\s*\.populate\('userId', 'name email'\)\s*\.populate\('assignedVendor'\)\s*\.populate\('additionalVendors'\)\s*\.populate\('orderId'\)\s*\.sort\('-createdAt'\),/g, "AIDesignRequest.find({})\n        .populate('userId', 'name email')\n        .populate('assignedVendor')\n        .populate('additionalVendors')\n        .populate('orderId')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace("InteriorDesignerRequest.find({}).populate('userId', 'name email').sort('-createdAt'),", "InteriorDesignerRequest.find({}).populate('userId', 'name email').sort('-createdAt').lean(),");
content = content.replace("Quotation.find({}),", "Quotation.find({}).lean(),");
content = content.replace(/Order\.find\(\{\}\)\s*\.populate\('userId', 'name email'\)\s*\.populate\('vendorId', 'companyName'\)\s*\.populate\('manufacturerId', 'companyName'\)\s*\.populate\('deliveryPartnerId', 'companyName'\)\s*\.populate\('installationPartnerId', 'companyName'\)\s*\.sort\('-createdAt'\),/g, "Order.find({})\n        .populate('userId', 'name email')\n        .populate('vendorId', 'companyName')\n        .populate('manufacturerId', 'companyName')\n        .populate('deliveryPartnerId', 'companyName')\n        .populate('installationPartnerId', 'companyName')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace(/MarketplaceOrder\.find\(\{\}\)\s*\.populate\('userId', 'name email'\)\s*\.populate\('deliveryPartnerId', 'companyName'\)\s*\.populate\('installationPartnerId', 'companyName'\)\s*\.populate\('items\.vendorId', 'companyName'\)\s*\.sort\('-createdAt'\),/g, "MarketplaceOrder.find({})\n        .populate('userId', 'name email')\n        .populate('deliveryPartnerId', 'companyName')\n        .populate('installationPartnerId', 'companyName')\n        .populate('items.vendorId', 'companyName')\n        .sort('-createdAt')\n        .lean(),");
content = content.replace("ManufacturingOrder.find({})", "ManufacturingOrder.find({}).lean()");
content = content.replace("...v.toObject(),", "...v,");
content = content.replace("dbDeliveryOrders = await DeliveryOrder.find({}).populate('deliveryPartnerId').sort('-createdAt');", "dbDeliveryOrders = await DeliveryOrder.find({}).populate('deliveryPartnerId').sort('-createdAt').lean();");
content = content.replace("dbInstallationOrders = await InstallationOrder.find({}).populate('installationPartnerId').sort('-createdAt');", "dbInstallationOrders = await InstallationOrder.find({}).populate('installationPartnerId').sort('-createdAt').lean();");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully optimized adminController.js!');
