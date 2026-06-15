import React, { useState, useEffect, useRef } from 'react';
import { loadManifest, anyImageForRoom, getRoomSlug } from '../utils/roomImages';

const resolveImageUrl = (url) => {
  if (!url) return url;
  const apiBase = import.meta.env.VITE_API_URL || 'https://ai-interior-final-project.onrender.com/api';
  const backendBase = apiBase.replace(/\/api\/?$/, '');
  let resolved = url;
  if (resolved.startsWith('/')) {
    resolved = `${backendBase}${resolved}`;
  }
  if (resolved.includes('localhost:5000')) {
    resolved = resolved.replace(/https?:\/\/localhost:5000/g, backendBase);
  }
  return resolved;
};

export default function AiFallbackImage({ src, roomType, className = '', alt = 'AI Design', ...imgProps }) {
  const [imgSrc, setImgSrc] = useState(resolveImageUrl(src));
  const [fallbackReady, setFallbackReady] = useState(false);
  const fallbackRef = useRef(null);

  useEffect(() => {
    setImgSrc(resolveImageUrl(src));
    setFallbackReady(false);
  }, [src]);

  useEffect(() => {
    let cancelled = false;
    async function prepare() {
      await loadManifest();
      if (cancelled) return;
      const slug = getRoomSlug(roomType);
      const fb = anyImageForRoom(slug);
      if (!cancelled) {
        fallbackRef.current = fb || null;
        setFallbackReady(true);
      }
    }
    prepare();
    return () => { cancelled = true; };
  }, [roomType]);

  function handleError(e) {
    if (fallbackRef.current) {
      setImgSrc(fallbackRef.current);
      fallbackRef.current = null;
    }
  }

  if (!imgSrc) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">No image available</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...imgProps}
    />
  );
}
