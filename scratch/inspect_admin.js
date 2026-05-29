const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

function findPatterns(pattern) {
  console.log(`=== Matches for ${pattern} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(pattern)) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  });
}

function printSection(start, end) {
  console.log(`=== Lines ${start} to ${end} ===`);
  for (let i = start - 1; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}

// Find tabs rendering
findPatterns('activeTab ===');
