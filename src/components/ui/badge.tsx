import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'accent' | 'outline';

/**
 * Badge — small caps label. Bronze appears here only as a 1px outline or a
 * small dot, never as a fill behind text (bronze-on-ivory body text fails AA
 * and breaks the brand rule).
 */
export function Badge({
  tone = 'neutral',
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1',
        'text-[0.6875rem] font-semibold tracking-[0.12em] uppercase',
        tone === 'neutral' && 'surface-muted surface-hairline',
        tone === 'accent' && 'border-bronze/60 text-bronze-ink',
        tone === 'outline' && 'surface-fg surface-hairline',
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

/**
 * The honest status label for anything not yet live.
 *
 * July 2026 audit: Furniture & Interiors was marketed as an active export line
 * in three places while its own page said the portfolio "is being finalised".
 * The fix is not to hide onboarding items — it is to label them with a
 * deliberate, designed marker everywhere, so a visitor is never sold a
 * catalogue row that turns out to be a promise.
 */
export function StatusBadge({
  status,
  detail,
  className,
}: {
  status: 'live' | 'active' | 'in-progress' | 'onboarding';
  detail?: string;
  className?: string;
}) {
  // 'live' and 'active' are the unmarked states: no badge is the signal that
  // the thing is real. Everything else is labelled, with its date if it has one.
  if (status === 'live' || status === 'active') return null;

  const label = status === 'in-progress' ? 'In progress' : 'Onboarding';

  return (
    <Badge tone="accent" className={cn('shrink-0', className)}>
      <span aria-hidden className="bg-bronze inline-block size-1.5 rounded-full" />
      <span>{detail ? `${label} — ${detail}` : label}</span>
    </Badge>
  );
}

/**
 * A spec chip: label + monospace value. The smallest unit of the site's
 * central idea — for this audience the numbers ARE the product.
 */
export function SpecChip({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex items-baseline gap-1.5', className)}>
      <span className="spec-label">{label}</span>
      <span className="spec-value" data-spec>
        {value}
      </span>
    </span>
  );
}
