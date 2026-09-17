'use client';

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, List } from 'lucide-react';
import { CatalogTable } from '@/components/sections/businesses/catalog-table';
import { ProductPixelGrid } from '@/components/sections/businesses/product-pixel-grid';
import { OnboardingState } from '@/components/sections/onboarding-state';
import { Container } from '@/components/ui/layout';
import { Eyebrow } from '@/components/ui/typography';
import { track } from '@/lib/analytics/events';
import { peekGsap, type GsapBundle } from '@/lib/motion/gsap-setup';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import type { CatalogFacet, CatalogRow } from '@/lib/selectors';

/**
 * P08 / P12 — The product catalogue with live filtering and debounced search.
 *
 * Product data exists EXACTLY ONCE in the DOM.
 *
 * Filters:
 *  · ONE facet computed from the catalogue with live counts;
 *  · Text search filter over product name and HS code (debounced 150ms);
 *  · Accessible filter chips with `aria-pressed`, keyboard navigation, and min 44px touch targets;
 *  · URL synchronization via `?category=slug` so filtered views are shareable and back-button correct;
 *  · Single semantic table that reflows into cards on mobile via responsive CSS;
 *  · Result count is an `aria-live="polite"` region;
 *  · GSAP Flip transitions row repositioning smoothly (bypassed on reduced motion).
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
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, 150);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const scopeRef = useRef<HTMLDivElement | null>(null);
  const flipState = useRef<ReturnType<GsapBundle['Flip']['getState']> | null>(null);

  const validCategory = facets.some((facet) => facet.slug === category) ? category : 'all';
  const activeFacet = facets.find((facet) => facet.slug === validCategory);

  const visible = useMemo(() => {
    return rows.filter((row) => {
      const matchesCategory = validCategory === 'all' || row.categorySlug === validCategory;
      if (!matchesCategory) return false;
      if (!debouncedQuery) return true;
      const matchesName = row.name.toLowerCase().includes(debouncedQuery);
      const matchesHs = row.hsCode?.toLowerCase().includes(debouncedQuery) ?? false;
      const matchesCategoryName = row.categoryName.toLowerCase().includes(debouncedQuery);
      return matchesName || matchesHs || matchesCategoryName;
    });
  }, [rows, validCategory, debouncedQuery]);

  const select = (slug: string): void => {
    const bundle = peekGsap();
    if (!reduced && bundle && scopeRef.current) {
      flipState.current = bundle.Flip.getState(scopeRef.current.querySelectorAll('[data-row]'));
    }

    setCategory(slug);
    router.replace(slug === 'all' ? pathname : `${pathname}?category=${slug}`, { scroll: false });
    track('catalog_filter', {
      category: slug,
      visibleRows: rows.filter((row) => slug === 'all' || row.categorySlug === slug).length,
    });
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
      <Suspense fallback={null}>
        <SearchParamsListener onCategory={(cat) => setCategory(cat ?? 'all')} />
      </Suspense>
      <Container>
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col gap-md">
            <Eyebrow tick={false} className="surface-faint">
              Browse by industry
            </Eyebrow>
            <div className="flex flex-wrap gap-xs" role="toolbar" aria-label="Filter catalogue by industry">
              <FilterChip
                active={validCategory === 'all'}
                label="All"
                count={rows.length}
                onClick={() => select('all')}
              />
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

          {/* Search bar */}
          <div className="relative max-w-[28rem]">
            <label htmlFor="catalog-search" className="sr-only">
              Filter catalogue by product name or HS code
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-md text-bronze/70">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="catalog-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Filter by product name or HS code (e.g. Cotton, 5209)..."
              className="surface-raised surface-hairline surface-fg placeholder:surface-faint min-h-[44px] w-full border py-xs pl-2xl pr-xl text-body-sm transition-colors duration-fast focus:border-bronze focus:outline-none"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                aria-label="Clear search input"
                className="surface-faint hover:surface-fg absolute inset-y-0 right-0 flex items-center pr-md text-body-sm transition-colors"
              >
                ✕
              </button>
            ) : null}
          </div>
        </div>

        {/* the count that always names the total — aria-live region, plus View Mode Toggle */}
        <div className="mt-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="surface-muted text-body-sm" aria-live="polite">
            Showing <span className="surface-fg spec-value" data-spec>{visible.length}</span> of{' '}
            <span className="surface-fg spec-value" data-spec>{rows.length}</span> products ·{' '}
            <span className="surface-fg spec-value" data-spec>{liveCount}</span> live today
            {validCategory !== 'all' || debouncedQuery ? (
              <>
                {' '}
                ·{' '}
                <button
                  type="button"
                  onClick={() => {
                    select('all');
                    setSearchInput('');
                  }}
                  className="link-underline text-bronze-ink font-medium"
                >
                  Reset filters
                </button>
              </>
            ) : null}
          </p>

          <div className="flex items-center gap-1 self-start sm:self-auto rounded-lg border border-stone-200 bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view with pixel spec reveal"
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-espresso text-ivory-soft shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Grid (Spec Reveal)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              aria-pressed={viewMode === 'table'}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-espresso text-ivory-soft shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <List className="size-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          activeFacet && activeFacet.status === 'onboarding' && !debouncedQuery ? (
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
            <EmptyState
              onClear={() => {
                select('all');
                setSearchInput('');
              }}
              searchQuery={debouncedQuery}
              onClearSearch={() => setSearchInput('')}
            />
          )
        ) : viewMode === 'grid' ? (
          <ProductPixelGrid rows={visible} />
        ) : (
          <CatalogTable rows={visible} />
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
        'inline-flex min-h-[44px] items-center border px-md py-xs text-body-sm transition-colors duration-fast ease-house focus:outline-none focus-visible:ring-1 focus-visible:ring-bronze',
        active
          ? 'border-bronze bg-espresso text-ivory'
          : 'surface-hairline surface-muted hover:border-bronze/60 hover:text-bronze-ink',
      ].join(' ')}
    >
      <span>{label}</span>
      <span className="spec-value ml-2 opacity-70" data-spec>
        {count}
      </span>
      {status === 'onboarding' ? (
        <span className="surface-faint ml-2 text-body-sm italic">onboarding</span>
      ) : null}
    </button>
  );
}

function EmptyState({
  onClear,
  searchQuery,
  onClearSearch,
}: {
  onClear: () => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}) {
  return (
    <div className="border-bronze/40 surface-raised mt-xl flex flex-col gap-md border p-xl">
      <Eyebrow tick={false} className="surface-faint">
        No products match
      </Eyebrow>
      <p className="surface-fg text-body-lg">
        {searchQuery
          ? `No products match “${searchQuery}” in this view.`
          : 'That filter has no catalogue rows today.'}
      </p>
      <p className="surface-muted text-body-md max-w-[58ch]">
        We source outside the published catalogue on request — send the specification and the desk
        will confirm whether it can be produced to grade, with an MOQ and a lead time.
      </p>
      <div className="mt-sm flex flex-wrap gap-md">
        {searchQuery && onClearSearch ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="link-underline text-bronze-ink text-body-sm font-medium"
          >
            Clear search query
          </button>
        ) : null}
        <button
          type="button"
          onClick={onClear}
          className="link-underline text-bronze-ink text-body-sm font-medium"
        >
          Reset all filters
        </button>
        <Link href="/rfq" className="link-underline text-bronze-ink text-body-sm font-medium">
          Request a sourced quotation →
        </Link>
      </div>
    </div>
  );
}

function SearchParamsListener({ onCategory }: { onCategory: (cat: string | null) => void }) {
  const searchParams = useSearchParams();
  const cat = searchParams.get('category');
  useEffect(() => {
    if (cat) onCategory(cat);
  }, [cat, onCategory]);
  return null;
}
