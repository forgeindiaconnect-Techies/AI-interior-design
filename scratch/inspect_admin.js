const fs = require('fs');

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const content = fs.readFileSync(adminPath, 'utf8');

// Let's find where tabs are handled and where designerRequests/manualDesigns are rendered
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('manualDesigns') || line.includes('designerRequests') || line.includes('activeTab ===') || line.includes('activeTab ==')) {
    if (line.includes('&&') || line.includes('map') || line.includes('length')) {
      console.log(`Line ${idx + 1}: ${line.trim().substring(0, 120)}`);
    }
  }
});
