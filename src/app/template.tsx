'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Kill stale ScrollTriggers before transitioning in
      ScrollTrigger.getAll().forEach((st) => st.kill());

      const tl = gsap.timeline({
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });

      // Wipe reveal from bottom to top
      if (wipeRef.current) {
        tl.fromTo(
          wipeRef.current,
          { scaleY: 1, transformOrigin: 'top' },
          { scaleY: 0, duration: 0.5, ease: 'trivoxa.out' }
        );
      }

      if (containerRef.current) {
        tl.fromTo(
          containerRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'trivoxa.out' },
          '-=0.3'
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [pathname, reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] bg-[#241C18] origin-top"
      />
      {children}
    </div>
  );
}
