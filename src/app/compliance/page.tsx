import type { Metadata } from 'next';
import { ComplianceClient } from '@/components/sections/compliance-client';
import { ClosingCta } from '@/components/sections/closing-cta';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'Compliance & Certifications — Active Credentials & Regulatory Targets',
    description:
      'The credentials Trivoxa Group holds today (IEC, GST), the ones in progress with their published target quarters (FIEO, APEDA, Spice Board, FSSAI, ISO 9001, CE, WHO-GMP), and what that means for international trade inquiries.',
    path: '/compliance',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/compliance' },
};

/**
 * P11 — /compliance.
 *
 * Rebuilt with React Bits Prompt 11:
 * - Document groups as interactive Folder components (click opens to reveal doc links)
 * - Certification status list with AnimatedList and pulsing in-progress dots
 * - Sticky table of contents with LineSidebar
 */
export default function CompliancePage() {
  return (
    <main>
      <ComplianceClient />
      <ClosingCta />
    </main>
  );
}
