/**
 * src/content/company.ts — corporate facts, ONE canonical sentence each.
 * ---------------------------------------------------------------------------
 * The July 2026 audit's single most damaging finding: the Group page called
 * Shiveshwar Textiles the "parent company" while the Company Profile PDF
 * called it "one of Trivoxa Group's strategic partner companies" — and the
 * live Contact page later introduced a third phrasing ("founding strategic
 * manufacturing partner"). A Fortune-500 procurement persona in the audit said
 * that contradiction would go straight to their supplier-risk team.
 *
 * The fix is structural, not editorial: the relationship is a SINGLE typed
 * constant with a SINGLE canonical sentence, and every page that mentions it
 * renders that constant verbatim. There is no second copy of the sentence
 * anywhere in the codebase — `scripts/check-taxonomy.ts` greps for it.
 *
 * Resolution: the founders confirmed in the 2026-09-04 Arena session that
 * Shiveshwar Textiles is legally the PARENT COMPANY. Recorded in
 * docs/DECISIONS.md (ADR row, status CLOSED) and enforced here.
 */

import type { ShiveshwarRelationship } from './schemas-company';

export type { ShiveshwarRelationship };

/** The confirmed legal relationship. Change only via a DECISIONS.md ADR row. */
export const SHIVESHWAR_RELATIONSHIP: ShiveshwarRelationship = 'parent-company';

/**
 * THE canonical sentence. Used verbatim on the homepage, the Group page, the
 * Businesses page, the footer and the JSON-LD Organization node.
 * If you find this string typed anywhere else, that is a bug — report it.
 */
export const SHIVESHWAR_CANONICAL_SENTENCE =
  'Built on the manufacturing foundation of our parent company, Shiveshwar Textiles — decades of woven textile production expertise in Surat that inform every sourcing decision and quality standard we uphold.';

/** Footer-length variant of the same fact. Same meaning, no new claim. */
export const SHIVESHWAR_FOOTER_LINE =
  'A venture built on the manufacturing heritage of Shiveshwar Textiles.';

export const COMPANY = {
  legalName: 'Trivoxa Group',
  /** Surfacing city-level only until the founders release the full address. */
  headquarters: 'Surat, Gujarat, India',
  founded: {
    /** Trivoxa Group's incorporation year, per the Company Profile. */
    year: 2025,
    note: 'The group\'s operating arm; the manufacturing foundation predates it by decades.',
  },
  divisions: ['product-exports', 'service-exports'] as const,
  tagline: 'International Trade & Business Group',
} as const;

/* ------------------------------------------------------------------------ */
/* LEADERSHIP — real names, group-domain emails, no personal inboxes         */
/* ------------------------------------------------------------------------ */

export type Leader = {
  name: string;
  role: string;
  /** Group-domain alias from the canonical CONTACT set pattern. */
  email: string;
  message: string;
};

export const LEADERSHIP: Leader[] = [
  {
    name: 'Parth Mangukiya',
    role: 'Founder & Managing Director',
    email: 'parth@trivoxagroup.com',
    message:
      'Directs group governance, mill allocations at Shiveshwar Textiles, and strategic manufacturing partner vetting. Decisions on his desk: master supply agreements, production floor allocations, and institutional contracts. Write to him for volume procurement contracts and group-level partnerships.',
  },
  {
    name: 'Dhruv Patel',
    role: 'Co-Founder, Business Development',
    email: 'dhruv@trivoxagroup.com',
    message:
      'Leads international commercial operations and export desk execution across our nine industries. Decisions on his desk: Incoterms structuring, freight and port lane allocation (Mundra, Kandla, Nhava Sheva), and payment terms. Write to him for quotations, sample approval sign-offs, and shipping schedules.',
  },
  {
    name: 'Tirth Kalathiya',
    role: 'Co-Founder, Technology & Innovation',
    email: 'tirth@trivoxagroup.com',
    message:
      'Leads Global Service Exports (digital.trivoxagroup.com), internal compliance registries, and supply-chain track-and-trace systems. Decisions on his desk: digital transformation architectures, client software and AI delivery scopes, and data integrity. Write to him for service export proposals and technology engineering engagements.',
  },
];

/* ------------------------------------------------------------------------ */
/* THE TRIVOXA WAY · JOURNEY · COMMITMENTS — from the client's Group doc     */
/* ------------------------------------------------------------------------ */

export const VALUES = [
  {
    name: 'Specifications before superlatives',
    note: 'Published HS codes, grades, MOQs, and lead times rather than marketing claims.',
  },
  {
    name: 'Relationships measured in years, not shipments',
    note: 'Long-term contracts built on documented quality tolerances and predictable supply allocations.',
  },
  {
    name: 'We build for the decade, not the quarter',
    note: 'Sustainable operational capability prioritized over opportunistic spot-market trading.',
  },
  {
    name: 'One answer everywhere — including the uncomfortable ones',
    note: 'Disclosed lead times, honest capacity constraints, and published target quarters for in-progress certifications.',
  },
  {
    name: 'Better process, not more promises',
    note: 'Seven-step order management, pre-shipment inspections, and tracked international sample sign-offs.',
  },
  {
    name: 'Value that compounds for partners and communities',
    note: 'Fair manufacturing economics in Surat coupled with reliable landed costs for international procurement desks.',
  },
] as const;

export const JOURNEY = [
  {
    step: 1,
    year: '1998–2023',
    title: 'Manufacturing Foundations',
    body: 'Decades of woven textile production expertise established at Shiveshwar Textiles in Surat, mastering yarn selection, loom operations, and physical fabric inspection.',
  },
  {
    step: 2,
    year: '2024',
    title: 'An International Vision',
    body: 'Founders identify systemic international buyer friction around Indian export consistency, transparent specifications, and verified testing documentation.',
  },
  {
    step: 3,
    year: '2025',
    title: 'Trivoxa Group Established',
    body: 'Trivoxa Group incorporates in Surat as an international trade house to connect overseas procurement desks directly to audited Indian manufacturing lines.',
  },
  {
    step: 4,
    year: '2025–2026',
    title: 'Two Operating Divisions',
    body: 'Launch of Global Product Exports (physical commodities) and Global Service Exports (digital engineering & AI) on a unified specifications-first discipline.',
  },
  {
    step: 5,
    year: '2026+',
    title: 'Global Trade Network',
    body: 'Cross-border supply network operational across nine industries, six destination regions, and published compliance target quarters.',
  },
] as const;

export const COMMITMENTS = [
  { title: 'Ethical Business Practices', body: 'Conducting every relationship with honesty, fairness, and accountability.' },
  { title: 'Transparent Communication', body: 'Specifications, status and certification dates published as they stand.' },
  { title: 'Quality Coordination', body: 'Structured checks from production specification through final delivery.' },
  { title: 'Reliable Delivery', body: 'Logistics coordination against agreed Incoterms and lead times.' },
  { title: 'Long-Term Value', body: 'Partnerships designed to compound over years, not transactions.' },
] as const;

/** Factory photography, captioned — proof, not decoration. */
export const FOUNDATION_PHOTOS = [
  { slug: 'exterior', alt: 'Shiveshwar Textiles factory exterior, Surat', caption: 'Shiveshwar Textiles — Factory Exterior' },
  { slug: 'weaving', alt: 'Weaving floor at the Shiveshwar Textiles mill', caption: 'Shiveshwar Textiles — Weaving Floor' },
  { slug: 'inspection', alt: 'Quality inspection of woven fabric before packing', caption: 'Shiveshwar Textiles — Quality Inspection' },
] as const;
