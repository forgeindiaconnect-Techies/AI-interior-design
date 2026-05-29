const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

let start = -1;
lines.forEach((line, idx) => {
  if (line.includes('const AdminDashboard =') || line.includes('function AdminDashboard')) {
    start = idx;
  }
});

if (start !== -1) {
  console.log(`=== AdminDashboard starts at line ${start + 1} ===`);
  for (let i = start; i < start + 120; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
