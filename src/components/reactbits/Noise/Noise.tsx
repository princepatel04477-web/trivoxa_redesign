'use client';

import React, { useRef, useEffect } from 'react';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  /** Kept for API compatibility; the grain now animates via a CSS step shift. */
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

const TILE = 512;

/**
 * Film grain.
 *
 * The previous version refilled a 1024x1024 ImageData (1M Math.random calls +
 * a 4MB texture upload) every second frame on the main thread — a permanent
 * ~10ms/frame tax anywhere it was visible (preloader, hero fallback, footer).
 *
 * Now the grain is generated ONCE with a fast xorshift PRNG into a small tile,
 * and the "boil" is a stepped CSS translate on an oversized copy, which the
 * compositor runs off the main thread (and skips entirely when off screen).
 */
const Noise: React.FC<NoiseProps> = ({ patternAlpha = 15 }) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = TILE;
    canvas.height = TILE;

    const imageData = ctx.createImageData(TILE, TILE);
    const px = new Uint32Array(imageData.data.buffer);
    const alpha = Math.max(0, Math.min(255, patternAlpha)) << 24;

    let seed = 0x9e3779b9;
    for (let i = 0; i < px.length; i++) {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      const v = seed & 0xff;
      // Little-endian RGBA: 0xAABBGGRR
      px[i] = alpha | (v << 16) | (v << 8) | v;
    }
    ctx.putImageData(imageData, 0, 0);
  }, [patternAlpha]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 h-screen w-screen overflow-hidden"
    >
      <canvas
        ref={grainRef}
        className="noise-grain absolute"
        style={{
          left: '-10%',
          top: '-10%',
          width: '120%',
          height: '120%',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
};

export default Noise;
