const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

const keywords = ['assignVendorManualDesign', 'assignDesignerManualDesign', 'assignDesignerRequestObj', 'assignVendorAIDesign'];

keywords.forEach(kw => {
  console.log(`=== Matches for ${kw} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(kw) && line.includes('&&')) {
      console.log(`${idx + 1}: ${line.trim()}`);
      // Print 40 lines
      for (let i = idx; i < idx + 45; i++) {
        console.log(`  ${i + 1}: ${lines[i]}`);
      }
    }
  });
});
