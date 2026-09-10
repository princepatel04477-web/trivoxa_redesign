import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { CATEGORIES, DIVISIONS, INDUSTRIES } from '@/content/taxonomy';
import { SERVICES } from '@/content/process';
import { proofBand } from '@/lib/selectors';

/**
 * P12 — the two divisions, in full.
 *
 * Rendered from `DIVISIONS` so a third division is a data edit (ADR 025). Each
 * card carries the concrete inventory behind it — live categories and industry
 * count for products, the six service lines for services — because "built on
 * the same operating principles" is exactly the kind of sentence the audit
 * called abstraction stacking unless something checkable sits under it.
 */
export function Divisions() {
  const product = DIVISIONS.find((division) => division.slug === 'product-exports');
  const service = DIVISIONS.find((division) => division.slug === 'service-exports');
  const liveCategories = CATEGORIES.filter((category) => category.status === 'live');
  const liveProducts = proofBand().liveProductCount;

  return (
    <Section surface="light">
      <Container>
        <SectionHeading
          eyebrow="Divisions"
          title="What each arm actually does."
          lede="Product Exports ships physical goods against written specifications. Service Exports delivers professional services through the group's dedicated technology property."
        />

        <Reveal staggerChildren className="mt-3xl grid grid-cols-12 gap-lg">
          {product ? (
            <Card trace className="col-span-12 flex flex-col gap-lg p-xl lg:col-span-6">
              <div className="flex flex-col gap-xs">
                <h3 className="text-display-sm">{product.name}</h3>
                <Prose className="text-body-md">
                  <p className="surface-muted">{product.description}</p>
                </Prose>
              </div>

              <dl className="surface-hairline grid grid-cols-3 border-y">
                {[
                  { label: 'Industries', value: INDUSTRIES.length },
                  { label: 'Live categories', value: liveCategories.length },
                  { label: 'Live products', value: liveProducts },
                ].map((item) => (
                  <div key={item.label} className="surface-hairline px-md py-lg first:pl-0 last:border-r-0">
                    <dt className="surface-faint spec-value uppercase" data-spec>
                      {item.label}
                    </dt>
                    <dd className="surface-fg text-heading-lg mt-xs">{item.value}</dd>
                  </div>
                ))}
              </dl>

              <ul className="flex flex-wrap gap-xs">
                {CATEGORIES.map((category) => (
                  <li
                    key={category.slug}
                    className="surface-hairline surface-muted border px-2.5 py-1 text-body-sm"
                  >
                    {category.name}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-md pt-md">
                <ButtonLink href="/businesses/product-exports" arrow>
                  Product catalogue
                </ButtonLink>
                <ButtonLink href="/industries" variant="secondary">
                  By industry
                </ButtonLink>
              </div>
            </Card>
          ) : null}

          {service ? (
            <Card trace className="col-span-12 flex flex-col gap-lg p-xl lg:col-span-6">
              <div className="flex flex-col gap-xs">
                <div className="flex flex-wrap items-baseline justify-between gap-md">
                  <h3 className="text-display-sm">{service.name}</h3>
                  {service.externalHref && service.externalLabel ? (
                    <a
                      href={service.externalHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-bronze-ink inline-flex items-center gap-1 text-body-sm font-medium"
                    >
                      {service.externalLabel}
                      <ArrowUpRight aria-hidden size={13} />
                    </a>
                  ) : null}
                </div>
                <Prose className="text-body-md">
                  <p className="surface-muted">{service.description}</p>
                </Prose>
              </div>

              <ul className="surface-hairline flex flex-col border-y">
                {SERVICES.map((item) => (
                  <li
                    key={item.slug}
                    className="surface-hairline flex items-baseline justify-between gap-md border-b py-md last:border-b-0"
                  >
                    <span className="surface-fg text-body-md">{item.name}</span>
                    <span className="surface-faint spec-value text-body-sm" data-spec>
                      {item.deliverables.length} deliverables
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-md pt-md">
                <ButtonLink href="/businesses/service-exports" arrow>
                  Service lines & engagement
                </ButtonLink>
              </div>
            </Card>
          ) : null}
        </Reveal>
      </Container>
    </Section>
  );
}
