import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Raised ground (ivory-soft on light, lifted espresso on dark). */
  raised?: boolean;
  /** Bronze border traces around the card on hover. The house hover. */
  trace?: boolean;
  /** Lift 4px with a soft espresso shadow on hover. */
  lift?: boolean;
  interactive?: boolean;
  children?: ReactNode;
};

/**
 * Card — flat, hairline-bordered, sharp-cornered.
 *
 * No radius, no gradient, no glassmorphism: the brand is hairlines and
 * surfaces. Hover is a 1px bronze trace plus an optional 4px lift, never a
 * colour wash. This restraint is the premium signal.
 */
export function Card({ raised = false, trace = false, lift = false, interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'group relative border',
        'surface-hairline',
        raised ? 'surface-raised' : 'bg-transparent',
        trace &&
          cn(
            'after:pointer-events-none after:absolute after:inset-[-1px] after:border after:border-bronze after:opacity-0',
            'after:transition-opacity after:duration-fast after:ease-house',
            'hover:after:opacity-100 focus-within:after:opacity-100',
          ),
        lift &&
          cn(
            'transition-[transform,box-shadow] duration-fast ease-house',
            'hover:-translate-y-1 hover:shadow-[var(--surface-shadow-lift)]',
          ),
        interactive && 'cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * The traced-border variant used by the "Why Trivoxa" pillars: the bronze
 * border draws itself around the card on hover (P7). Implemented as an
 * animating conic mask so it reads as one continuous line, not four edges.
 */
export function TraceCard({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <Card trace className={cn('p-lg', className)} {...rest}>
      {children}
    </Card>
  );
}
