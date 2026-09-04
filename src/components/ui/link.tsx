import type { AnchorHTMLAttributes, ReactNode } from 'react';
import NextLink from 'next/link';
import { cn, isExternalHref } from '@/lib/utils';

export type AppLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Suppress the animated bronze underline (e.g. inside the mega-menu). */
  underline?: boolean;
  ariaLabel?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children' | 'className'>;

/**
 * Link — the house link treatment: ink-coloured text with a 1px bronze
 * underline that draws in from the inline-start edge on hover/focus.
 * The origin flips under RTL so the draw direction stays correct in Arabic.
 */
export function Link({ href, children, className, underline = true, ...rest }: AppLinkProps) {
  const classes = cn('surface-fg transition-colors duration-fast ease-house', underline && 'link-underline', className);

  if (isExternalHref(href)) {
    return (
      <a href={href} className={classes} target={rest.target ?? '_blank'} rel="noreferrer noopener" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
}

/** An inline "see more" affordance with a travelling arrow. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn('group inline-flex items-center gap-2 font-medium', className)}>
      <span className="link-underline">{children}</span>
      <svg aria-hidden viewBox="0 0 20 12" className="h-3 w-5 shrink-0 text-bronze transition-transform duration-fast ease-house group-hover:translate-x-1 rtl:-scale-x-100" fill="none">
        <path d="M0 6h17M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </Link>
  );
}
