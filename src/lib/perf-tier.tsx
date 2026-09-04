'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/**
 * src/lib/perf-tier.ts — the device classification every WebGL scene obeys.
 * ---------------------------------------------------------------------------
 * A meaningful share of Trivoxa's buyers are in the Gulf, Africa and South
 * Asia on mid-tier mobile hardware over inconsistent connections. The July
 * audit flagged the 3D globe and the particle eagle as the highest technical
 * risk on the site. This module is the answer: one classification, made once,
 * read everywhere.
 *
 *   high   → full particle counts, bloom / post-processing
 *   medium → reduced particle counts, no post-processing
 *   low    → a static, beautifully-composed poster. Never a broken canvas.
 *
 * Thresholds live in docs/PERF-BUDGET.md and are asserted by
 * tests/perf-tier.test.ts, so they cannot drift from the document.
 */

export type PerfTier = 'high' | 'medium' | 'low';

export const PERF_THRESHOLDS = {
  /** navigator.hardwareConcurrency below this → at most medium. */
  minCoresForHigh: 8,
  /** navigator.hardwareConcurrency at or below this → low. */
  maxCoresForLow: 4,
  /** navigator.deviceMemory (GiB) below this → at most medium. */
  minMemoryForHigh: 4,
  /** navigator.deviceMemory at or below this → low. */
  maxMemoryForLow: 2,
  /** connection.effectiveType values that force low. */
  slowNetworks: ['slow-2g', '2g', '3g'] as const,
  /** connection.saveData forces low regardless of hardware. */
  saveDataForcesLow: true,
} as const;

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
};

type ClassifiedNavigator = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformation;
};

/**
 * Pure classification — exported separately so it is unit-testable without a
 * browser, and so the acceptance test ("perf-tier returns 'low' when throttled
 * to 4x CPU slowdown + Slow 4G") can drive it directly.
 */
export function classifyPerfTier(input: {
  hardwareConcurrency: number;
  deviceMemory?: number;
  effectiveType?: string;
  saveData?: boolean;
  webglAvailable: boolean;
  reducedMotion: boolean;
}): PerfTier {
  if (input.reducedMotion) return 'low';
  if (!input.webglAvailable) return 'low';
  if (input.saveData && PERF_THRESHOLDS.saveDataForcesLow) return 'low';
  if (
    input.effectiveType &&
    (PERF_THRESHOLDS.slowNetworks as readonly string[]).includes(input.effectiveType)
  ) {
    return 'low';
  }

  const cores = input.hardwareConcurrency || 4;
  const memory = input.deviceMemory;

  if (cores <= PERF_THRESHOLDS.maxCoresForLow) return 'low';
  if (memory !== undefined && memory <= PERF_THRESHOLDS.maxMemoryForLow) return 'low';

  if (cores < PERF_THRESHOLDS.minCoresForHigh) return 'medium';
  if (memory !== undefined && memory < PERF_THRESHOLDS.minMemoryForHigh) return 'medium';

  return 'high';
}

function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

function readEnvironment(): {
  hardwareConcurrency: number;
  deviceMemory?: number;
  effectiveType?: string;
  saveData?: boolean;
  webglAvailable: boolean;
  reducedMotion: boolean;
} {
  const nav = navigator as ClassifiedNavigator;
  return {
    hardwareConcurrency: nav.hardwareConcurrency ?? 4,
    deviceMemory: nav.deviceMemory,
    effectiveType: nav.connection?.effectiveType,
    saveData: nav.connection?.saveData,
    webglAvailable: probeWebGL(),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

const PerfTierContext = createContext<PerfTier>('medium');

/**
 * Initial tier is `medium` on the server AND on first client paint. That is
 * deliberate: no WebGL chunk is ever requested during SSR, and the canvas only
 * mounts inside an effect that re-checks the tier before dynamic-importing —
 * so a `low` device genuinely never downloads or mounts WebGL (P6/P9/P20).
 */
export function PerfTierProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<PerfTier>('medium');

  useEffect(() => {
    const environment = readEnvironment();
    const next = classifyPerfTier(environment);
    setTier((current) => (current === next ? current : next));

    // Networks change under a user (train, airport wifi). Re-check on
    // connectivity changes so a scene can stand down mid-session.
    const nav = navigator as ClassifiedNavigator;
    const connection = nav.connection as EventTarget | undefined;
    if (!connection) return;

    const onChange = (): void => setTier(classifyPerfTier(readEnvironment()));
    connection.addEventListener('change', onChange);
    return () => connection.removeEventListener('change', onChange);
  }, []);

  const value = useMemo(() => tier, [tier]);
  return <PerfTierContext.Provider value={value}>{children}</PerfTierContext.Provider>;
}

export function usePerfTier(): PerfTier {
  return useContext(PerfTierContext);
}

/** Convenience for "render the canvas branch at all?" */
export function useCanRenderWebGL(): boolean {
  return usePerfTier() !== 'low';
}
