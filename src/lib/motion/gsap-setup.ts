'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';

let registered = false;

/**
 * ONE registerPlugin call for the whole app (P4).
 *
 * ScrollSmoother is a Club plugin and is not licensed here — Lenis covers
 * smooth scrolling instead, wired to GSAP's ticker below so ScrollTrigger
 * stays in perfect sync with the smoother.
 */
export function setupGsap(): typeof gsap {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
    gsap.defaults({ ease: 'power4.out', duration: 0.4 });
    registered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger, SplitText, Flip };
