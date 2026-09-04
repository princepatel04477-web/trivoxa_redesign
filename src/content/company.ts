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
      'Leadership at Trivoxa is driven by a commitment to long-term thinking, responsible decision-making, and continuous improvement.',
  },
  {
    name: 'Dhruv Patel',
    role: 'Co-Founder, Business Development',
    email: 'dhruv@trivoxagroup.com',
    message:
      'Our responsibility extends beyond business growth. We are building an organization founded on trust, guided by integrity, and dedicated to creating meaningful value for our customers, partners, and communities.',
  },
  {
    name: 'Tirth Kalathiya',
    role: 'Co-Founder, Technology & Innovation',
    email: 'tirth@trivoxagroup.com',
    message:
      'As Trivoxa grows, our leadership will continue to uphold the principles that define our organization while embracing innovation and new opportunities across global markets.',
  },
];

/* ------------------------------------------------------------------------ */
/* THE TRIVOXA WAY · JOURNEY · COMMITMENTS — from the client's Group doc     */
/* ------------------------------------------------------------------------ */

export const VALUES = [
  { name: 'Vision', note: 'We build for the decade, not the quarter.' },
  { name: 'Integrity', note: 'One answer, everywhere — including the uncomfortable ones.' },
  { name: 'Excellence', note: 'Specifications before superlatives.' },
  { name: 'Innovation', note: 'Better process, not more promises.' },
  { name: 'Partnership', note: 'Relationships measured in years, not shipments.' },
  { name: 'Impact', note: 'Value that compounds for partners and communities.' },
] as const;

export const JOURNEY = [
  {
    step: 1,
    title: 'Manufacturing Foundations',
    body: 'Shiveshwar Textiles builds deep expertise in woven textile production and quality-focused operations in Surat.',
  },
  {
    step: 2,
    title: 'An International Vision',
    body: 'The founders recognise global demand for a trusted partner into India\'s manufacturing capability.',
  },
  {
    step: 3,
    title: 'Trivoxa Group Established',
    body: 'The international business arm is founded to bridge global buyers and Indian production.',
  },
  {
    step: 4,
    title: 'Two Export Divisions',
    body: 'Product Exports and Service Exports launch as the group\'s operating arms.',
  },
  {
    step: 5,
    title: 'Growing Global Partnerships',
    body: 'The network expands across industries, regions, and long-term client relationships.',
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
