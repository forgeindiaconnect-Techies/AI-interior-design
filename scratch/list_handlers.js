const fs = require('fs');

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const content = fs.readFileSync(adminPath, 'utf8');

const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('const handle') && (line.includes('Manual') || line.includes('Request'))) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
