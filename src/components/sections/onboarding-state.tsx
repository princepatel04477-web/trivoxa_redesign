import Link from 'next/link';
import { StatusBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';

/**
 * The ONE designed empty state, used everywhere something is `onboarding`.
 *
 * July 2026 audit: Furniture & Interiors was marketed as an active export line
 * in three places while its own page said the portfolio "is being finalised
 * with our manufacturing partners." The fix is a state that reads as
 * deliberate — honest heading, what IS available today, an expected timeframe
 * where one exists, and a route into an RFQ. It must never feel like a page
 * that failed to load.
 */
export function OnboardingState({
  name,
  availableToday,
  timeframe,
  note,
  rfqHref = '/rfq',
}: {
  name: string;
  availableToday: string[];
  timeframe?: string;
  note?: string;
  /** Where "tell us what you are sourcing" goes; carries context when it can. */
  rfqHref?: string;
}) {
  return (
    <div className="border-bronze/40 surface-raised flex flex-col gap-md border p-xl">
      <StatusBadge status="onboarding" detail={timeframe} />

      <h3 className="text-heading-lg">
        {name} is being built with our manufacturing partners.
      </h3>

      <p className="surface-muted text-body-md">
        {note ??
          'We publish a line only when we can quote it properly — with specifications, MOQs and lead times, not promises.'}
      </p>

      {availableToday.length > 0 ? (
        <div>
          <p className="eyebrow mb-xs">Available today</p>
          <ul className="surface-muted flex flex-col gap-1 text-body-sm">
            {availableToday.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden className="bg-bronze size-1 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-md flex flex-wrap gap-md">
        <ButtonLink href={rfqHref} variant="secondary" size="sm" arrow>
          Tell us what you are sourcing
        </ButtonLink>
        <Link href="/compliance" className="link-underline surface-muted self-center text-body-sm">
          See what we are certifying, and when
        </Link>
      </div>
    </div>
  );
}
