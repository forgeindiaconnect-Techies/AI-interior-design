const fs = require('fs');
const path = require('path');

const files = [
    path.join(__dirname, '../frontend/src/pages/VendorDashboard.jsx'),
    path.join(__dirname, '../frontend/src/pages/UserDashboard.jsx'),
    path.join(__dirname, '../frontend/src/pages/AdminDashboard.jsx'),
    path.join(__dirname, '../frontend/src/pages/Marketplace.jsx'),
    path.join(__dirname, '../frontend/src/components/DashboardLayout.jsx'),
    path.join(__dirname, '../frontend/src/components/UserSidebar.jsx')
];

function replaceInFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');

    // Replace JSON.parse(localStorage.getItem('mock...')) || '[]' with []
    content = content.replace(/JSON\.parse\(localStorage\.getItem\('mock[^']+'\) \|\| '\[\]'\)/g, "[]");
    
    // Replace localStorage.getItem('mock...') with null
    content = content.replace(/localStorage\.getItem\('mock[^']+'\)/g, "null");

    // Replace localStorage.setItem('mock...', <anything>); across multiple lines
    // We use a regex that matches localStorage.setItem('mock...', up to the closing );
    // Be careful with JSON.stringify() which might contain ); inside it.
    // A better approach is matching from localStorage.setItem('mock up to the next semicolon.
    // However, JS might not have semicolons. Let's just match single line ones for now.
    // Or we can use regex: /localStorage\.setItem\('mock[^']+',[\s\S]*?\);/g
    // This could be greedy and match too much if there are multiple statements!
    // A safer regex for multiline setItem:
    content = content.replace(/localStorage\.setItem\('mock[^']+',[^;]+;/g, "");
    
    // Some lines might not end with a semicolon.
    content = content.replace(/localStorage\.setItem\('mock[a-zA-Z0-9]+',\s*JSON\.stringify\([^)]+\)\)(;?)/g, "");

    // Let's remove mock_vendor_id_123 fallback
    content = content.replace(/ \|\| 'mock_vendor_id_123'/g, "");
    content = content.replace(/ \? '_id' : 'mock_vendor_id_123'/g, "");

    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Processed ${filepath}`);
}

files.forEach(replaceInFile);
console.log("Done.");
