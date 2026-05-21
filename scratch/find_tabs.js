const fs = require('fs');
const path = require('path');

function searchInFile(filepath, keywords) {
  console.log(`\n--- Searching in ${filepath} ---`);
  let content = '';
  try {
    content = fs.readFileSync(filepath, 'utf8');
  } catch (err) {
    try {
      content = fs.readFileSync(filepath, 'utf16le');
    } catch (err2) {
      console.error(`Error reading: ${err2}`);
      return;
    }
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const kw of keywords) {
      if (line.toLowerCase().includes(kw.toLowerCase())) {
        console.log(`Line ${idx + 1}: ${line.trim().substring(0, 120)}`);
        break;
      }
    }
  });
}

const adminPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\AdminDashboard.jsx";
const vendorPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\VendorDashboard.jsx";
const userPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\frontend\\src\\pages\\UserDashboard.jsx";

searchInFile(adminPath, ["designerRequest", "manualDesign", "customDesign", "activeTab === '", "activeTab == '"]);
searchInFile(vendorPath, ["designerRequest", "manualDesign", "customDesign", "activeTab === '", "activeTab == '"]);
searchInFile(userPath, ["designerRequest", "manualDesign", "customDesign", "activeTab === '", "activeTab == '"]);
