const fs = require('fs');

const targetFile = 'c:/Users/renug/OneDrive/Desktop/AI Interior Final Project/backend/controllers/adminController.js';
let c = fs.readFileSync(targetFile, 'utf8');

c = c.replace(/vendor\.accountActivationStatus = 'Active';\s*vendor\.verificationStatus = 'Approved';/g, "vendor.accountActivationStatus = 'Active';\n    vendor.verificationStatus = 'Approved';\n    vendor.documentVerificationStatus = 'Approved';");

c = c.replace(/user\.status = 'Rejected';\s*user\.rejectedReason = reason \|\| 'Your registration does not meet our requirements at this time\.';\s*await user\.save\(\);/g, "user.status = 'Rejected';\n    user.rejectedReason = reason || 'Your registration does not meet our requirements at this time.';\n    await user.save();\n\n    const vendor = await Vendor.findOne({ userId: user._id });\n    if (vendor) {\n      vendor.documentVerificationStatus = 'Rejected';\n      await vendor.save();\n    }");

fs.writeFileSync(targetFile, c);
console.log('Approve/Reject logic updated');
