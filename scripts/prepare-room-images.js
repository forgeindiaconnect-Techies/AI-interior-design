import { readdirSync, copyFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const ROOM_FOLDERS = ['kitchen', 'bedroom', 'bathroom', 'living_room'];
const STYLES = ['boho', 'industrial', 'minimalist', 'modern', 'scandinavian'];
const MAX_IMAGES_PER_STYLE = 10;

const OUTPUT_DIR = join(ROOT, 'frontend', 'public', 'room-images');

function collectImages() {
  const manifest = { rooms: {} };
  let totalCopied = 0;

  for (const room of ROOM_FOLDERS) {
    const roomPath = join(ROOT, room);
    if (!existsSync(roomPath)) {
      console.warn(`[room-images] Skipping ${room}: folder not found at ${roomPath}`);
      continue;
    }

    manifest.rooms[room] = { styles: {} };

    for (const style of STYLES) {
      const stylePath = join(roomPath, style);
      if (!existsSync(stylePath)) {
        console.warn(`[room-images] Skipping ${room}/${style}: folder not found`);
        continue;
      }

      const files = readdirSync(stylePath)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort((a, b) => {
          const numA = parseInt(a.match(/(\d+)/)?.[1] || '0', 10);
          const numB = parseInt(b.match(/(\d+)/)?.[1] || '0', 10);
          return numA - numB;
        });

      if (files.length === 0) {
        console.warn(`[room-images] No images found in ${room}/${style}`);
        continue;
      }

      const outStyleDir = join(OUTPUT_DIR, room, style);
      if (!existsSync(outStyleDir)) {
        mkdirSync(outStyleDir, { recursive: true });
      }

      const selected = files.slice(0, MAX_IMAGES_PER_STYLE);
      const copied = [];

      for (const file of selected) {
        const src = join(stylePath, file);
        const dest = join(outStyleDir, file);
        copyFileSync(src, dest);
        copied.push(file);
        totalCopied++;
      }

      manifest.rooms[room].styles[style] = {
        total: files.length,
        copied: copied
      };
    }
  }

  manifest._meta = {
    generatedAt: new Date().toISOString(),
    totalImagesCopied: totalCopied,
    note: 'Images are copied from root-level room folders. Add new images to those folders and rebuild to update.'
  };

  const manifestPath = join(OUTPUT_DIR, 'manifest.json');
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`[room-images] Done! Copied ${totalCopied} images to ${OUTPUT_DIR}`);
  console.log(`[room-images] Manifest written to ${manifestPath}`);
}

collectImages();
