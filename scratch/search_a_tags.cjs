const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath);
    } else if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
      const content = fs.readFileSync(filepath, 'utf8');
      content.split('\n').forEach((line, idx) => {
        if (line.includes('target="_blank"') && (line.includes('Image') || line.includes('image') || line.includes('img') || line.includes('Url') || line.includes('Proof') || line.includes('File'))) {
          console.log(`${filepath}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  });
}

walk('frontend/src');
