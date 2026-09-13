import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/page-hero';
import { GroupEcosystem } from '@/components/sections/group/ecosystem';
import { GroupFoundation } from '@/components/sections/group/foundation';
import { GroupJourney } from '@/components/sections/group/journey';
import { GroupLeadership } from '@/components/sections/group/leadership';
import { GroupWay } from '@/components/sections/group/way-and-commitments';
import { ButtonLink } from '@/components/ui/button';
import { JsonLd, foundersPersonSchema } from '@/components/seo/json-ld';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { DIVISIONS, INDUSTRIES } from '@/content/taxonomy';

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
 * The page the audit called the credibility centre of the site, and the one
 * place where the Shiveshwar relationship must be stated exactly once, exactly
 * right. Order: who we are → the structure → the journey → the people → the
 * principles → the mill → the commercial ask.
 */
export default function GroupPage() {
  return (
    <>
      <JsonLd data={foundersPersonSchema()} />
      <PageHero
        eyebrow="The Group"
        title="Trivoxa Group"
        lede={SHIVESHWAR_CANONICAL_SENTENCE}
        trail={[
          { href: '/', label: 'Home' },
          { href: '/group', label: 'The Group' },
        ]}
        meta={[
          { label: 'Established', value: COMPANY.founded.year },
          { label: 'Headquarters', value: COMPANY.headquarters },
          { label: 'Parent', value: 'Shiveshwar Textiles' },
          { label: 'Divisions', value: DIVISIONS.length },
          { label: 'Industries', value: INDUSTRIES.length },
        ]}
        actions={
          <>
            <ButtonLink href="/businesses" arrow>
              What we export
            </ButtonLink>
            <ButtonLink href="/rfq" variant="secondary">
              Request a Quotation
            </ButtonLink>
          </>
        }
      />

      <GroupEcosystem />
      <GroupJourney />
      <GroupLeadership />
      <GroupWay />
      <GroupFoundation />
    </>
  );
}
