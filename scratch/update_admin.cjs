const fs = require('fs');

const targetFile = 'c:/Users/renug/OneDrive/Desktop/AI Interior Final Project/backend/controllers/adminController.js';
let content = fs.readFileSync(targetFile, 'utf8');

// Loose regex matching for the vendor creation block
const regex = /const vendor = await Vendor\.create\(\{\s*userId: user\._id,\s*companyName: companyName \|\| `\$\{name\}'s Business`,\s*businessType: category \|\| 'seller',\s*isActive: status === 'Active',\s*accountActivationStatus: status === 'Active' \? 'Active' : 'Pending Verification',\s*verificationStatus: status === 'Active' \? 'Approved' : 'Pending',\s*storeSetupStatus: 'Pending'\s*\}\);/;

const replacement = `let documents = {};
    if (req.files) {
      if (req.files.registrationCert) documents.registrationCert = \`/uploads/vendor-docs/\${req.files.registrationCert[0].filename}\`;
      if (req.files.idProof) documents.idProof = \`/uploads/vendor-docs/\${req.files.idProof[0].filename}\`;
      if (req.files.profilePhoto) documents.profilePhoto = \`/uploads/vendor-docs/\${req.files.profilePhoto[0].filename}\`;
      if (req.files.gstCert) documents.gstCert = \`/uploads/vendor-docs/\${req.files.gstCert[0].filename}\`;
      if (req.files.companyLogo) documents.companyLogo = \`/uploads/vendor-docs/\${req.files.companyLogo[0].filename}\`;
      if (req.files.bankVerification) documents.bankVerification = \`/uploads/vendor-docs/\${req.files.bankVerification[0].filename}\`;
      if (req.files.portfolioImages) {
        documents.portfolioImages = req.files.portfolioImages.map(f => \`/uploads/vendor-docs/\${f.filename}\`);
      }
    }

    const vendor = await Vendor.create({
      userId: user._id,
      companyName: companyName || \`\${name}'s Business\`,
      businessType: category || 'seller',
      businessCategory: businessCategory || undefined,
      yearsOfExperience: yearsOfExperience || undefined,
      websiteUrl: websiteUrl || undefined,
      socialMediaUrl: socialMediaUrl || undefined,
      documents: Object.keys(documents).length > 0 ? documents : undefined,
      isActive: status === 'Active',
      accountActivationStatus: status === 'Active' ? 'Active' : 'Pending Verification',
      verificationStatus: status === 'Active' ? 'Approved' : 'Pending',
      storeSetupStatus: 'Pending',
      documentVerificationStatus: 'Pending Verification'
    });`;

if (regex.test(content)) {
  fs.writeFileSync(targetFile, content.replace(regex, replacement));
  console.log('Success regex');
} else {
  console.log('Target not found via regex');
}
