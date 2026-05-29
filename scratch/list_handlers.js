const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

function inspectRange(start, end) {
  console.log(`=== Inspecting Lines ${start} to ${end} ===`);
  for (let i = start - 1; i < end; i++) {
    const line = lines[i];
    if (line.includes('onClick') || line.includes('onChange') || line.includes('onSubmit') || line.includes('handle')) {
      console.log(`${i + 1}: ${line.trim()}`);
    }
  }
}

inspectRange(3374, 3718); // ai_designs
inspectRange(3719, 4101); // manual_designs
inspectRange(4102, 4325); // designer_requests
