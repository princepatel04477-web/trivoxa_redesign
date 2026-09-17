import type { Metadata } from 'next';
import { InsightsClient } from '@/components/sections/insights-client';
import { ClosingCta } from '@/components/sections/closing-cta';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'Insights — Trade Intelligence, Market Reports & Regulatory Analysis',
    description:
      'Three defined research series from Trivoxa Group: quarterly category intelligence, regulatory and compliance updates, and factory-floor sourcing breakdowns from Surat.',
    path: '/insights',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/insights' },
};

/**
 * P11 — /insights.
 *
 * Rebuilt with React Bits Prompt 11:
 * - Compulsory DepthCarousel for featured research tracks
 * - AnimatedList for deliverables and series scope
 * - Category filters with GSAP Flip
 * - Interactive newsletter subscription block with ClickSpark
 */
export default function InsightsPage() {
  return (
    <main>
      <InsightsClient />
      <ClosingCta />
    </main>
  );
}
