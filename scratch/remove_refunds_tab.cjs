const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'AdminDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf8');

const startIndex = content.indexOf('{/* TAB: REFUNDS */}');
const endIndex = content.indexOf('{/* TAB: PLATFORM COMMISSION */}');

if (startIndex !== -1 && endIndex !== -1) {
  // Find the exact start of the line for TAB: REFUNDS
  const trueStart = content.lastIndexOf('\n', startIndex);
  // Find the exact start of the line for TAB: PLATFORM COMMISSION
  const trueEnd = content.lastIndexOf('\n', endIndex);

  const before = content.slice(0, trueStart);
  const after = content.slice(trueEnd);

  fs.writeFileSync(filePath, before + after, 'utf8');
  console.log('Successfully removed Refunds tab from AdminDashboard.jsx');
} else {
  console.log('Could not find the tabs in AdminDashboard.jsx');
}
