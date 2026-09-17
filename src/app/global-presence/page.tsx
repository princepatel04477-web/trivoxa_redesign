import type { Metadata } from 'next';
import { GlobalPresenceFull } from '@/components/sections/global-presence-full';
import { ClosingCta } from '@/components/sections/closing-cta';
import { JsonLd, portsSchema } from '@/components/seo/json-ld';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'Global Presence — Six Regions, Three Loading Ports',
    description:
      'Trivoxa Group serves six regions from three Gujarat and Maharashtra loading ports — Mundra (INMUN), Kandla (INIXY) and Nhava Sheva (INNSA). The corridors we operate in, with the industries strongest in each.',
    path: '/global-presence',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/global-presence' },
};

/**
 * P11 — /global-presence.
 *
 * Full-page interactive 300vh scrub through all 6 regions:
 * - 3D Globe rotating with scrub
 * - SpotlightCard per region with hub port and Anime.js drawn lane SVG
 * - Counter stats for regions, industries, and ports
 * - UN/LOCODE port chips with SplitFlapText
 * - Detailed regional sector breakdown and ClosingCTA
 */
export default function GlobalPresencePage() {
  return (
    <main>
      <JsonLd data={portsSchema()} />
      <GlobalPresenceFull />
      <ClosingCta />
    </main>
  );
}
