'use client';

import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { DURATION, EASE_MOTION } from '@/lib/tokens/motion';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Entrance timing for the hero's non-headline copy (P6):
 * sub +200ms, CTAs +320ms, scroll cue +600ms — after the headline's mask
 * reveal. Under reduced motion the copy simply appears.
 */
export function HeroCopyMotion({ children, delay }: { children: ReactNode; delay: number }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduced ? 0 : delay / 1000,
        duration: reduced ? DURATION.instant / 1000 : DURATION.base / 1000,
        ease: EASE_MOTION.house,
      }}
    >
      {children}
    </motion.div>
  );
}
