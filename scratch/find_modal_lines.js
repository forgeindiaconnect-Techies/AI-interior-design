const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

const list = [
  'assignVendorManualDesign &&',
  'assignDesignerManualDesign &&',
  'assignDesignerRequestObj &&',
  'assignVendorAIDesign &&'
];

list.forEach(item => {
  lines.forEach((line, idx) => {
    if (line.includes(item)) {
      console.log(`${item}: line ${idx + 1}`);
    }
  });
});
