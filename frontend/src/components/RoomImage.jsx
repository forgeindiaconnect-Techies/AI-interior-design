import React, { useState, useEffect } from 'react';
import { loadManifest, buildRoomImageUrl, anyImageForRoom } from '../utils/roomImages';

const FALLBACK_COLORS = {
  kitchen: 'bg-amber-100',
  bedroom: 'bg-indigo-100',
  bathroom: 'bg-cyan-100',
  living_room: 'bg-emerald-100',
};

const ROOM_LABELS = {
  kitchen: 'Kitchen',
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  living_room: 'Living Room',
};

function DefaultPlaceholder({ room, className }) {
  const bg = FALLBACK_COLORS[room] || 'bg-gray-100';
  return (
    <div className={`${bg} ${className} flex items-center justify-center`}>
      <span className="text-gray-400 text-sm font-medium">
        {ROOM_LABELS[room] || room}
      </span>
    </div>
  );
}

export default function RoomImage({ room, style, index = 0, className = '', alt, ...imgProps }) {
  const [src, setSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      await loadManifest();
      if (cancelled) return;
      let url;
      if (style) {
        url = buildRoomImageUrl(room, style, index);
      }
      if (!url) {
        url = anyImageForRoom(room);
      }
      if (!cancelled) {
        setSrc(url);
        setError(false);
      }
    }
    resolve();
    return () => { cancelled = true; };
  }, [room, style, index]);

  if (error || !src) {
    return <DefaultPlaceholder room={room} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt || `${ROOM_LABELS[room] || room} design`}
      className={className}
      onError={() => setError(true)}
      {...imgProps}
    />
  );
}
