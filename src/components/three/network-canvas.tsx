'use client';

import { useEffect, useRef } from 'react';
import { usePerfTier } from '@/lib/perf-tier';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { BRAND } from '@/lib/tokens/colors';

/**
 * The "dispersed particles reorganising into a network" backdrop (P8 C).
 *
 * Deliberately a 2D canvas, not WebGL: 6,000 points with nearest-neighbour
 * links costs a fraction of a second R3F scene, and the brief's own rule is
 * that R3F is for the eagle and the globe and nothing else.
 *
 * Medium tier and above only. At low tier (and under reduced motion) it
 * renders nothing at all — the section falls back to the static ivory surface
 * with its bronze hairline motif, which is the designed low path.
 */
export function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tier = usePerfTier();
  const reduced = usePrefersReducedMotion();
  const enabled = !reduced && tier !== 'low';

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const COUNT = 6000;
    const LINK_EVERY = 60; // link a sparse subset; 6k×6k pairs would melt a phone
    let width = 0;
    let height = 0;
    let frame = 0;
    let running = true;

    const points = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016,
      vy: (Math.random() - 0.5) * 0.00016,
      link: i % LINK_EVERY === 0,
    }));

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const espresso = BRAND.espresso.hex;

    const draw = (): void => {
      if (!running) return;
      frame += 1;

      context.clearRect(0, 0, width, height);

      for (const point of points) {
        point.x = (point.x + point.vx + 1) % 1;
        point.y = (point.y + point.vy + 1) % 1;
      }

      // sparse links first, under the dots
      context.strokeStyle = `${espresso}22`;
      context.lineWidth = 1;
      const linkable = points.filter((p) => p.link);
      context.beginPath();
      for (let i = 0; i < linkable.length; i += 1) {
        const a = linkable[i];
        const b = linkable[(i + 1) % linkable.length];
        if (!a || !b) continue;
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);
        if (dx < 0.12 && dy < 0.12) {
          context.moveTo(a.x * width, a.y * height);
          context.lineTo(b.x * width, b.y * height);
        }
      }
      context.stroke();

      context.fillStyle = `${espresso}30`;
      for (const point of points) {
        context.fillRect(point.x * width, point.y * height, 1, 1);
      }

      // ~30fps is plenty for an ambient layer and halves the cost
      if (frame % 2 === 0) requestAnimationFrame(draw);
      else setTimeout(() => requestAnimationFrame(draw), 16);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
    };
  }, [enabled]);

  if (!enabled) {
    // The designed low-tier motif: quiet bronze hairlines, no canvas at all.
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hairline-bronze absolute top-1/4 left-0 w-1/3 opacity-60" />
        <div className="hairline-bronze absolute top-2/4 right-0 w-1/4 opacity-40" />
        <div className="hairline-bronze absolute top-3/4 left-1/4 w-1/2 opacity-30" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
