/**
 * src/content/capabilities.ts — what the group can do, across every industry.
 * ---------------------------------------------------------------------------
 * The live /industries page listed eight capabilities as noun phrases
 * ("Sourcing", "Quality Assurance") with no sentence about what any of them
 * meant in practice — the abstraction stacking the brief tells us to kill.
 *
 * Each capability here carries a body sentence with a concrete artefact or
 * number in it, and an `evidence` line pointing at where the site proves it.
 * Capabilities are cross-industry: they belong to the group, not to a product.
 */
import { z } from 'zod';

export const CapabilitySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(40),
  body: z.string().min(60).max(280),
  /** Where on the site this is evidenced — a capability with no proof is a claim. */
  evidence: z.string().min(6),
  evidenceHref: z.string().startsWith('/'),
});

export type Capability = z.infer<typeof CapabilitySchema>;

export const CAPABILITIES: Capability[] = CapabilitySchema.array().parse([
  {
    slug: 'specification-drafting',
    name: 'Specification drafting',
    body: 'We turn a buyer\u2019s intent into a written specification — grade, composition, dimensions, packing, marking and the destination market\u2019s labelling rule — before anything is priced. Vague enquiries get questions back, not brochures.',
    evidence: 'Step 1 of the export process',
    evidenceHref: '/businesses#how-it-works',
  },
  {
    slug: 'sourcing-validation',
    name: 'Sourcing & vendor validation',
    body: 'Capacity, audit history and reference shipments are checked against the specification, starting with our parent company\u2019s own woven lines in Surat and then the validated partner factories we have shipped from before.',
    evidence: 'The ecosystem and the mill',
    evidenceHref: '/group',
  },
  {
    slug: 'sampling',
    name: 'Sampling & approval records',
    body: 'Samples are produced against the specification and shipped by international courier, typically within 20 days for textile lines. Approval is recorded against a sample reference that then governs production.',
    evidence: 'Sampling on the catalogue page',
    evidenceHref: '/businesses/product-exports',
  },
  {
    slug: 'quality-inspection',
    name: 'Quality inspection',
    body: 'In-line checks plus a pre-shipment inspection covering quantity, packing, marking and the specification points that matter to that product. The inspection report travels with the consignment.',
    evidence: 'Step 5 of the export process',
    evidenceHref: '/businesses#how-it-works',
  },
  {
    slug: 'export-documentation',
    name: 'Export documentation',
    body: 'Packing list, commercial invoice, certificate of origin and any market-specific declaration, cross-checked against the destination\u2019s import rules before the vessel sails — the stage where first shipments lose days.',
    evidence: 'Step 6 of the export process',
    evidenceHref: '/businesses#how-it-works',
  },
  {
    slug: 'logistics-incoterms',
    name: 'Logistics & Incoterms',
    body: 'Booking and routing ex Mundra, Kandla or Nhava Sheva, quoted EXW, FOB, CIF or DDP. Every quotation names the loading port and the Incoterm, so landed cost is comparable across suppliers.',
    evidence: 'Ports and UN/LOCODEs',
    evidenceHref: '/global-presence',
  },
  {
    slug: 'compliance-mapping',
    name: 'Compliance mapping',
    body: 'We map what a destination market requires against what we hold today, and we publish the credentials still in progress with their target quarter rather than implying coverage we do not have.',
    evidence: 'The compliance register',
    evidenceHref: '/compliance',
  },
  {
    slug: 'category-onboarding',
    name: 'Category onboarding',
    body: 'New lines are quoted against a written specification before they are catalogued. A category appears in the catalogue only when MOQ, lead time, HS code and port can be published for it.',
    evidence: 'Onboarding industries, labelled',
    evidenceHref: '/industries',
  },
]);
