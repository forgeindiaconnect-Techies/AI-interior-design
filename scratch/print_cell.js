const fs = require('fs');

const notebookPath = 'c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb';
const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));

const cell = notebook.cells[67];
console.log(`Cell Type: ${cell.cell_type}`);
console.log('Source lines:');
console.log(JSON.stringify(cell.source, null, 2));
