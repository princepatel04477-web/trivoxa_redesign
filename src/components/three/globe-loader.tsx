'use client';

import { usePerfTier } from '@/lib/perf-tier';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { StaticMap } from './static-map';
import { TacticalGlobe } from './tactical-globe';

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

  if (tier === 'low') {
    return <StaticMap className="h-full w-full" />;
  }

  return (
    <div className="relative h-full w-full">
      <TacticalGlobe
        className="h-full w-full"
        interaction={{
          autoRotate: !reduced,
          autoRotateSpeed: 4.5,
          enableDrag: true,
          showStars: true,
          showLabels: false,
          glowIntensity: 0.45,
        }}
      />
    </div>
  );
}

