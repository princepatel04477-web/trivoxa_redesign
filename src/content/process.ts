/**
 * src/content/process.ts — how work actually happens, in data.
 * ---------------------------------------------------------------------------
 * Two processes, both published on the site because a buyer's real question is
 * "what happens after I send an enquiry?" — and the July audit's verdict on the
 * live site was that its process steps were named but never explained
 * ("Requirement Mapping" with no sentence about what gets mapped).
 *
 * Every step carries a concrete noun: a document, a number, a port, a
 * timeframe. Steps that cannot are not allowed to ship — `zod` enforces a
 * minimum sentence length, and the acceptance check greps for the abstraction
 * stacking the audit complained about.
 */
import { z } from 'zod';

export const ProcessStepSchema = z.object({
  step: z.number().int().min(1),
  title: z.string().min(4).max(40),
  /** What actually happens. Concrete nouns required by length and by review. */
  body: z.string().min(80).max(420),
  /** The artefact the buyer can hold: a sample reference, a quotation, a report. */
  output: z.string().min(6).max(90),
});

export type ProcessStep = z.infer<typeof ProcessStepSchema>;

/** Product exports — the seven steps published on /businesses. */
export const PRODUCT_EXPORT_PROCESS: ProcessStep[] = ProcessStepSchema.array().parse([
  {
    step: 1,
    title: 'Requirement Mapping',
    body: 'We take the specification in writing before anything is quoted: product grade, quantity, destination port, target Incoterm, packing requirement, and whatever certification the buyer\u2019s market demands. If a field is missing, our desk asks for it rather than guessing at it.',
    output: 'Written specification sheet',
  },
  {
    step: 2,
    title: 'Source & Validate',
    body: 'Capacity, audit history and reference shipments are checked against that specification — starting with the woven lines at our parent company Shiveshwar Textiles, then our validated partner mills and factories. A source that cannot evidence the grade is not used.',
    output: 'Approved source with reference shipments',
  },
  {
    step: 3,
    title: 'Samples & Approval',
    body: 'Samples are produced and shipped by international courier, typically within 20 days of specification lock for textile lines. The buyer\u2019s approval is recorded against the sample reference, and that reference — not a photograph — governs production.',
    output: 'Courier-shipped sample + approval record',
  },
  {
    step: 4,
    title: 'Commercial Terms',
    body: 'One written quotation covering unit price, MOQ, lead time, Incoterm (EXW, FOB, CIF or DDP), payment terms and the loading port — Mundra, Kandla or Nhava Sheva. Nothing is left to a later conversation, and validity is dated.',
    output: 'Dated quotation with HS code and Incoterm',
  },
  {
    step: 5,
    title: 'Production & QC',
    body: 'Production is scheduled against the approved sample, with in-line checks and a pre-shipment inspection covering quantity, packing, marking and the specification points that matter to that product. The inspection report travels with the consignment.',
    output: 'Pre-shipment inspection report',
  },
  {
    step: 6,
    title: 'Logistics & Documentation',
    body: 'Booking, export packing list, commercial invoice, certificate of origin and any market-specific declaration are prepared and cross-checked against the destination\u2019s import rules before the vessel sails — the stage where most first-time shipments lose days.',
    output: 'Full document set, checked pre-sailing',
  },
  {
    step: 7,
    title: 'Delivery & Support',
    body: 'After delivery we handle claims, short-shipments and replacements against the same specification record, and start the next programme from it. The export desk answers within 24 business hours (IST), Monday to Saturday.',
    output: 'Claim handling + next-programme specification',
  },
]);

/** Service exports — the five steps published on /businesses/service-exports. */
export const SERVICE_ENGAGEMENT_PROCESS: ProcessStep[] = ProcessStepSchema.array().parse([
  {
    step: 1,
    title: 'Requirement Scoping',
    body: 'A written scope: the outcome, the systems it touches, who signs it off, and what "done" looks like in measurable terms. Scoping is done by the people who will deliver the work, not by a sales layer.',
    output: 'Scope document with acceptance criteria',
  },
  {
    step: 2,
    title: 'Proposal & Timeline',
    body: 'Fixed-scope pricing with a dated timeline, named deliverables per milestone and the assumptions the price rests on. If a requirement is outside what we can evidence, we say so in the proposal rather than after the invoice.',
    output: 'Priced proposal with milestone timeline',
  },
  {
    step: 3,
    title: 'Execution & Review Cycles',
    body: 'Work proceeds in review cycles with a staging environment or draft asset available at each one, so feedback lands on something the client can open. Cycle length is agreed up front — weekly for builds, per-deliverable for design.',
    output: 'Reviewable build or draft each cycle',
  },
  {
    step: 4,
    title: 'Delivery & Handover',
    body: 'Production deployment, source files, credentials transferred to the client\u2019s own accounts, and documentation covering how to change what we built. Handover is not complete until the client\u2019s team can operate it without us.',
    output: 'Deployed asset + credentials + documentation',
  },
  {
    step: 5,
    title: 'Ongoing Support',
    body: 'A defined support window after handover covering defects and questions, with retainer options for continuing work. Support terms are written into the proposal at step two, so nobody renegotiates under pressure.',
    output: 'Written support window + retainer option',
  },
]);

/**
 * The six service lines of Trivoxa Digital. Descriptions stay concrete: what
 * is delivered, not how passionate anyone is about it.
 */
export const ServiceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(4),
  summary: z.string().min(60).max(240),
  deliverables: z.array(z.string().min(4)).min(3).max(6),
});

export type Service = z.infer<typeof ServiceSchema>;

export const SERVICES: Service[] = ServiceSchema.array().parse([
  {
    slug: 'technology-ai',
    name: 'Technology & AI Solutions',
    summary:
      'Applied engineering for businesses that want AI in a process rather than in a press release: document parsing, quoting assistance, and data pipelines built on the group\u2019s own export workflow.',
    deliverables: ['AI-assisted quotation drafting', 'Document & HS-code parsing', 'Internal data pipelines', 'Model evaluation harness'],
  },
  {
    slug: 'branding-design',
    name: 'Branding & Design',
    summary:
      'Identity systems and the collateral that has to survive a buyer\u2019s scrutiny: catalogues, specification sheets, packaging artwork and the corporate documents that accompany a shipment.',
    deliverables: ['Identity & typography system', 'Export catalogue layout', 'Specification sheet templates', 'Packaging artwork'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    summary:
      'Demand generation for B2B and export businesses, measured on enquiries that name a product and a quantity rather than on impressions or follower counts.',
    deliverables: ['Search & paid programmes', 'Lifecycle email', 'Market-specific landing pages', 'Enquiry-quality reporting'],
  },
  {
    slug: 'web-app',
    name: 'Web & App Development',
    summary:
      'Production web and mobile builds with performance budgets, accessibility targets and an owner who can be called when something breaks — including this site\u2019s own engineering discipline.',
    deliverables: ['Marketing & commerce sites', 'Buyer portals', 'Mobile apps', 'Performance & accessibility audits'],
  },
  {
    slug: 'saas',
    name: 'SaaS Platforms',
    summary:
      'Product engineering for subscription software: architecture, multi-tenant data, billing, and the operational tooling that keeps a platform supportable after launch.',
    deliverables: ['Platform architecture', 'Multi-tenant data models', 'Billing & entitlements', 'Admin & support tooling'],
  },
  {
    slug: 'consulting',
    name: 'Consulting & Advisory',
    summary:
      'Advisory for companies entering international trade: market entry sequence, documentation readiness, supplier vetting, and the operational gaps that show up in a first audit.',
    deliverables: ['Market entry assessment', 'Documentation readiness review', 'Supplier vetting framework', 'Operations gap analysis'],
  },
]);

/** The dedicated property the service division signposts, never a dead end. */
export const DIGITAL_PROPERTY = {
  href: 'https://digital.trivoxagroup.com',
  label: 'digital.trivoxagroup.com',
} as const;

/**
 * Service-engagement FAQ. Answers are grounded in the process above — nothing
 * here promises a credential, a jurisdiction or a price we cannot evidence.
 */
export const FaqSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(10),
  answer: z.string().min(60),
});

export type Faq = z.infer<typeof FaqSchema>;

export const SERVICE_FAQ: Faq[] = FaqSchema.array().parse([
  {
    id: 'who-delivers',
    question: 'Who actually delivers the work?',
    answer:
      'The team that scopes it. Trivoxa Digital is the group\u2019s own technology property, not a marketplace: the people who write the scope document in step one are the people who deliver against it, and their names appear in the proposal.',
  },
  {
    id: 'pricing',
    question: 'How is pricing structured?',
    answer:
      'Fixed-scope pricing against a dated milestone timeline, with the assumptions written into the proposal. If a requirement turns out to sit outside what we can evidence, we raise it before work starts rather than billing for it afterwards.',
  },
  {
    id: 'ownership',
    question: 'Who owns the deliverables and the credentials?',
    answer:
      'You do. At handover, source files are transferred, hosting and platform credentials are moved into the client\u2019s own accounts, and documentation covers how to change what we built. Handover is not complete until your team can operate it without us.',
  },
]);
