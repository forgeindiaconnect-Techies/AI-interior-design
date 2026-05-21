const fs = require('fs');

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const content = fs.readFileSync(adminPath, 'utf8');

const lines = content.split(/\r?\n/);
let foundFns = [];
lines.forEach((line, idx) => {
  if (line.includes('handleAssignDesignerRequestSubmit') || line.includes('handleUpdateDesignerRequestStatus')) {
    if (line.includes('const') || line.includes('async')) {
      foundFns.push({ name: line, lineNum: idx + 1 });
    }
  }
});

foundFns.forEach(fn => {
  console.log(`\n--- Function: ${fn.name} at line ${fn.lineNum} ---`);
  for (let i = fn.lineNum - 1; i < fn.lineNum + 40; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
});
