'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { usePerfTier } from '@/lib/perf-tier';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { StaticMap } from './static-map';
import { WebGLErrorBoundary } from './webgl-error-boundary';

type GlobeR3FModule = { GlobeR3F: ComponentType };

/**
 * <GlobeLoader> — the P9 tier gate, and the reason the globe is an independent
 * scene rather than a second consumer of the hero canvas.
 *
 *   high   → R3F dotted sphere, scrubbed corridor draw, hover labels, inertia
 *   medium → cobe (~5KB canvas), auto-rotate + drag, no arcs, no three.js
 *   low    → StaticMap: the SVG chart. No JS, no canvas, no context.
 *
 * Fallback-first, per the brief: StaticMap was designed and reviewed on its
 * own before either live globe existed, and every degraded path (reduced
 * motion, failed WebGL, unsupported device) lands there rather than in a gap.
 * The three.js chunk is imported inside the tier check, so a low-tier visitor
 * never downloads it.
 */
export function GlobeLoader() {
  const tier = usePerfTier();
  const reduced = usePrefersReducedMotion();
  const [module, setModule] = useState<GlobeR3FModule | null>(null);

  const staticPath = reduced || tier === 'low';

  useEffect(() => {
    if (staticPath || tier !== 'high') return;
    let cancelled = false;

    import('./globe-r3f')
      .then((m) => {
        if (!cancelled) setModule(m);
      })
      .catch(() => {
        if (!cancelled) setModule(null);
      });

    return () => {
      cancelled = true;
    };
  }, [staticPath, tier]);

  if (staticPath) return <StaticMap className="h-full w-full" />;

  if (tier === 'medium' || !module) {
    // cobe is itself a light dependency; lazy-load it so the R3F chunk and the
    // cobe chunk are never both in a visitor's budget.
    return <CobeGate />;
  }

  const { GlobeR3F } = module;

  return (
    <WebGLErrorBoundary fallback={<StaticMap className="h-full w-full" />}>
      <GlobeR3F />
    </WebGLErrorBoundary>
  );
}

function CobeGate() {
  const [Cobe, setCobe] = useState<ComponentType<{ className?: string }> | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    import('./globe-cobe')
      .then((m) => {
        if (!cancelled) setCobe(() => m.GlobeCobe);
      })
      .catch(() => {
        if (!cancelled) setCobe(null);
      });
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  if (reduced || !Cobe) return <StaticMap className="h-full w-full" />;

  return <Cobe className="mx-auto max-w-[560px]" />;
}
