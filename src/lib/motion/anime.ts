'use client';

import {
  animate,
  createTimeline,
  stagger,
  svg,
  utils,
  createScope,
  onScroll,
  text,
  createSpring,
  type Target,
} from 'animejs';

export {
  animate,
  createTimeline,
  stagger,
  svg,
  utils,
  createScope,
  onScroll,
  text,
  createSpring,
};

/**
 * Draws an SVG line/path smoothly
 */
export function drawLine(selectorOrElement: string | SVGGeometryElement | null, duration = 1200) {
  if (!selectorOrElement) return null;
  const drawable = svg.createDrawable(selectorOrElement);
  return animate(drawable, {
    draw: ['0 0', '0 1'],
    ease: 'inOutQuad',
    duration,
  });
}

/**
 * Staggers a grid of child elements
 */
export function staggerGrid(
  selectorOrElements: string | HTMLElement[] | NodeListOf<Element>,
  options: { from?: 'first' | 'last' | 'center'; delay?: number; duration?: number } = {}
) {
  const { from = 'first', delay = 60, duration = 600 } = options;
  return animate(selectorOrElements as Target, {
    opacity: [0, 1],
    translateY: [20, 0],
    delay: stagger(delay, { from }),
    duration,
    easing: 'outExpo',
  });
}

/**
 * Magnetic button press micro-interaction
 */
export function magneticPress(el: HTMLElement | null) {
  if (!el) return;
  animate(el, {
    scale: [1, 0.96, 1],
    duration: 250,
    easing: 'outQuad',
  });
}

/**
 * Rolls numbers smoothly from current to target
 */
export function numberRoll(
  el: HTMLElement | null,
  targetValue: number,
  options: { duration?: number; format?: (v: number) => string } = {}
) {
  if (!el) return;
  const { duration = 1000, format = (v) => Math.round(v).toString() } = options;
  const obj = { val: 0 };
  animate(obj, {
    val: targetValue,
    duration,
    easing: 'outExpo',
    onUpdate: () => {
      el.textContent = format(obj.val);
    },
  });
}
