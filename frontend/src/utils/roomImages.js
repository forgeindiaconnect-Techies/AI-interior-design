const ROOM_MANIFEST_URL = '/room-images/manifest.json';
const ROOM_IMAGES_BASE = '/room-images';

const ROOM_TYPE_MAP = {
  'living room': 'living_room',
  'livingroom': 'living_room',
  'kitchen': 'kitchen',
  'bedroom': 'bedroom',
  'bathroom': 'bathroom',
  'bath room': 'bathroom',
};

let manifestCache = null;

export async function loadManifest() {
  if (manifestCache) return manifestCache;
  try {
    const res = await fetch(ROOM_MANIFEST_URL);
    manifestCache = await res.json();
    return manifestCache;
  } catch {
    manifestCache = { rooms: {} };
    return manifestCache;
  }
}

export function getRoomSlug(roomType) {
  if (!roomType) return null;
  const normalized = roomType.toLowerCase().trim();
  return ROOM_TYPE_MAP[normalized] || null;
}

export function imagePath(room, style, filename) {
  return `${ROOM_IMAGES_BASE}/${room}/${style}/${filename}`;
}

export function randomImagePath(room, style) {
  if (!manifestCache) return null;
  const roomData = manifestCache.rooms[room];
  if (!roomData) return null;
  const styleData = roomData.styles[style];
  if (!styleData) return null;
  const files = styleData.copied;
  if (!files || files.length === 0) return null;
  const pick = files[Math.floor(Math.random() * files.length)];
  return imagePath(room, style, pick);
}

export function anyImageForRoom(roomSlug) {
  if (!manifestCache || !roomSlug) return null;
  const roomData = manifestCache.rooms[roomSlug];
  if (!roomData) return null;
  const styles = Object.keys(roomData.styles);
  if (styles.length === 0) return null;
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return randomImagePath(roomSlug, randomStyle);
}

export function fallbackForRoomType(roomType) {
  const slug = getRoomSlug(roomType);
  return anyImageForRoom(slug);
}

export function getAllRoomTypes() {
  if (!manifestCache) return [];
  return Object.keys(manifestCache.rooms);
}

export function getStylesForRoom(roomSlug) {
  if (!manifestCache || !manifestCache.rooms[roomSlug]) return [];
  return Object.keys(manifestCache.rooms[roomSlug].styles);
}

export function getImageCount(roomSlug, style) {
  if (!manifestCache || !manifestCache.rooms[roomSlug]) return 0;
  if (style) {
    const s = manifestCache.rooms[roomSlug].styles[style];
    return s ? s.total : 0;
  }
  let total = 0;
  const styles = manifestCache.rooms[roomSlug].styles;
  for (const key of Object.keys(styles)) {
    total += styles[key].total;
  }
  return total;
}

export function buildRoomImageUrl(roomSlug, style, index = 0) {
  if (!manifestCache || !manifestCache.rooms[roomSlug]) return null;
  const styleData = manifestCache.rooms[roomSlug].styles[style];
  if (!styleData || !styleData.copied || styleData.copied.length <= index) return null;
  return imagePath(roomSlug, style, styleData.copied[index]);
}
