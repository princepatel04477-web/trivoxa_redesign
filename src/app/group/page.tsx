import type { Metadata } from 'next';
import { GroupHero } from '@/components/sections/group/group-hero';
import { GroupEcosystem } from '@/components/sections/group/ecosystem';
import { GroupFoundation } from '@/components/sections/group/foundation';
import { GroupJourney } from '@/components/sections/group/journey';
import { GroupLeadership } from '@/components/sections/group/leadership';
import { GroupWay } from '@/components/sections/group/way-and-commitments';
import { JsonLd, foundersPersonSchema } from '@/components/seo/json-ld';
import { COMPANY } from '@/content/company';
import { buildRouteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  ...buildRouteMetadata({
    title: 'The Group — Leadership, Journey and Manufacturing Foundation',
    description: `${COMPANY.legalName} is an international trade and business group headquartered in Surat, Gujarat. Discover our leadership, operating export divisions, and mill manufacturing foundation.`,
    path: '/group',
  }),
  alternates: { canonical: 'https://trivoxagroup.com/group' },
};

/**
 * P11 — /group.
 *
 * Rebuilt with React Bits Prompt 11:
 * - Hero: TextPressure "The Group" + LightRays background
 * - Journey timeline: ScrollStack cards + scrubbed spine line
 * - Leadership: ProfileCard per founder with 3D tilt
 * - Foundation: Shiveshwar Foundation with ScrollReveal and BounceCards
 */
export default function GroupPage() {
  return (
    <main>
      <JsonLd data={foundersPersonSchema()} />
      <GroupHero />
      <GroupEcosystem />
      <GroupJourney />
      <GroupLeadership />
      <GroupWay />
      <GroupFoundation />
    </main>
  );
}
