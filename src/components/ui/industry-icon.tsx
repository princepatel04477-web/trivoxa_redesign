'use client';

import { useEffect, useRef } from 'react';
import {
  Armchair,
  Building2,
  Cog,
  Cpu,
  Gem,
  Pill,
  Shirt,
  ShoppingBag,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { DURATION } from '@/lib/tokens/motion';

/**
 * The industry icon set, resolved from the taxonomy's `icon` string so adding
 * an industry never requires touching a component — only this map, and only
 * if the new industry needs a glyph we don't have yet.
 *
 * Fine-line (1.25 stroke) per the brand. On first entry into view the paths
 * draw themselves with anime.js v4 (P8): cheap, crisp, and it keeps SVG
 * micro-animation in anime.js where docs/MOTION.md says it belongs. Reduced
 * motion skips the draw and shows the finished icon.
 */
const ICONS: Record<string, LucideIcon> = {
  Shirt,
  Pill,
  Building2,
  Armchair,
  Wheat,
  Cog,
  Cpu,
  ShoppingBag,
  Gem,
};

export function IndustryIcon({
  name,
  size = 28,
  className,
  drawIn = true,
}: {
  name: string;
  size?: number;
  className?: string;
  drawIn?: boolean;
}) {
  const Icon = ICONS[name] ?? Cog;
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!drawIn || reduced) return;
    const svg = wrapRef.current?.querySelector('svg');
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>('path, line, circle, rect'));
    const drawable = paths.filter((el) => (el.getTotalLength?.() ?? 0) > 0);
    if (drawable.length === 0) return;

    drawable.forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        // anime.js is loaded when an icon first enters view, not on first paint:
        // nine icons on an industry page should not cost a blocking library.
        void import('animejs').then(({ animate }) => {
          drawable.forEach((el, index) => {
            animate(el, {
              strokeDashoffset: [el.getTotalLength(), 0],
              duration: DURATION.slow,
              delay: index * 60,
              ease: 'outExpo',
            });
          });
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, [drawIn, reduced]);

  return (
    <span ref={wrapRef} className={className}>
      <Icon aria-hidden size={size} strokeWidth={1.25} />
    </span>
  );
}
