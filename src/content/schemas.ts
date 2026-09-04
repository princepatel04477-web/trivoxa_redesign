import { z } from 'zod';

/**
 * src/content/schemas.ts — the contract every piece of site data must satisfy.
 * ---------------------------------------------------------------------------
 * The July 2026 audit found the site shipping em-dashes where HS codes should
 * be, industries that existed on one page and not another, and three different
 * email addresses. The root cause was data with no contract. These schemas are
 * that contract, enforced at BUILD time by scripts/check-taxonomy.ts — not at
 * runtime, not in a code review, not in someone's memory.
 *
 * The central rule they encode: an item that cannot be sold must not render as
 * if it can. `status: 'onboarding'` is a first-class, designed state; a `live`
 * item with a missing spec field is a build error.
 */

/** Two-digit-or-four-digit-or-six-digit HS code as published (we publish 6). */
const HS_CODE = z
  .string()
  .regex(/^\d{4}(\.\d{2})?$/, 'HS code must be 4 or 6 digits, e.g. "5209" or "5209.42"');

/** A quarter target, e.g. "2026-Q4". Honest dates are the point. */
const TARGET_QUARTER = z.string().regex(/^\d{4}-Q[1-4]$/, 'Use YYYY-QN, e.g. "2026-Q4"');

const EMAIL = z.string().email().refine(
  (value) => value.endsWith('@trivoxagroup.com'),
  'Every public address must be a @trivoxagroup.com alias — no personal inboxes.',
);

export const IndustryStatus = z.enum(['live', 'onboarding']);

export const IndustrySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  /** One specific sentence. The audit's rule: earn the place with a fact. */
  shortDescription: z.string().min(20).max(180),
  /** lucide-react icon name; resolved in src/components/ui/industry-icon.tsx. */
  icon: z.string().min(2),
  status: IndustryStatus,
  /** Category slugs this industry owns. Checked against CATEGORIES.
   *  Empty is legal for service-side industries (Technology) and for
   *  onboarding industries whose category has not been stood up yet —
   *  the "live industry owns live products" rule lives in check-taxonomy. */
  relatedCategories: z.array(z.string()).default([]),
  typicalBuyers: z.array(z.string()).min(2),
  /** The practical regulatory note a procurement professional actually wants. */
  complianceNotes: z.array(z.string()).min(1),
  /** Where this industry is strongest, by region slug. */
  regionFocus: z.array(z.string()).default([]),
});

export const CategorySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  /** Must exist in INDUSTRIES. Dangling references fail the build. */
  industrySlug: z.string(),
  status: IndustryStatus,
  overview: z.string().min(40),
  applications: z.array(z.string()).min(2),
  /** Present on every category page — the audit's sample-request fix. */
  supportsSampleRequest: z.boolean(),
  supportsFactoryAudit: z.boolean(),
});

export const ProductSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  categorySlug: z.string(),
  status: IndustryStatus,
  /**
   * Required when `status` is 'live'. A live product with any of these empty
   * is exactly the Fabrics-table failure the audit found, so the schema makes
   * it unrepresentable rather than merely discouraged.
   */
  hsCode: HS_CODE.optional(),
  grade: z.string().optional(),
  moq: z.string().optional(),
  leadTime: z.string().optional(),
  incoterms: z.array(z.enum(['FOB', 'CIF', 'EXW', 'DDP'])).min(1).optional(),
  portSlug: z.string().optional(),
  /** Honest caveat, e.g. a certification that is still in progress. */
  certificationNote: z.string().optional(),
  applications: z.array(z.string()).default([]),
}).superRefine((product, ctx) => {
  if (product.status !== 'live') return;

  const required: ['hsCode' | 'grade' | 'moq' | 'leadTime' | 'incoterms' | 'portSlug', string][] = [
    ['hsCode', 'HS code'],
    ['grade', 'grade'],
    ['moq', 'MOQ'],
    ['leadTime', 'lead time'],
    ['incoterms', 'Incoterms'],
    ['portSlug', 'export port'],
  ];

  for (const [field, label] of required) {
    const value = product[field];
    const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
    if (empty) {
      ctx.addIssue({
        code: 'custom',
        path: [field],
        message: `Product "${product.name}" is status 'live' but has no ${label}. Fill the data or set status 'onboarding' — an incomplete row must never render as a row.`,
      });
    }
  }
});

export const RegionSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  /** ONE canonical name. Footer, Global Presence and the globe all render this. */
  name: z.string().min(2),
  industryFocus: z.array(z.string()).min(1),
  /** At least one specific, verifiable detail — the UAE persona's complaint
   *  was regions "generic to the point I can't tell if you've actually
   *  shipped here yet". The schema enforces the sentence exists; the founders
   *  must confirm each one is true. */
  verifiableDetail: z.string().min(30),
  marketFocus: z.string().min(20),
});

export const PortSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  /** UN/LOCODE — the spec-data signal. Mundra = INMUN, Kandla = INIXY, JNPT = INNSA. */
  locode: z.string().regex(/^[A-Z]{5}$/),
  reason: z.string().min(20),
});

export const CertificationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(2),
  fullName: z.string().min(2),
  status: z.enum(['active', 'in-progress']),
  /** Required when in-progress. "Targeted" without a date is not allowed. */
  targetQuarter: TARGET_QUARTER.optional(),
  /** Free-text when a quarter would be a lie (e.g. "Targeted for pharma lines"). */
  targetNote: z.string().optional(),
  issuingAuthority: z.string().min(2),
  /** Published the moment the credential lands — the compliance page promises this. */
  registrationNumber: z.string().optional(),
});

export const ContactSchema = z.object({
  general: EMAIL,
  sales: EMAIL,
  careers: EMAIL,
  partnerships: EMAIL,
  /**
   * Real numbers, or an EMPTY array. An empty array renders the designed
   * "request a callback" substitute on /contact and raises a build WARNING —
   * it can never silently ship a fake number, and it can never silently ship
   * nothing either.
   */
  phoneNumbers: z.array(z.string().min(7)).max(3),
  hoursIst: z.string().min(5),
  timezoneLabel: z.string().min(3),
  registeredOffice: z.string().min(10),
  /** null until the founders provide it; renders the honest substitute. */
  registeredEntityNumber: z.string().nullable(),
  responseWindow: z.string().min(5),
  socials: z.array(z.object({ label: z.string(), href: z.string().url() })),
});

export const DivisionSchema = z.object({
  slug: z.enum(['product-exports', 'service-exports']),
  name: z.string(),
  /** Two lines, per the client's doc. */
  description: z.string().min(40).max(220),
  categorySlugs: z.array(z.string()).default([]),
  /** External property, e.g. digital.trivoxagroup.com. */
  externalHref: z.string().url().optional(),
  externalLabel: z.string().optional(),
});

export type Industry = z.infer<typeof IndustrySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type Region = z.infer<typeof RegionSchema>;
export type Port = z.infer<typeof PortSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Division = z.infer<typeof DivisionSchema>;
