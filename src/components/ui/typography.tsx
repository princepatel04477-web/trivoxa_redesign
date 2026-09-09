import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { KineticTextReveal } from '@/components/motion/kinetic-text-reveal';

/**
 * Eyebrow — the section label the content docs call out:
 * OUR BUSINESSES, INDUSTRIES WE SERVE, WHY TRIVOXA, GLOBAL PRESENCE.
 * Uppercase, letterspaced, 12–13px. Optional bronze tick on the left.
 */
export function Eyebrow({
  children,
  tick = true,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode;
  tick?: boolean;
  className?: string;
  as?: 'p' | 'span' | 'h2' | 'h3' | 'div';
}) {
  return (
    <Tag className={cn('eyebrow flex items-center gap-xs', className)}>
      {tick ? (
        <span aria-hidden className="bg-bronze inline-block h-[3px] w-6 shrink-0" />
      ) : null}
      {children}
    </Tag>
  );
}

export type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  /** Lede paragraph under the heading. Keep it to one or two sentences. */
  lede?: ReactNode;
  /** Right-aligned slot for a "view all" affordance or CTA. */
  action?: ReactNode;
  align?: 'left' | 'center';
  /** Heading level. h2 by default; pages own the single h1. */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm';
  /** Whether to animate title with kinetic word reveal (default: true) */
  reveal?: boolean;
  className?: string;
  id?: string;
};

/**
 * SectionHeading — the one way a section introduces itself.
 *
 * `action` exists specifically so the homepage's "View all N industries →"
 * affordance can never be forgotten again (July 2026 audit: the homepage
 * silently showed a subset with no way to reach the rest).
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  action,
  align = 'left',
  as: Tag = 'h2',
  size = 'display-md',
  reveal = true,
  className,
  id,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <header
      className={cn(
        'flex flex-col gap-lg',
        centered ? 'items-center text-center' : 'items-start',
        className,
      )}
    >
      {eyebrow ? <Eyebrow tick={!centered}>{eyebrow}</Eyebrow> : null}

      <div
        className={cn(
          'flex w-full flex-col gap-lg',
          action && !centered ? 'md:flex-row md:items-end md:justify-between' : '',
        )}
      >
        <div className={cn('flex flex-col gap-md', centered ? 'items-center' : 'items-start')}>
          {reveal && typeof title === 'string' ? (
            <KineticTextReveal
              as={Tag}
              id={id}
              className={cn(
                size === 'display-xl' && 'text-display-xl',
                size === 'display-lg' && 'text-display-lg',
                size === 'display-md' && 'text-display-md',
                size === 'display-sm' && 'text-display-sm',
                'surface-fg',
              )}
            >
              {title}
            </KineticTextReveal>
          ) : (
            <Tag
              id={id}
              className={cn(
                size === 'display-xl' && 'text-display-xl',
                size === 'display-lg' && 'text-display-lg',
                size === 'display-md' && 'text-display-md',
                size === 'display-sm' && 'text-display-sm',
                'surface-fg',
              )}
            >
              {title}
            </Tag>
          )}
          {lede ? (
            <p className={cn('surface-muted text-body-lg max-w-[62ch]', centered && 'mx-auto')}>
              {lede}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}

/** A paragraph constrained to a readable measure. */
export function Prose({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('surface-muted flex max-w-[68ch] flex-col gap-md text-body-md', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
