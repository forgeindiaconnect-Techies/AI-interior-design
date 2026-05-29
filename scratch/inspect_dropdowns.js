const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

let foundAssign = false;
lines.forEach((line, idx) => {
  if (line.includes('assignVendorManualDesign') || line.includes('assignDesignerManualDesign') || line.includes('assignDesignerRequestObj')) {
    if (line.includes('managementData?.vendors') || line.includes('vendors.filter') || line.includes('<select')) {
      console.log(`${idx + 1}: ${line.trim()}`);
      // Print 10 lines
      for (let i = idx; i < idx + 15; i++) {
        console.log(`  ${i + 1}: ${lines[i]}`);
      }
    }
  }
});
