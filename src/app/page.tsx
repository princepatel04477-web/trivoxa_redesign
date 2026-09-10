import { BusinessesPreview } from '@/components/sections/businesses-preview';
import { ClosingCta } from '@/components/sections/closing-cta';
import { GlobalPresencePreview } from '@/components/sections/global-presence-preview';
import { Hero } from '@/components/sections/hero';
import { IndustriesPreview } from '@/components/sections/industries-preview';
import { CareersLine, CareersPreview, InsightsPreview } from '@/components/sections/insights-careers';
import { ProofBand } from '@/components/sections/proof-band';
import { WhoWeAre } from '@/components/sections/who-we-are';
import { WhyTrivoxa } from '@/components/sections/why-trivoxa';

import type { Metadata } from 'next';

/**
 * The title and description come from the root layout's defaults; what the
 * homepage must state for itself is its canonical. Without it, `/`, `/?category=…`
 * and any future query-parametered variant are all separate documents to a
 * crawler — and the homepage is the one URL that cannot afford that (P22 audit).
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

/**
 * The homepage (P6–P10).
 *
 * Order is a buyer's reading order, not a marketing one:
 *
 *  1. Hero — who we are, in one line, over the tiered eagle. LCP is the
 *     server-rendered headline, never the canvas.
 *  2. Proof band — ports, live counts, response window, honest compliance
 *     posture. Proof before narrative, because that is how a cold B2B visitor
 *     actually scans.
 *  3. Why Trivoxa — four pillars, rewritten from abstractions into concrete
 *     nouns a procurement reader can act on.
 *  4. Who we are — the manufacturing lineage stated as the spine, not a
 *     footnote, with the canonical Shiveshwar sentence.
 *  5. Businesses — the two divisions, in a grid that accepts a third.
 *  6. Industries — a slice of six, WITH the true total and a visible
 *     "View all 9 industries →" in the section header. Never silent.
 *  7. Global presence — the tiered globe and the region list that is the real
 *     content for anyone without a pointer.
 *  8. Insights / Careers — conditional. Empty dataset, no section.
 *  9. Closing CTA — the single commercial conversion: the RFQ.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <ProofBand />
      <WhyTrivoxa />
      <WhoWeAre />
      <BusinessesPreview />
      <IndustriesPreview />
      <GlobalPresencePreview />
      <InsightsPreview />
      <CareersPreview />
      <CareersLine />
      <ClosingCta />
    </>
  );
}
