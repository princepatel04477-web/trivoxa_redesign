import type { Metadata } from 'next';
import { CareersClient } from '@/components/sections/careers-client';
import { ClosingCta } from '@/components/sections/closing-cta';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'Careers — Sourcing Desks & Operations in Surat',
    description:
      'No open roles today, and no roles invented to fill a page. What we look for, how hiring works at a founder-led export group in Surat, and where to send a speculative application.',
    path: '/careers',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/careers' },
};

/**
 * P11 — /careers.
 *
 * Rebuilt with React Bits Prompt 11:
 * - FallingText of role keywords with interactive gravity
 * - Stepper walkthrough for "How we hire" (all 4 steps)
 * - Speculative application copy preserved verbatim with instant clipboard feedback
 */
export default function CareersPage() {
  return (
    <main>
      <CareersClient />
      <ClosingCta />
    </main>
  );
}
