const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/UserDashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

for (let idx = 1825; idx <= 1845; idx++) {
  console.log(`${idx}: ${lines[idx - 1]}`);
}
