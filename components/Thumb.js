'use client';
import { useEffect, useState } from 'react';

export default function Thumb({ src, alt = '', className = '' }) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <img
      src={!src || broken ? '/no-image.svg' : src}
      alt={alt}
      onError={() => setBroken(true)}
      className={'thumb ' + className}
    />
  );
}
