'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from './use-gsap';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * <MagneticButton> — cursor attraction, applied to the PRIMARY CTA only.
 *
 * One magnetic element per screen is a detail; five is a toy shop. Disabled
 * outright on touch devices and under reduced motion.
 */
export function MagneticButton({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    ({ gsap }) => {
      const root = ref.current;
      if (!root) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;

      const inner = root.firstElementChild as HTMLElement | null;
      if (!inner) return;

      const onMove = (event: PointerEvent): void => {
        const rect = root.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        gsap.to(inner, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const onLeave = (): void => {
        gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      };

      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
      return () => {
        root.removeEventListener('pointermove', onMove);
        root.removeEventListener('pointerleave', onLeave);
      };
    },
    { disabled: reduced, scope: ref },
  );

  return (
    <div ref={ref} className={className} data-magnetic>
      {children}
    </div>
  );
}
