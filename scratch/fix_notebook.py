import json

with open('generating-interior-design-dcgan-wgan.ipynb', 'r', encoding='utf-8') as f:
    d = json.load(f)

for c in d.get('cells', []):
    if 'source' in c and isinstance(c['source'], list):
        new_source = []
        for text in c['source']:
            lines = text.split('\n')
            for i, line in enumerate(lines):
                if i < len(lines) - 1:
                    new_source.append(line + '\n')
                elif len(line) > 0:
                    new_source.append(line)
        c['source'] = new_source

if 'language_info' in d.get('metadata', {}):
    d['metadata']['language_info']['version'] = '3.11.9'

with open('generating-interior-design-dcgan-wgan.ipynb', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=1)
print("Notebook formatted successfully.")
