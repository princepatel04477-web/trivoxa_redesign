'use client';

import React, { useEffect, useState, useRef } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import Noise from '@/components/reactbits/Noise/Noise';

export function Preloader() {
  const [show, setShow] = useState<boolean>(false);
  const reducedMotion = useReducedMotion();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const exitedRef = useRef<boolean>(false);

  const exitPreloader = () => {
    if (exitedRef.current) return;
    exitedRef.current = true;
    const el = preloaderRef.current || document.getElementById('trivoxa-preloader');
    if (el) {
      gsap.to(el, {
        clipPath: 'inset(0 0 100% 0)',
        opacity: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        onComplete: () => {
          setShow(false);
          window.dispatchEvent(new CustomEvent('trivoxa:ready'));
        },
      });
    } else {
      setShow(false);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
    }
  };

  useEffect(() => {
    if (reducedMotion) {
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      return;
    }

    try {
      const seen = sessionStorage.getItem('trivoxa_preloader_seen');
      if (seen) {
        window.dispatchEvent(new CustomEvent('trivoxa:ready'));
        return;
      }
      sessionStorage.setItem('trivoxa_preloader_seen', 'true');
    } catch {
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      return;
    }

    setShow(true);

    // Auto-exit after 1.6s
    const timer = setTimeout(() => {
      exitPreloader();
    }, 1600);

    // Hard fallback: after 2.2s force remove no matter what
    const fallbackTimer = setTimeout(() => {
      setShow(false);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
    }, 2200);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
    };
  }, [reducedMotion]);

  if (!show) return null;

  return (
    <div
      id="trivoxa-preloader"
      ref={preloaderRef}
      onClick={exitPreloader}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#241C18] text-[#F4EFE6] select-none cursor-pointer transition-opacity duration-300"
      style={{ clipPath: 'inset(0 0 0 0)' }}
      title="Click to skip"
    >
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <Noise patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={2} patternAlpha={15} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <SplitFlapText
          words={['SURAT', 'MUNDRA', 'JNPT', 'TRIVOXA']}
          loop={false}
          flipDuration={0.25}
          cycleDelay={200}
          textColor="#F4EFE6"
          tileColor="#171210"
          fontSize="48px"
        />
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex items-baseline gap-1 font-mono text-sm tracking-widest text-[#A88B68]">
        <CountUp from={0} to={100} duration={1.2} />
        <span>%</span>
      </div>

      <div className="absolute bottom-8 left-8 z-10 font-mono text-xs text-[#8C8279] opacity-60">
        Click anywhere to skip
      </div>
    </div>
  );
}
