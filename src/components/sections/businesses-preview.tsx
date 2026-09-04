import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { CATEGORIES, DIVISIONS } from '@/content/taxonomy';

/**
 * P8 · SECTION D — Businesses preview.
 *
 * Two division cards rendered from DIVISIONS. The grid maps the array, so a
 * third division is a data edit — the client's doc is explicit that the
 * structure must accept one without redesign.
 *
 * Category chips come from the taxonomy (live categories only), and the
 * Service division signposts its dedicated property so the cross-property
 * handoff never reads as a dead end.
 */
export function BusinessesPreview() {
  return (
    <Section surface="light">
      <Container>
        <SectionHeading
          eyebrow="Our Businesses"
          title="Two operating arms. One commitment."
          lede="Products quoted against real specifications; services delivered by a dedicated technology property."
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-lg">
          {DIVISIONS.map((division, index) => {
            const chips =
              division.slug === 'product-exports'
                ? CATEGORIES.filter((category) => category.status === 'live').map((c) => c.name)
                : [
                    'Technology Solutions',
                    'AI Solutions',
                    'Branding & Design',
                    'Digital Marketing',
                    'Business Support',
                  ];

            return (
              <Card
                key={division.slug}
                trace
                lift
                className="col-span-12 flex flex-col gap-lg p-xl lg:col-span-6"
              >
                <div className="flex items-start justify-between gap-md">
                  <p className="surface-faint spec-value" data-spec>
                    {String(index + 1).padStart(2, '0')} / {String(DIVISIONS.length).padStart(2, '0')}
                  </p>
                  {division.externalHref ? (
                    <a
                      href={division.externalHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-bronze-ink inline-flex items-center gap-1 text-body-sm font-semibold"
                    >
                      {division.externalLabel}
                      <ArrowUpRight aria-hidden size={14} />
                    </a>
                  ) : null}
                </div>

                <h3 className="text-display-sm">{division.name}</h3>
                <p className="surface-muted text-body-md">{division.description}</p>

                <ul className="flex flex-wrap gap-xs">
                  {chips.map((chip) => (
                    <li
                      key={chip}
                      className="surface-hairline surface-muted border px-2.5 py-1 text-body-sm"
                    >
                      {chip}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-md">
                  <ArrowLink
                    href={
                      division.slug === 'product-exports'
                        ? '/businesses/product-exports'
                        : '/businesses/service-exports'
                    }
                  >
                    Explore {division.name}
                  </ArrowLink>
                </div>
              </Card>
            );
          })}
        </Reveal>
      </Container>
    </Section>
  );
}
