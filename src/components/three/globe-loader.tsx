'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePerfTier } from '@/lib/perf-tier';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { StaticMap } from './static-map';

// The globe is ~1.7k lines plus a topojson fetch + geometry indexing. None of
// that should run during page load for a section that sits far below the fold,
// so it is code-split and only mounted once the card is close to the viewport.
const TacticalGlobe = dynamic(
  () => import('./tactical-globe').then((module) => module.TacticalGlobe),
  { ssr: false }
);

/**
 * <GlobeLoader> — renders the signature Tactical 3D Globe with Trivoxa trade corridors.
 *
 *   high / medium → TacticalGlobe: 3D orthographic SVG sphere, Natural Earth 110m
 *                   topology, interactive drag-to-rotate, auto-spin, country hover
 *                   detection & tooltips, and trade corridor markers.
 *   low           → StaticMap: lightweight flat SVG chart fallback.
 */
export function GlobeLoader() {
  const tier = usePerfTier();
  const reduced = usePrefersReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (tier === 'low') {
    return <StaticMap className="h-full w-full" />;
  }

  return (
    <div ref={wrapperRef} className="relative h-full w-full">
      {near ? (
        <TacticalGlobe
          className="h-full w-full"
          interaction={{
            autoRotate: !reduced,
            autoRotateSpeed: 4.5,
            enableDrag: true,
            showStars: true,
            showLabels: true,
            glowIntensity: 0.45,
          }}
        />
      ) : null}
    </div>
  );
}
