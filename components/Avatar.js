'use client';
import { useEffect, useState } from 'react';

export default function Avatar({ user, src, size = 40, className = '' }) {
  const url = src !== undefined ? src : user && user.avatar_url;
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [url]);

  return (
    <span className={'avatar-img ' + className} style={{ width: size, height: size }}>
      {url && !broken ? (
        <img src={url} alt="" onError={() => setBroken(true)} />
      ) : (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="15" r="7" fill="currentColor" />
          <path d="M5 40c0-9 6.7-14 15-14s15 5 15 14z" fill="currentColor" />
        </svg>
      )}
    </span>
  );
}
