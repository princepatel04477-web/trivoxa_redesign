import type { ReactNode } from 'react';
import { KineticTextReveal } from '@/components/motion/kinetic-text-reveal';
import { Reveal } from '@/components/motion/reveal';
import { Breadcrumb, type Crumb } from '@/components/ui/breadcrumb';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose } from '@/components/ui/typography';
import type { Surface } from '@/lib/tokens/colors';
import { JsonLd, breadcrumbSchema } from '@/components/seo/json-ld';

export type PageHeroProps = {
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  /** Breadcrumb trail, rendered from route data by each page. */
  trail?: Crumb[];
  /**
   * Facts in the data face — years, counts, LOCODEs. Reserved for the things
   * Geist Mono is reserved for; a marketing phrase here would be a bug.
   */
  meta?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
  surface?: Surface;
  size?: 'display-xl' | 'display-lg' | 'display-md';
  children?: ReactNode;
};

/**
 * <PageHero> — the one way an inner page opens (P11 onward).
 *
 * Same rhythm everywhere: breadcrumb, eyebrow, split-mask H1, lede, then a
 * hairline row of facts in the data face. Pages own their H1 and nothing else
 * invents a header layout, which is how the live site ended up with six
 * different ideas of what a page top looks like.
 *
 * The H1 is SplitHeading (GSAP SplitText) but it is server-rendered text
 * first: no JS, no fonts, no WebGL — the words are there.
 */
/** Tailwind can't see interpolated class names, so sizes are a literal map. */
const SIZES: Record<NonNullable<PageHeroProps['size']>, string> = {
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
};

export function PageHero({
  eyebrow,
  title,
  lede,
  trail = [],
  meta,
  actions,
  surface = 'light',
  size = 'display-lg',
  children,
}: PageHeroProps) {
  // The trail is data the page already passes for the visible breadcrumb, so
  // the BreadcrumbList node is emitted here rather than repeated per page —
  // one place, and a page cannot have one without the other.
  const breadcrumbs = breadcrumbSchema(trail);

  return (
    <Section surface={surface} className="pt-header" bleed>
      {breadcrumbs ? <JsonLd data={breadcrumbs} /> : null}
      <Container>
        {trail.length > 0 ? <Breadcrumb trail={trail} className="mb-xl" /> : null}

        <div className="grid grid-cols-12 gap-xl">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow>{eyebrow}</Eyebrow>
            <KineticTextReveal as="h1" isHero className={`${SIZES[size]} mt-lg max-w-[56rem]`}>
              {title}
            </KineticTextReveal>
            {lede ? (
              <Prose className="mt-lg max-w-[62ch] text-body-lg">
                {typeof lede === 'string' ? <p>{lede}</p> : lede}
              </Prose>
            ) : null}
            {actions ? <div className="mt-xl flex flex-wrap items-center gap-md">{actions}</div> : null}
          </div>

          {meta && meta.length > 0 ? (
            <Reveal as="div" delay={200} className="col-span-12 lg:col-span-4">
              <dl className="surface-hairline border-t">
                {meta.map((item) => (
                  <div
                    key={item.label}
                    className="surface-hairline flex items-baseline justify-between gap-md border-b py-md"
                  >
                    <dt className="surface-faint spec-value uppercase" data-spec>
                      {item.label}
                    </dt>
                    <dd className="surface-fg spec-value text-right" data-spec>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ) : null}
        </div>

        {children}
      </Container>
    </Section>
  );
}
