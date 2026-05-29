const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('const handleAssignManualDesignVendorSubmit =')) {
    for (let i = idx; i < idx + 45; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
