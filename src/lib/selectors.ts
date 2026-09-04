/**
 * src/lib/selectors.ts — the ONLY way UI reaches into the taxonomy.
 * ---------------------------------------------------------------------------
 * Components never touch `INDUSTRIES` / `REGIONS` / `PRODUCTS` directly. They
 * call these selectors, which is what makes the drift-prevention rules
 * enforceable in one place:
 *
 *  · the footer region list and the Global Presence region list come from the
 *    SAME function, so they are identical by construction (P14 acceptance);
 *  · homepage previews slice and ALWAYS report the true total, so a silent
 *    subset is unrepresentable (P8 / audit finding);
 *  · proof-band numbers are computed, never typed.
 */
import {
  CATEGORIES,
  CONTACT,
  INDUSTRIES,
  PORTS,
  PRODUCTS,
  REGIONS,
  STATS,
} from '@/content/taxonomy';
import type { Category, Industry, Port, Region } from '@/content/schemas';

/* regions --------------------------------------------------------------- */

/** Footer "regions we serve" line. */
export function footerRegions(): Region[] {
  return REGIONS;
}

/**
 * Global Presence region list. Same array, same order as the footer — see
 * `regionBlocks()` below for the version with industries resolved.
 */
export function globalPresenceRegions(): Region[] {
  return REGIONS;
}

/* industries ------------------------------------------------------------ */

export type IndustryPreview = {
  shown: Industry[];
  total: number;
  /** The affordance text, computed — "View all 9 industries". */
  affordanceLabel: string;
};

/**
 * Homepage industries preview. Slices, but carries the true total and the
 * affordance label with it, so a page can render a subset WITHOUT the
 * "view all N" link only by deliberately discarding a required field.
 */
export function homepageIndustryPreview(count = 6): IndustryPreview {
  const shown = INDUSTRIES.slice(0, count);
  const total = INDUSTRIES.length;
  return {
    shown,
    total,
    affordanceLabel: `View all ${total} industries`,
  };
}

export function allIndustries(): Industry[] {
  return INDUSTRIES;
}

export function allCategories(): Category[] {
  return CATEGORIES;
}

export function allPorts(): Port[] {
  return PORTS;
}

/* proof band ------------------------------------------------------------ */

export type ProofBand = {
  ports: Port[];
  liveProductCount: number;
  liveCategoryCount: number;
  responseWindow: string;
  hoursIst: string;
  timezoneLabel: string;
};

/** Everything the proof band prints. Every number traces to data. */
export function proofBand(): ProofBand {
  return {
    ports: PORTS,
    liveProductCount: STATS.liveProductCount(),
    liveCategoryCount: STATS.liveCategoryCount(),
    responseWindow: CONTACT.responseWindow,
    hoursIst: CONTACT.hoursIst,
    timezoneLabel: CONTACT.timezoneLabel,
  };
}

/* presence in numbers ---------------------------------------------------- */

export type PresenceNumbers = {
  regions: number;
  industries: number;
  ports: number;
  products: number;
  responseWindow: string;
};

/** P14 "Presence in Numbers". Server-rendered; CountUp animates FROM these. */
export function presenceNumbers(): PresenceNumbers {
  return {
    regions: STATS.regionCount(),
    industries: STATS.industryCount(),
    ports: STATS.portCount(),
    products: STATS.liveProductCount(),
    responseWindow: CONTACT.responseWindow,
  };
}

/* catalog --------------------------------------------------------------- */

export function catalogProducts() {
  return PRODUCTS;
}

/**
 * A catalogue row, fully resolved: names instead of slugs, so the client
 * component that renders and filters the table never has to join data itself
 * (and cannot accidentally join it differently from an industry page).
 */
export type CatalogRow = {
  slug: string;
  name: string;
  status: 'live' | 'onboarding';
  categorySlug: string;
  categoryName: string;
  industrySlug: string;
  industryName: string;
  hsCode: string | null;
  grade: string | null;
  moq: string | null;
  leadTime: string | null;
  incoterms: string[];
  portLocode: string | null;
  portName: string | null;
  certificationNote: string | null;
  applications: string[];
};

export function catalogRows(): CatalogRow[] {
  return PRODUCTS.map((product) => {
    const category = CATEGORIES.find((entry) => entry.slug === product.categorySlug);
    const industry = INDUSTRIES.find((entry) => entry.slug === category?.industrySlug);
    const port = PORTS.find((entry) => entry.slug === product.portSlug);

    return {
      slug: product.slug,
      name: product.name,
      status: product.status,
      categorySlug: product.categorySlug,
      categoryName: category?.name ?? product.categorySlug,
      industrySlug: industry?.slug ?? 'uncategorised',
      industryName: industry?.name ?? 'Uncategorised',
      hsCode: product.hsCode ?? null,
      grade: product.grade ?? null,
      moq: product.moq ?? null,
      leadTime: product.leadTime ?? null,
      incoterms: product.incoterms ?? [],
      portLocode: port?.locode ?? null,
      portName: port?.name ?? null,
      certificationNote: product.certificationNote ?? null,
      applications: product.applications,
    };
  });
}

/**
 * Catalogue filter facets — computed, never a hardcoded chip list.
 *
 * ONE dimension, deliberately. In this taxonomy a category's slug IS its
 * industry's slug (checked by `check-taxonomy`), so the live site's "7 category
 * links vs 5 industries" was the same list counted two ways. Offering both as
 * filters would re-create that confusion.
 *
 * Zero-count categories are INCLUDED with their status, so an onboarding line
 * is visible as a chip that leads to the designed onboarding state rather than
 * disappearing from the navigation — the silent-subset rule again.
 */
export type CatalogFacet = {
  slug: string;
  name: string;
  count: number;
  status: 'live' | 'onboarding';
  /** The industry's own one-line status note, for the onboarding state. */
  note: string;
};

export function catalogFacets(): CatalogFacet[] {
  const rows = catalogRows();

  return CATEGORIES.map((category) => {
    const industry = INDUSTRIES.find((entry) => entry.slug === category.industrySlug);
    return {
      slug: category.slug,
      name: category.name,
      count: rows.filter((row) => row.categorySlug === category.slug).length,
      status: category.status,
      note: industry?.shortDescription ?? category.overview,
    };
  });
}

/* industries ------------------------------------------------------------ */

export type IndustryPage = {
  industry: Industry;
  categories: Category[];
  /** Catalogue rows for this industry, fully resolved. */
  rows: CatalogRow[];
  regions: Region[];
  /** The other industries, for the related-links rail. Excludes this one. */
  related: Industry[];
};

/**
 * Everything an industry page renders, from one call.
 *
 * The July audit found industry pages repeating the catalogue with a different
 * row count from /businesses, and a "related industries" rail that linked to
 * pages whose products did not exist. Both are impossible here: the rows are
 * the SAME resolved rows the catalogue uses, and the related rail is the
 * taxonomy's own industry list minus this entry.
 */
export function industryPageData(slug: string): IndustryPage | null {
  const industry = INDUSTRIES.find((entry) => entry.slug === slug);
  if (!industry) return null;

  const categories = CATEGORIES.filter((category) => category.industrySlug === industry.slug);
  const categorySlugs = new Set(categories.map((category) => category.slug));
  const rows = catalogRows().filter((row) => categorySlugs.has(row.categorySlug));

  return {
    industry,
    categories,
    rows,
    regions: REGIONS.filter((region) => industry.regionFocus.includes(region.slug)),
    related: INDUSTRIES.filter((entry) => entry.slug !== industry.slug),
  };
}

/** Hub grid: every industry with its live product count. */
export function industryHub() {
  const rows = catalogRows();

  return INDUSTRIES.map((industry) => {
    const categories = CATEGORIES.filter((category) => category.industrySlug === industry.slug);
    const categorySlugs = new Set(categories.map((category) => category.slug));
    return {
      industry,
      productCount: rows.filter((row) => categorySlugs.has(row.categorySlug)).length,
      liveProductCount: rows.filter(
        (row) => categorySlugs.has(row.categorySlug) && row.status === 'live',
      ).length,
    };
  });
}

/* presence, by region -------------------------------------------------- */

export type RegionBlock = { region: Region; industries: Industry[] };

/**
 * Region blocks for /global-presence and the footer: the SAME function both
 * call, so the two lists cannot disagree (P14 acceptance). Industry slugs are
 * resolved here — a page never joins slugs to names itself.
 */
export function regionBlocks(): RegionBlock[] {
  return REGIONS.map((region) => ({
    region,
    industries: INDUSTRIES.filter((industry) => region.industryFocus.includes(industry.slug)),
  }));
}
