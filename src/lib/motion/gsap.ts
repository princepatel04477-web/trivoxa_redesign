'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

let registered = false;

export function registerGsapPlugins(): void {
  if (typeof window === 'undefined' || registered) return;
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Flip,
    ScrambleTextPlugin,
    DrawSVGPlugin,
    MorphSVGPlugin,
    CustomEase,
    Observer,
    useGSAP
  );

  CustomEase.create('trivoxa.out', '0.16, 1, 0.3, 1');
  CustomEase.create('trivoxa.inOut', '0.83, 0, 0.17, 1');
  CustomEase.create('trivoxa.snap', '0.7, 0, 0.3, 1');

  registered = true;
}

if (typeof window !== 'undefined') {
  registerGsapPlugins();
}

export const DURATION = {
  fast: 0.35,
  base: 0.7,
  slow: 1.2,
  cinematic: 1.8,
} as const;

export const EASE = {
  out: 'trivoxa.out',
  inOut: 'trivoxa.inOut',
  snap: 'trivoxa.snap',
} as const;

export {
  gsap,
  ScrollTrigger,
  SplitText,
  Flip,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  MorphSVGPlugin,
  CustomEase,
  Observer,
  useGSAP,
};
export default gsap;
