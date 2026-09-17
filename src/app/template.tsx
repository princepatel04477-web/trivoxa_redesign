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
    const handleHash = () => {
      if (wipeRef.current) {
        wipeRef.current.style.display = 'none';
      }
    };
    window.addEventListener('hashchange', handleHash);

    if (reducedMotion) {
      if (wipeRef.current) {
        wipeRef.current.style.display = 'none';
      }
      return () => window.removeEventListener('hashchange', handleHash);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (wipeRef.current) {
            wipeRef.current.style.display = 'none';
          }
          ScrollTrigger.refresh();
        },
      });

      if (wipeRef.current) {
        wipeRef.current.style.display = 'block';
        tl.fromTo(
          wipeRef.current,
          { scaleY: 1, transformOrigin: 'top' },
          { scaleY: 0, duration: 0.45, ease: 'power2.out' }
        );
      }

      if (containerRef.current) {
        tl.fromTo(
          containerRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          '-=0.25'
        );
      }
    }, containerRef);

    return () => {
      window.removeEventListener('hashchange', handleHash);
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
