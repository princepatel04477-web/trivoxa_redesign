'use client';

import { useEffect, useState, type ComponentType } from 'react';
import Image from 'next/image';
import { usePerfTier } from '@/lib/perf-tier';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { EAGLE_PARTICLES } from '@/lib/three/eagle-points';
import { WebGLErrorBoundary } from './webgl-error-boundary';

type EagleSceneModule = {
  EagleScene: ComponentType<{ count: number; bloom: boolean }>;
};

/**
 * <EagleLoader> — the gate between the visitor and three.js (P6 tiering).
 *
 *   high   → 80k particles + bloom
 *   medium → 25k particles, no post-processing
 *   low    → the static poster. No WebGL context is created, and — because the
 *            import lives inside this effect, behind the tier check — the
 *            three.js chunk is never even downloaded.
 *   reduced motion → the static path, always.
 *
 * The headline, sub and CTAs are server-rendered and readable before any of
 * this resolves; LCP is the headline, never the canvas.
 */
export function EagleLoader() {
  const tier = usePerfTier();
  const reduced = usePrefersReducedMotion();
  const [scene, setScene] = useState<EagleSceneModule | null>(null);

  const staticPath = reduced || tier === 'low';

  useEffect(() => {
    if (staticPath) return;
    let cancelled = false;

    import('./eagle-scene')
      .then((module) => {
        if (!cancelled) setScene(module);
      })
      .catch(() => {
        if (!cancelled) setScene(null);
      });

    return () => {
      cancelled = true;
    };
  }, [staticPath]);

  if (staticPath || !scene) return <EaglePoster />;

  const { EagleScene } = scene;

  return (
    <WebGLErrorBoundary fallback={<EaglePoster />}>
      <div className="absolute inset-0" aria-hidden>
        <EagleScene count={tier === 'high' ? EAGLE_PARTICLES.high : EAGLE_PARTICLES.medium} bloom={tier === 'high'} />
      </div>
    </WebGLErrorBoundary>
  );
}

/**
 * The low-tier / reduced-motion / failed-WebGL still. Built at build time from
 * the SAME sampler as the live scene (scripts/build-brand.ts), so the static
 * path and the WebGL path are provably the same eagle.
 */
export function EaglePoster() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <Image
        src="/brand/eagle-poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain opacity-90"
      />
    </div>
  );
}
