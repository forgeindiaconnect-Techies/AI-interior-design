const fs = require('fs');

const fileContent = fs.readFileSync('frontend/src/pages/AdminDashboard.jsx', 'utf8');
const lines = fileContent.split('\n');

function findDefinition(name) {
  console.log(`=== Definition for ${name} ===`);
  lines.forEach((line, idx) => {
    if (line.includes(`const ${name}`) || line.includes(`function ${name}`)) {
      // Print 20 lines starting from idx
      for (let i = idx; i < idx + 25; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  });
}

findDefinition('handleApproveAIRequest');
findDefinition('handleRejectAIRequest');
findDefinition('handleApproveManualDesign');
findDefinition('handleRejectManualDesign');
