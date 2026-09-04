import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE, SHIVESHWAR_RELATIONSHIP } from '@/content/company';
import { DIVISIONS } from '@/content/taxonomy';

/**
 * P11 — the ecosystem, drawn from data.
 *
 * The audit's most damaging finding was that the site described Shiveshwar
 * Textiles three different ways in three places. This section is the single
 * structural answer: one typed relationship constant, one canonical sentence,
 * and a diagram whose nodes come from `COMPANY` and `DIVISIONS` — so a third
 * division, or a corrected relationship, changes the picture by editing data.
 */

const RELATIONSHIP_LABEL: Record<typeof SHIVESHWAR_RELATIONSHIP, string> = {
  'parent-company': 'Parent company',
  'strategic-partner': 'Strategic partner',
};

export function GroupEcosystem() {
  return (
    <Section surface="light">
      <Container>
        <SectionHeading
          eyebrow="The Ecosystem"
          title="One group. One manufacturing foundation. Two export divisions."
          lede={SHIVESHWAR_CANONICAL_SENTENCE}
        />

        <Reveal className="mt-3xl">
          <div className="mx-auto flex max-w-4xl flex-col items-stretch">
            {/* parent */}
            <Node
              label={RELATIONSHIP_LABEL[SHIVESHWAR_RELATIONSHIP]}
              name="Shiveshwar Textiles"
              detail="Woven textile production · Palsana, Surat"
            />

            <Connector />

            {/* group */}
            <Node
              label={`${COMPANY.tagline} · est. ${COMPANY.founded.year}`}
              name={COMPANY.legalName}
              detail={COMPANY.headquarters}
              emphasis
            />

            <Connector split />

            {/* divisions — mapped, never hardcoded */}
            <div className="grid grid-cols-12 gap-md">
              {DIVISIONS.map((division) => (
                <div key={division.slug} className="col-span-12 md:col-span-6">
                  <Node
                    label={division.slug === 'product-exports' ? 'Division' : 'Division · external property'}
                    name={division.name}
                    detail={division.description}
                    externalHref={division.externalHref}
                    externalLabel={division.externalLabel}
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Prose className="surface-muted mx-auto mt-2xl max-w-[68ch] text-body-sm">
          <p>
            {COMPANY.founded.note} Trivoxa Group is the international arm; the mill that informs its
            quality standards has been running for decades.
          </p>
        </Prose>
      </Container>
    </Section>
  );
}

function Node({
  label,
  name,
  detail,
  emphasis = false,
  externalHref,
  externalLabel,
}: {
  label: string;
  name: string;
  detail: string;
  emphasis?: boolean;
  externalHref?: string;
  externalLabel?: string;
}) {
  return (
    <div
      className={[
        'surface-raised flex flex-col gap-xs border p-lg',
        emphasis ? 'border-bronze/60' : 'surface-hairline',
      ].join(' ')}
    >
      <Eyebrow tick={false} className="surface-faint">
        {label}
      </Eyebrow>
      <p className={emphasis ? 'text-heading-lg' : 'text-body-lg font-medium'}>{name}</p>
      <p className="surface-muted text-body-sm">{detail}</p>
      {externalHref && externalLabel ? (
        <a
          href={externalHref}
          target="_blank"
          rel="noreferrer noopener"
          className="text-bronze mt-xs inline-flex items-center gap-1 text-body-sm font-medium"
        >
          {externalLabel}
          <ArrowUpRight aria-hidden size={13} />
        </a>
      ) : null}
    </div>
  );
}

/** The bronze hairline that carries the ownership relationship. */
function Connector({ split = false }: { split?: boolean }) {
  return (
    <div aria-hidden className="relative flex h-14 justify-center">
      <div className="bg-bronze/50 h-full w-px" />
      {split ? (
        <>
          <div className="bg-bronze/50 absolute top-1/2 left-1/4 h-px w-1/2" />
          <div className="bg-bronze/50 absolute top-1/2 left-1/4 h-6 w-px" />
          <div className="bg-bronze/50 absolute top-1/2 right-1/4 h-6 w-px" />
        </>
      ) : null}
    </div>
  );
}
