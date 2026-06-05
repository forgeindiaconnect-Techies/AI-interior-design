const fs = require('fs');

const notebookPath = 'c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb';
const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));

notebook.cells.forEach((cell, cellIdx) => {
  let source = cell.source || [];
  if (typeof source === 'string') {
    source = source.split('\n');
  }
  const text = source.join('\n');
  if (/gen_noise/i.test(text)) {
    console.log(`Cell ${cellIdx} matches gen_noise`);
    source.forEach((line, lineIdx) => {
      if (/gen_noise/i.test(line)) {
        console.log(`  Line ${lineIdx + 1}: ${line.trim()}`);
      }
    });
  }
});
