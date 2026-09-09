import Link from 'next/link';
import { cn } from '@/lib/utils';

export type Crumb = { href: string; label: string };

/** Breadcrumb — the audit wants BreadcrumbList JSON-LD sitewide; this is the
 *  visible half. Rendered from route data, never hardcoded strings. */
export function Breadcrumb({ trail, className }: { trail: Crumb[]; className?: string }) {
  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn('surface-muted text-body-sm', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="surface-fg font-medium">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link href={crumb.href} className="link-underline transition-colors hover:text-accent">
                    {crumb.label}
                  </Link>
                  <span aria-hidden className="surface-faint">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
