import json
import os

notebook_path = r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\generating-interior-design-dcgan-wgan.ipynb"
output_path = r"c:\Users\renug\OneDrive\Desktop\AI Interior Final Project\scratch\extracted_code.py"

if not os.path.exists(notebook_path):
    print(f"Error: Notebook not found at {notebook_path}")
    exit(1)

with open(notebook_path, 'r', encoding='utf-8') as f:
    notebook = json.load(f)

code_cells = []
for i, cell in enumerate(notebook.get('cells', [])):
    if cell.get('cell_type') == 'code':
        source = cell.get('source', [])
        code_cells.append(f"# --- Cell {i} ---\n" + "".join(source) + "\n\n")

os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, 'w', encoding='utf-8') as f:
    f.writelines(code_cells)

print(f"Extracted {len(code_cells)} code cells to {output_path}")
