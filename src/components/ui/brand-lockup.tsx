import { cn } from '@/lib/utils';
import {
  MARK_VIEWBOX,
  WORDMARK_CAP_HEIGHT,
  WORDMARK_WIDTH,
  markPathData,
  wordmarkPathData,
} from '@/lib/brand/wordmark-paths';

/**
 * BrandLockup — the eagle mark and the TRIVOXA wordmark as inline SVG.
 *
 * Inline, not <img>: the lockup must inherit `currentColor` so it inverts
 * correctly on every surface without a second asset, and must not depend on
 * webfont loading (the wordmark is vector geometry — see wordmark-paths.ts).
 *
 * PROVISIONAL. When the real logo pack lands in public/brand/_incoming/,
 * this component becomes a thin wrapper over the real SVG and nothing else
 * changes. `npm run check:brand` tracks the swap.
 */

export type LockupVariant = 'mark' | 'wordmark' | 'lockup';

export type BrandLockupProps = {
  variant?: LockupVariant;
  /** Height of the mark in px. The wordmark scales from the same grid. */
  size?: number;
  className?: string;
  /** Accessible name. Decorative placements should pass `decorative`. */
  label?: string;
  decorative?: boolean;
};

const MARK = markPathData();
const WORD = wordmarkPathData();

export function BrandMark({ size = 32, className, decorative = false, label = 'Trivoxa' }: Omit<BrandLockupProps, 'variant'>) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      fill="none"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      className={cn('shrink-0', className)}
    >
      <path fill="currentColor" d={MARK} />
    </svg>
  );
}

export type BrandWordmarkProps = {
  /** Cap height in px. */
  height?: number;
  className?: string;
  label?: string;
  decorative?: boolean;
};

export function BrandWordmark({ height = 14, className, decorative = false, label = 'Trivoxa' }: BrandWordmarkProps) {
  const width = (WORDMARK_WIDTH / WORDMARK_CAP_HEIGHT) * height;
  return (
    <svg
      viewBox={`0 0 ${WORDMARK_WIDTH} ${WORDMARK_CAP_HEIGHT}`}
      width={width}
      height={height}
      fill="none"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      className={cn('shrink-0', className)}
    >
      <path fill="currentColor" fillRule="evenodd" d={WORD} />
    </svg>
  );
}

export function BrandLockup({ variant = 'lockup', size = 32, className, label, decorative }: BrandLockupProps) {
  if (variant === 'mark') return <BrandMark size={size} className={className} decorative={decorative} label={label} />;
  if (variant === 'wordmark') return <BrandWordmark height={size * 0.42} className={className} decorative={decorative} label={label} />;

  const wordHeight = size * 0.42;
  const gap = size * 0.375;

  return (
    <span
      className={cn('inline-flex items-center', className)}
      style={{ gap }}
      {...(decorative ? { 'aria-hidden': true } : {})}
    >
      <BrandMark size={size} decorative />
      <BrandWordmark height={wordHeight} decorative label={label ?? 'Trivoxa Group'} />
      {!decorative && label ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
