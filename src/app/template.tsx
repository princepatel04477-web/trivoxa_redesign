'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Route arrival: a quick, cheap fade + rise on the new page's content.
 * Used to cross-fade behind an opaque full-screen wipe on every navigation;
 * that additional ~450ms of hidden content on top of Lenis + the preloader
 * compounded into visible sitewide lag, so the transition is content-only
 * now — nothing blocks the new page from being visible immediately.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pathname, reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {children}
    </div>
  );
}
