const fs = require('fs');

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const content = fs.readFileSync(adminPath, 'utf8');

const lines = content.split(/\r?\n/);
let foundAssign = false;
let foundUpdate = false;

lines.forEach((line, idx) => {
  if (line.includes('handleAssignDesignerRequestSubmit') || line.includes('handleUpdateDesignerRequestStatus')) {
    console.log(`\n--- Found function at line ${idx + 1} ---`);
    for (let i = Math.max(0, idx - 2); i < idx + 40; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
