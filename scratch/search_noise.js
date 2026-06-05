const fs = require('fs');
const path = require('path');

const notebookPath = 'c:\\Users\\renug\\OneDrive\\Desktop\\AI Interior Final Project\\generating-interior-design-dcgan-wgan.ipynb';

if (!fs.existsSync(notebookPath)) {
  console.error(`Notebook not found at: ${notebookPath}`);
  process.exit(1);
}

const notebook = JSON.parse(fs.readFileSync(notebookPath, 'utf8'));

notebook.cells.forEach((cell, cellIdx) => {
  if (cell.cell_type === 'code') {
    let sourceLines = cell.source || [];
    if (typeof sourceLines === 'string') {
      sourceLines = sourceLines.split('\n');
    }
    if (Array.isArray(sourceLines)) {
      sourceLines.forEach((line, lineIdx) => {
        if (line.includes('gen_noise') || line.includes('gen_losses')) {
          console.log(`\n--- Cell ${cellIdx}, Line ${lineIdx + 1} ---`);
          console.log(`Line: ${line.trim()}`);
          
          // Print context (3 lines before and after)
          const start = Math.max(0, lineIdx - 3);
          const end = Math.min(sourceLines.length - 1, lineIdx + 3);
          console.log('Context:');
          for (let i = start; i <= end; i++) {
            const prefix = i === lineIdx ? '>> ' : '   ';
            console.log(`${prefix}${i + 1}: ${sourceLines[i].replace(/\r?\n$/, '')}`);
          }
        }
      });
    }
  }
});
