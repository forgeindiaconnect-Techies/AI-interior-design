const fs = require('fs');
const path = require('path');

const notebookPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb";
const outputPath = "c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\scratch\\extracted_code.py";

try {
  if (!fs.existsSync(notebookPath)) {
    console.error(`Error: Notebook not found at {notebookPath}`);
    process.exit(1);
  }

  const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));
  let codeCells = [];
  
  if (notebook.cells && Array.isArray(notebook.cells)) {
    notebook.cells.forEach((cell, i) => {
      if (cell.cell_type === 'code') {
        const source = Array.isArray(cell.source) ? cell.source.join('') : (cell.source || '');
        codeCells.push(`# --- Cell ${i} ---\n${source}\n\n`);
      }
    });
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, codeCells.join(''), 'utf8');
  console.log(`Extracted ${codeCells.length} code cells to ${outputPath}`);
} catch (err) {
  console.error("Error running extraction script:", err);
  process.exit(1);
}
