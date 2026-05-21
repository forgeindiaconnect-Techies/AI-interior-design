const fs = require('fs');

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const content = fs.readFileSync(adminPath, 'utf8');

// Let's print out lines around fetchAdminData where localManualRequests or designerRequests are fetched and merged.
const lines = content.split(/\r?\n/);
let inFetch = false;
let count = 0;
lines.forEach((line, idx) => {
  if (line.includes('const fetchAdminData = async ()')) {
    inFetch = true;
    count = 0;
  }
  if (inFetch) {
    console.log(`Line ${idx + 1}: ${line}`);
    count++;
    if (count > 80) {
      inFetch = false;
    }
  }
});
