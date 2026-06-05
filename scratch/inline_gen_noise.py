import json

with open('generating-interior-design-dcgan-wgan.ipynb', 'r', encoding='utf-8') as f:
    d = json.load(f)

cells = d.get('cells', [])
for c in cells:
    if 'source' in c and isinstance(c['source'], list):
        new_source = []
        for line in c['source']:
            # Replace gen_noise with inline torch.randn
            if 'noise = gen_noise(cur_bs, z_dim, device=device)' in line:
                new_source.append(line.replace('gen_noise(cur_bs, z_dim, device=device)', 'torch.randn(cur_bs, z_dim, 1, 1, device=device)'))
            elif 'def gen_noise' in line or 'return torch.randn(batch_size' in line:
                # Remove the gen_noise definition
                continue
            else:
                new_source.append(line)
        c['source'] = new_source

with open('generating-interior-design-dcgan-wgan.ipynb', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=1)
print("Inlined gen_noise.")
