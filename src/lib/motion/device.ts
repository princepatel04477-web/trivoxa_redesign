'use client';

/**
 * Detects low-power devices to fall back to CSS gradients and Noise instead of WebGL
 */
export function isLowPower(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean };
    };

    const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4;
    const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4;
    const saveData = Boolean(nav.connection?.saveData);

    return lowCores || lowMemory || saveData;
  } catch {
    return false;
  }
}
