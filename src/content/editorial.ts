/**
 * src/content/editorial.ts — Insights and Careers, as data.
 * ---------------------------------------------------------------------------
 * Both are EMPTY today, and that is the point: the July 2026 site showed three
 * Insights cards that all said "Coming soon" and a Careers page with no roles
 * but a pitch about joining. Rendering an empty shell as if it were content is
 * the specific failure P10 fixes.
 *
 * The rule lives in the data, not in a component's imagination:
 *   · `INSIGHTS` empty  → the homepage renders NO Insights section;
 *   · `OPEN_ROLES` empty → the homepage renders NO Careers section.
 * Add one real article or one real role and the section appears by itself,
 * with the same card treatment as every other preview. No component edit.
 *
 * When the founders publish, entries must carry a date and a real summary —
 * `zod` rejects a placeholder.
 */
import { z } from 'zod';

export const InsightSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(12),
  /** A summary that says something. "Coming soon" will not validate in spirit. */
  summary: z.string().min(60),
  /** Market Intelligence · Compliance & Documentation · Sourcing & Supply Chains */
  series: z.string().min(4),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readMinutes: z.number().int().min(1).max(60),
  href: z.string().startsWith('/'),
});

export const RoleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(4),
  team: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  summary: z.string().min(40),
  href: z.string().startsWith('/'),
});

export type Insight = z.infer<typeof InsightSchema>;
export type Role = z.infer<typeof RoleSchema>;

export const INSIGHTS: Insight[] = InsightSchema.array().parse([]);
export const OPEN_ROLES: Role[] = RoleSchema.array().parse([]);

/** Where speculative applications go while there are no open roles. */
export const CAREERS_EMAIL = 'careers@trivoxagroup.com';

export function hasInsights(): boolean {
  return INSIGHTS.length > 0;
}

export function hasOpenRoles(): boolean {
  return OPEN_ROLES.length > 0;
}

/**
 * Careers content. Written as what a small, founder-led team in Surat can
 * actually promise — no glass-office claims, no benefits list we do not have.
 */
export const WhatWeLookForSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(4),
  body: z.string().min(50).max(240),
});

export type WhatWeLookFor = z.infer<typeof WhatWeLookForSchema>;

export const WHAT_WE_LOOK_FOR: WhatWeLookFor[] = WhatWeLookForSchema.array().parse([
  {
    slug: 'specification-mindset',
    title: 'You work from specifications',
    body: 'Whether the artefact is a quotation, a shipment document or a piece of software, you write down what "correct" means before you start, and you can show your working afterwards.',
  },
  {
    slug: 'owns-the-thread',
    title: 'You own the thread',
    body: 'Small team, real consequences: a buyer\u2019s question, a mill\u2019s deadline or a deployment window is yours until it is closed. We would rather hand you the thread than a task ticket.',
  },
  {
    slug: 'comfortable-with-numbers',
    title: 'Numbers do not scare you',
    body: 'HS codes, MOQs, lead times, Incoterms, margins, latency budgets — the work is full of figures that have to be right, and being approximately right is not a category we accept.',
  },
  {
    slug: 'writes-clearly',
    title: 'You write clearly',
    body: 'Most of what we produce is read by someone in another country making a decision with money attached. Plain sentences, concrete nouns, no abstraction stacking.',
  },
]);

export const HiringStepSchema = z.object({
  step: z.number().int().min(1),
  title: z.string().min(4),
  body: z.string().min(50).max(260),
});

export type HiringStep = z.infer<typeof HiringStepSchema>;

export const HIRING_PROCESS: HiringStep[] = HiringStepSchema.array().parse([
  {
    step: 1,
    title: 'Application read by a founder',
    body: 'Every application to careers@trivoxagroup.com is read by one of the three founders, not filtered by a keyword scan. We reply either way, including when the answer is no.',
  },
  {
    step: 2,
    title: 'A conversation about real work',
    body: 'One call, with the founder closest to the role. We will describe the actual problem you would start on — a category to onboard, a documentation gap, a platform to ship — and you can push back on it.',
  },
  {
    step: 3,
    title: 'A short, paid piece of work',
    body: 'Where a role needs evidence, we ask for a small piece of real work on our own problem, paid for your time, with the acceptance criteria stated up front.',
  },
  {
    step: 4,
    title: 'Offer, in writing, with the numbers',
    body: 'Compensation, role, reporting line and start date in one document. No verbal offers, no ranges that move after you have accepted.',
  },
]);

/**
 * The three series we intend to publish. Describing them is honest; rendering
 * three cards that all said "Coming soon" — as the live site does — is not.
 */
export const InsightSeriesSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(4),
  /** What will actually appear, concretely enough to be held to. */
  willPublish: z.array(z.string().min(20)).min(2).max(5),
  cadence: z.string().min(8),
});

export type InsightSeries = z.infer<typeof InsightSeriesSchema>;

export const INSIGHT_SERIES: InsightSeries[] = InsightSeriesSchema.array().parse([
  {
    slug: 'market-intelligence',
    name: 'Market Intelligence',
    willPublish: [
      'Quarterly price movement on the lines we ship, with the HS headings named',
      'What changed in a destination market\u2019s demand, and what we did about it',
      'Freight rate direction on the Mundra, Kandla and Nhava Sheva lanes',
    ],
    cadence: 'Quarterly, per category',
  },
  {
    slug: 'compliance-documentation',
    name: 'Compliance & Documentation',
    willPublish: [
      'A credential we obtained, with the registration number and the date',
      'Destination-market labelling and documentation changes that affect a shipment',
      'Worked examples of a document set for a real consignment, identifiers redacted',
    ],
    cadence: 'When something changes',
  },
  {
    slug: 'sourcing-supply-chains',
    name: 'Sourcing & Supply Chains',
    willPublish: [
      'How a category is onboarded, including the parts that took longer than expected',
      'What a pre-shipment inspection actually checks, and what it catches',
      'Supplier validation: the questions we ask a mill before the first order',
    ],
    cadence: 'Monthly while onboarding',
  },
]);
