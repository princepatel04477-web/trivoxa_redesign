'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'lg' | 'sm';

/**
 * Button variants, per the brand rules:
 *   primary   — espresso ground / ivory ink on light surfaces,
 *               ivory ground / espresso ink on dark surfaces (inverts).
 *   secondary — 1px outline in the surface ink.
 *   ghost     — ink only.
 * Every variant's hover treatment is bronze: the underline/border shifts to
 * bronze. Bronze is never a button background — the header's persistent
 * "Request a Quote" is the single bronze-heavy element, and it is bronze by
 * *accent*, not by fill.
 */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: cn(
    'border border-transparent',
    '[data-surface=light]_&:bg-espresso [data-surface=light]_&:text-ivory',
    '[data-surface=dark]_&:bg-ivory [data-surface=dark]_&:text-espresso',
    '[data-surface=deep]_&:bg-ivory [data-surface=deep]_&:text-espresso-deep',
    'hover:border-bronze',
  ),
  secondary: cn(
    'surface-fg border-current bg-transparent',
    'hover:border-bronze hover:text-bronze',
  ),
  ghost: cn('surface-fg border border-transparent bg-transparent', 'hover:text-bronze'),
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-body-sm gap-2',
  md: 'h-12 px-6 text-body-md gap-2.5',
  lg: 'h-14 px-8 text-body-lg gap-3',
};

const BASE = cn(
  'relative inline-flex items-center justify-center font-medium',
  'rounded-control select-none whitespace-nowrap',
  'transition-[color,background-color,border-color,transform] duration-fast ease-house',
  'hover:-translate-y-px active:translate-y-0',
  'disabled:pointer-events-none disabled:opacity-45',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze',
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a trailing arrow that travels 4px on hover. */
  arrow?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', arrow = false, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {children}
      {arrow ? <ButtonArrow /> : null}
    </button>
  );
});

export type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  arrow?: boolean;
  className?: string;
  children?: ReactNode;
  external?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
};

/** The same button, as a link. Next Link internally, plain <a> externally. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  className,
  children,
  external = false,
  onClick,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer noopener" onClick={onClick} {...rest}>
        {children}
        {arrow ? <ButtonArrow /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick} {...rest}>
      {children}
      {arrow ? <ButtonArrow /> : null}
    </Link>
  );
}

function ButtonArrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 12"
      className="h-3 w-5 shrink-0 transition-transform duration-fast ease-house group-hover:translate-x-1 rtl:-scale-x-100"
      fill="none"
    >
      <path d="M0 6h17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
