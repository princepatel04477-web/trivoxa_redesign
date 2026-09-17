import type { Metadata } from 'next';
import { ClosingCta } from '@/components/sections/closing-cta';
import { IndustriesHubClient } from '@/components/sections/industries-hub-client';
import { industryHub, liveIndustries, onboardingIndustries, proofBand, totalIndustries } from '@/lib/selectors';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: `Industries We Serve — ${totalIndustries()} Export Industries from Surat`,
    description: `${totalIndustries()} industries, each with its catalogue rows, HS codes, MOQs, lead times and compliance notes. ${liveIndustries().length} are live today; ${onboardingIndustries().length} are onboarding and labelled as such rather than marketed as active.`,
    path: '/industries',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/industries' },
};

/**
 * P10 — /industries, the hub.
 *
 * Rebuilt with React Bits Prompt 10:
 * - Hero: SplitText title + Grainient background
 * - All 9 industries as ChromaGrid
 * - Filter pills (All / Catalogued / Quoted) with GSAP Flip re-layout
 * - 8 evidenced capabilities and ClosingCTA
 */
export default function IndustriesPage() {
  const rawHub = industryHub();
  const band = proofBand();
  const liveCount = liveIndustries().length;

  const hubItems = rawHub.map(({ industry, productCount, liveProductCount }) => ({
    slug: industry.slug,
    name: industry.name,
    shortDescription: industry.shortDescription,
    status: industry.status,
    icon: industry.icon,
    productCount,
    liveProductCount,
  }));

  return (
    <main>
      <IndustriesHubClient
        hub={hubItems}
        liveCount={liveCount}
        productCount={band.liveProductCount}
        portsLocode={band.ports.map((port) => port.locode).join(' · ')}
      />
      <ClosingCta />
    </main>
  );
}
