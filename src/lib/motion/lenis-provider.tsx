'use client';

import React, { useEffect, type ReactNode } from 'react';
import { ScrollTrigger } from './gsap';

/**
 * LenisProvider — Preserves native, responsive 120Hz browser scrolling.
 *
 * Artificial JS scroll-jacking with high durations (e.g. 1.2s lerp) causes
 * floatiness, input lag, and motion nausea on desktop wheels and precision trackpads.
 * Native browser scrolling gives 1:1 tactile precision, zero latency, and hardware
 * acceleration. GSAP's ScrollTrigger tracks window scrolling natively.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Refresh ScrollTrigger when DOM layout stabilizes
    ScrollTrigger.refresh();
  }, []);

  return <>{children}</>;
}

