const fs = require('fs');

const ids = JSON.parse(fs.readFileSync('unsplash_ids_2.json', 'utf8'));
const fallbackPooja = ['U0HbbxGz-3A', '6AebwXWd47Q', 'oZz2w1EebE0', 't5XnF6YmHZE', 'Bw5G8bNqWXY', 'J1XqX-qvEZE', 'L1XqX-qvEZE', 'XQ4cYH7Jhjo', 'AWzFKOH5UIQ', 'ZK5CSoCuqC8'];
ids['Pooja Room'] = ids['Pooja Room'].length ? ids['Pooja Room'] : fallbackPooja;

let code = `      const roomImagePools = {\n`;
for (const [k, v] of Object.entries(ids)) {
  const top10 = v.slice(0, 10).map(id => 'https://images.unsplash.com/photo-' + id + '?w=800&auto=format&fit=crop&q=60');
  code += `        '${k}': [\n` + top10.map(url => `          '${url}'`).join(',\n') + `\n        ],\n`;
}
code += `      };\n\n`;

const originalCode = fs.readFileSync('../frontend/src/pages/UserDashboard.jsx', 'utf8');

const regex = /(const roomDesigns = \{[\s\S]*?\}[\s\S]*?^\s*};\n)(\n\s*const selectedDesign = roomDesigns\[roomType\] \|\| roomDesigns\['Living Room'\];)/m;
const match = originalCode.match(regex);

if (match) {
  let roomDesignsBlock = match[1];
  let selectedDesignLine = match[2];
  
  // Create dynamic selection logic
  const dynamicSelection = `
      const selectedDesign = roomDesigns[roomType] || roomDesigns['Living Room'];
      const pool = roomImagePools[roomType] || roomImagePools['Living Room'];
      const randomGeneratedImage = pool[Math.floor(Math.random() * pool.length)];
      selectedDesign.generatedImage = randomGeneratedImage;
`;
  
  const replacement = code + roomDesignsBlock + dynamicSelection;
  fs.writeFileSync('replacement.txt', replacement, 'utf8');
  console.log("Replacement generated");
} else {
  console.log("Regex match failed");
}
