const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/VendorDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('customRequests.filter')) {
    console.log(`Match at line ${idx + 1}:`);
    for (let i = idx; i < idx + 30; i++) {
      console.log(`  ${i + 1}: ${lines[i]}`);
    }
  }
});
