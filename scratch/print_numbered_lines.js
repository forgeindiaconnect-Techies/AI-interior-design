const fs = require('fs');

const notebookPath = 'c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb';
const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));

const cell = notebook.cells[67];
let source = cell.source || [];
if (typeof source === 'string') {
  source = source.split('\n');
}
const text = source.join(''); // Note: Jupyter sources usually end with \n, so join with ''
const lines = text.split('\n');

lines.forEach((line, idx) => {
  console.log(`${idx + 1}: ${line}`);
});
