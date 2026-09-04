/**
 * P4/P20 acceptance: the tier classification behaves the way the budget says,
 * including the specific case the brief calls out — "perf-tier returns 'low'
 * when throttled to 4x CPU slowdown + Slow 4G".
 */
import { describe, expect, it } from 'vitest';

import { PERF_THRESHOLDS, classifyPerfTier } from '@/lib/perf-tier';

const base = {
  hardwareConcurrency: 8,
  deviceMemory: 8,
  effectiveType: '4g',
  saveData: false,
  webglAvailable: true,
  reducedMotion: false,
} as const;

describe('classifyPerfTier', () => {
  it('returns high for a capable desktop', () => {
    expect(classifyPerfTier({ ...base })).toBe('high');
  });

  it('returns medium below the core/memory thresholds', () => {
    expect(classifyPerfTier({ ...base, hardwareConcurrency: 6 })).toBe('medium');
    expect(classifyPerfTier({ ...base, deviceMemory: 3 })).toBe('medium');
  });

  it('returns low for a 4x-throttled CPU on Slow 4G (the briefs acceptance case)', () => {
    // Chrome's 4x CPU slowdown on a 4-core laptop reports 4 cores; Slow 4G
    // reports effectiveType "3g". Either signal alone must force low.
    expect(classifyPerfTier({ ...base, hardwareConcurrency: 4, effectiveType: '3g' })).toBe('low');
    expect(classifyPerfTier({ ...base, hardwareConcurrency: 4 })).toBe('low');
    expect(classifyPerfTier({ ...base, effectiveType: '3g' })).toBe('low');
    expect(classifyPerfTier({ ...base, effectiveType: 'slow-2g' })).toBe('low');
  });

  it('returns low when saveData is on', () => {
    expect(classifyPerfTier({ ...base, saveData: true })).toBe('low');
  });

  it('returns low with no WebGL, whatever the hardware', () => {
    expect(classifyPerfTier({ ...base, webglAvailable: false })).toBe('low');
  });

  it('returns low under prefers-reduced-motion, always', () => {
    expect(classifyPerfTier({ ...base, reducedMotion: true })).toBe('low');
  });

  it('thresholds match the table recorded in docs/PERF-BUDGET.md', () => {
    expect(PERF_THRESHOLDS.minCoresForHigh).toBe(8);
    expect(PERF_THRESHOLDS.maxCoresForLow).toBe(4);
    expect(PERF_THRESHOLDS.minMemoryForHigh).toBe(4);
    expect(PERF_THRESHOLDS.maxMemoryForLow).toBe(2);
    expect([...PERF_THRESHOLDS.slowNetworks]).toEqual(['slow-2g', '2g', '3g']);
  });
});
