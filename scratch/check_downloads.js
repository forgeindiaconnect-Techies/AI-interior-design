const fs = require('fs');

const notebookPath = 'c:\\Users\\renug\\Downloads\\generating-interior-design-dcgan-wgan.ipynb';
if (fs.existsSync(notebookPath)) {
  const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));
  const cell = notebook.cells[67];
  console.log(`Cell Type: ${cell.cell_type}`);
  const source = cell.source || [];
  const lines = typeof source === 'string' ? source.split('\n') : source;
  console.log('First 5 lines of Cell 67 in Downloads:');
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    console.log(`  Line ${i + 1}: ${lines[i]}`);
  }
} else {
  console.log('Downloads notebook not found');
}
