import type { ComponentType, ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Surface } from '@/lib/tokens/colors';

/**
 * Container — the 1440px content measure with a fluid gutter.
 * Every page-level block lives inside one; nothing sets its own max-width.
 */
export function Container({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container-content', className)} {...rest}>
      {children}
    </div>
  );
}

export type SectionProps = {
  /**
   * The canonical surface. Every section declares one; nothing improvises a
   * background. `light` | `dark` | `deep`.
   */
  surface?: Surface;
  /** Tighter vertical rhythm for bands (proof band, CTA strips). */
  tight?: boolean;
  /** Removes horizontal containment — full-bleed canvases and globes. */
  bleed?: boolean;
  as?: ElementType;
  id?: string;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'id'>;

/**
 * Section — the rhythm primitive.
 *
 * Vertical padding comes from `--spacing-section` (72–96px mobile,
 * 120–180px desktop) so the site never reads cramped, and the surface
 * contract (background, ink, hairlines, shadows) is inherited by every
 * descendant through `data-surface` CSS variables.
 */
export function Section({
  surface = 'light',
  tight = false,
  bleed = false,
  as: As = 'section',
  id,
  className,
  children,
  ...rest
}: SectionProps) {
  // Polymorphic tag. Our SectionProps validate the props; the union of every
  // intrinsic element collapses to `never`, so the tag is widened deliberately.
  const Tag = As as ComponentType<Record<string, unknown>>;

  return (
    <Tag
      id={id}
      data-surface={surface}
      className={cn(
        'surface-bg surface-fg relative',
        tight ? 'py-section-tight' : 'py-section',
        className,
      )}
      {...rest}
    >
      {bleed ? children : <Container>{children}</Container>}
    </Tag>
  );
}

/**
 * A hairline row: label left, rule right. Used to break long sections without
 * introducing card chrome — the brand's structural punctuation.
 */
export function HairlineRow({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-lg', className)}>
      {label ? <span className="eyebrow shrink-0">{label}</span> : null}
      <span aria-hidden className="hairline-bronze grow" />
    </div>
  );
}
