const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('modal') && line.includes('&&')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
