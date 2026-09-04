'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CatalogCards, CatalogTable } from '@/components/sections/businesses/catalog-table';
import { OnboardingState } from '@/components/sections/onboarding-state';
import { Container } from '@/components/ui/layout';
import { Eyebrow } from '@/components/ui/typography';
import { peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import type { CatalogFacet, CatalogRow } from '@/lib/selectors';

/**
 * P12 — the product catalogue, with its numbers.
 *
 * This table is the reason the site exists: HS code, grade, MOQ, lead time,
 * Incoterms and loading port, all in the data face, all from the taxonomy. The
 * July audit called the catalogue "the best single piece of execution" on the
 * live site and then found a Fabrics table with dashes where specifications
 * should be — so a `live` row that is missing any of those fields cannot exist
 * (the schema rejects it), and an `onboarding` row says so in bronze instead of
 * printing an em-dash and hoping nobody notices.
 *
 * Filters:
 *  · ONE facet, computed from the catalogue with live counts. In this taxonomy
 *    a category's slug is its industry's slug, so the live site's "7 category
 *    links vs 5 industries" was one list counted twice — offering both would
 *    re-create exactly that confusion;
 *  · zero-count (onboarding) facets stay visible as chips and open the designed
 *    onboarding state, never a blank table and never a silent disappearance;
 *  · the filter lives in the URL and is read SERVER-SIDE by the page, so a
 *    deep-linked or crawled view contains its rows rather than a loading state;
 *  · the result count always names the total — "Showing 5 of 25";
 *  · transitions use GSAP Flip, recorded before React re-renders, so rows travel
 *    to their new positions instead of popping. Reduced motion skips it.
 */
export function ProductCatalog({
  rows,
  facets,
  initialCategory = 'all',
}: {
  rows: CatalogRow[];
  facets: CatalogFacet[];
  /** Read from `searchParams` by the server page; the URL is the source. */
  initialCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  const [category, setCategory] = useState(initialCategory);
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const flipState = useRef<ReturnType<GsapBundle['Flip']['getState']> | null>(null);

  const validCategory = facets.some((facet) => facet.slug === category) ? category : 'all';
  const activeFacet = facets.find((facet) => facet.slug === validCategory);

  const visible = useMemo(
    () => rows.filter((row) => validCategory === 'all' || row.categorySlug === validCategory),
    [rows, validCategory],
  );

  const select = (slug: string): void => {
    // GSAP is loaded off the critical path. Capturing the pre-change layout has
    // to happen in this frame or not at all, so if the bundle has not landed yet
    // we simply skip the Flip — rows swap instantly, which is correct, just less
    // graceful. By the time a buyer is clicking filters it is always there.
    const bundle = peekGsap();
    if (!reduced && bundle && scopeRef.current) {
      flipState.current = bundle.Flip.getState(scopeRef.current.querySelectorAll('[data-row]'));
    }

    setCategory(slug);
    router.replace(slug === 'all' ? pathname : `${pathname}?category=${slug}`, { scroll: false });
  };

  /* Flip.from runs after React has swapped the rows in */
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !scopeRef.current) return;
    flipState.current = null;

    const bundle = peekGsap();
    if (!bundle) return;
    const { gsap, Flip } = bundle;

    Flip.from(state, {
      targets: scopeRef.current.querySelectorAll('[data-row]'),
      duration: 0.5,
      ease: 'power3.out',
      absolute: true,
      scale: false,
      onEnter: (elements) => {
        gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.02 });
      },
      onLeave: (elements) => {
        gsap.to(elements, { opacity: 0, duration: 0.2 });
      },
    });
  });

  const liveCount = visible.filter((row) => row.status === 'live').length;

  return (
    <div ref={scopeRef}>
      <Container>
        <div className="flex flex-col gap-md">
          <Eyebrow tick={false} className="surface-faint">
            Browse by industry
          </Eyebrow>
          <div className="flex flex-wrap gap-xs">
            <FilterChip active={validCategory === 'all'} label="All" count={rows.length} onClick={() => select('all')} />
            {facets.map((facet) => (
              <FilterChip
                key={facet.slug}
                active={validCategory === facet.slug}
                label={facet.name}
                count={facet.count}
                status={facet.status}
                onClick={() => select(facet.slug)}
              />
            ))}
          </div>
        </div>

        {/* the count that always names the total */}
        <p className="surface-muted mt-xl text-body-sm" aria-live="polite">
          Showing <span className="surface-fg spec-value" data-spec>{visible.length}</span> of{' '}
          <span className="surface-fg spec-value" data-spec>{rows.length}</span> products ·{' '}
          <span className="surface-fg spec-value" data-spec>{liveCount}</span> live today
          {validCategory !== 'all' ? (
            <>
              {' '}
              ·{' '}
              <button
                type="button"
                onClick={() => select('all')}
                className="link-underline text-bronze-ink font-medium"
              >
                Clear filter
              </button>
            </>
          ) : null}
        </p>

        {visible.length === 0 ? (
          activeFacet && activeFacet.status === 'onboarding' ? (
            <div className="mt-xl">
              <OnboardingState
                name={activeFacet.name}
                note={activeFacet.note}
                availableToday={[
                  'Sourcing against a written specification, quoted per order',
                  'Samples by international courier, with an approval record',
                  'MOQ, lead time, Incoterms and loading port on the quotation',
                ]}
                rfqHref={`/rfq?category=${activeFacet.slug}`}
              />
            </div>
          ) : (
            <EmptyState onClear={() => select('all')} />
          )
        ) : (
          <>
            <CatalogTable rows={visible} />
            <CatalogCards rows={visible} />
          </>
        )}
      </Container>
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function FilterChip({
  active,
  label,
  count,
  status,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  status?: 'live' | 'onboarding';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'border px-md py-xs text-body-sm transition-colors duration-fast ease-house',
        active
          ? 'border-bronze bg-espresso text-ivory'
          : 'surface-hairline surface-muted hover:border-bronze/60 hover:text-bronze-ink',
      ].join(' ')}
    >
      {label}
      <span className="spec-value ml-2 opacity-70" data-spec>
        {count}
      </span>
      {status === 'onboarding' ? (
        <span className="surface-faint ml-2 text-body-sm italic">onboarding</span>
      ) : null}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-bronze/40 surface-raised mt-xl flex flex-col gap-md border p-xl">
      <Eyebrow tick={false} className="surface-faint">
        No products match
      </Eyebrow>
      <p className="surface-fg text-body-lg">That filter has no catalogue rows today.</p>
      <p className="surface-muted text-body-md max-w-[58ch]">
        We source outside the published catalogue on request — send the specification and the desk
        will confirm whether it can be produced to grade, with an MOQ and a lead time.
      </p>
      <div className="mt-sm flex flex-wrap gap-md">
        <button
          type="button"
          onClick={onClear}
          className="link-underline text-bronze-ink text-body-sm font-medium"
        >
          Clear filter
        </button>
        <a href="/rfq" className="link-underline text-bronze-ink text-body-sm font-medium">
          Request a sourced quotation →
        </a>
      </div>
    </div>
  );
}
