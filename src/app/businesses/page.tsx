import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ComplianceSummary } from '@/components/sections/compliance-summary';
import { Divisions } from '@/components/sections/businesses/divisions';
import { HowItWorks } from '@/components/sections/businesses/how-it-works';
import { INDUSTRIES } from '@/content/taxonomy';
import { PRODUCT_EXPORT_PROCESS } from '@/content/process';
import { proofBand } from '@/lib/selectors';

export const metadata: Metadata = {
  title: 'Trivoxa Businesses — Product Exports & Service Exports',
  description:
    'Two export divisions on one operating discipline: product exports across nine industries from Surat, and professional services through the group\u2019s technology property. Seven documented steps from requirement mapping to delivery support.',
  alternates: { canonical: '/businesses' },
};

/**
 * P12 — /businesses, the hub.
 *
 * The live version of this page listed two divisions and seven step names.
 * This one lists the same seven steps with what happens in each and what the
 * buyer receives at the end of it, then the compliance posture beside it —
 * because the audit's procurement persona wanted evidence of an operating
 * system, not a diagram of one.
 */
export default function BusinessesPage() {
  const band = proofBand();

  return (
    <>
      <PageHero
        eyebrow="Our Businesses"
        title="Two export businesses. One operating discipline."
        lede="Trivoxa Group runs product exports and service exports as separate arms with the same rules: a written specification before a price, an approved sample before production, and a document set checked before the vessel sails."
        trail={[
          { href: '/', label: 'Home' },
          { href: '/businesses', label: 'Businesses' },
        ]}
        meta={[
          { label: 'Divisions', value: 2 },
          { label: 'Industries', value: INDUSTRIES.length },
          { label: 'Live products', value: band.liveProductCount },
          { label: 'Loading ports', value: band.ports.map((port) => port.locode).join(' · ') },
          { label: 'Desk response', value: band.responseWindow },
        ]}
      />

      <Divisions />

      <HowItWorks
        steps={PRODUCT_EXPORT_PROCESS}
        title="Seven steps from enquiry to delivery."
        lede="The same sequence runs whether the order is one container of home textiles or a recurring engineering programme. Step one is always a written specification."
      />

      <ComplianceSummary surface="dark" />

      <ClosingCta />
    </>
  );
}
