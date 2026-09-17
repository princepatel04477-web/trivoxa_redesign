'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from '@/lib/motion/gsap';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import CountUp from '@/components/reactbits/CountUp/CountUp';
import Noise from '@/components/reactbits/Noise/Noise';

export function Preloader() {
  const [show, setShow] = useState<boolean>(false);
  const reducedMotion = useReducedMotion();

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
      setShow(true);
    } catch {
      window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      return;
    }

    const timer = setTimeout(() => {
      const el = document.getElementById('trivoxa-preloader');
      if (el) {
        gsap.to(el, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.0,
          ease: 'trivoxa.inOut',
          onComplete: () => {
            setShow(false);
            window.dispatchEvent(new CustomEvent('trivoxa:ready'));
          },
        });
      } else {
        setShow(false);
        window.dispatchEvent(new CustomEvent('trivoxa:ready'));
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (!show) return null;

  return (
    <div
      id="trivoxa-preloader"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#241C18] text-[#F4EFE6] select-none"
      style={{ clipPath: 'inset(0 0 0 0)' }}
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
    </div>
  );
}
