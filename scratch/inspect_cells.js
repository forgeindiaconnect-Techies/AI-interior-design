const fs = require('fs');

const notebookPath = 'c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb';
const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));

for (let i = 60; i < 70; i++) {
  if (i < notebook.cells.length) {
    const cell = notebook.cells[i];
    console.log(`Cell ${i} (${cell.cell_type}):`);
    const source = cell.source || [];
    const lines = typeof source === 'string' ? source.split('\n') : source;
    for (let j = 0; j < Math.min(3, lines.length); j++) {
      console.log(`  Line ${j + 1}: ${lines[j].trim()}`);
    }
  }
}
