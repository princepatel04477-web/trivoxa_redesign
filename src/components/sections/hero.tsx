import { EagleLoader } from '@/components/three/eagle-loader';
import { SplitHeading } from '@/components/motion/split-heading';
import { HeroCopyMotion } from '@/components/sections/hero-copy-motion';
import { ButtonLink } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/typography';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';

/**
 * P6 · Hero — the particle eagle.
 *
 * Content is exactly what the audit said was worth keeping. The headline, sub
 * and CTAs are server-rendered and readable before any WebGL initialises:
 * LCP is the headline, never the canvas.
 *
 * The eagle behind it is tiered (EagleLoader): 80k particles + bloom at high,
 * 25k at medium, a composed static poster at low and under reduced motion.
 * Scroll dissolves the formation outward — scrubbed, so the visitor controls it.
 */
export function Hero() {
  return (
    <section
      id="hero"
      data-surface="deep"
      className="surface-bg surface-fg relative flex min-h-[100svh] items-center overflow-hidden pt-header"
    >
      <EagleLoader />

      {/* legibility veil — the particles never fight the type */}
      <div
        aria-hidden
        className="from-espresso-deep/85 via-espresso-deep/35 to-espresso-deep/85 pointer-events-none absolute inset-0 bg-gradient-to-b"
      />

      <div className="container-content relative z-10 py-section-tight">
        <div className="flex max-w-4xl flex-col items-start gap-lg">
          <HeroCopyMotion delay={0}>
            <Eyebrow>International Trade &amp; Business Group</Eyebrow>
          </HeroCopyMotion>

          <SplitHeading as="h1" className="text-display-xl max-w-[16ch]">
            Building the Future of Global Commerce.
          </SplitHeading>

          <HeroCopyMotion delay={200}>
            <p className="surface-muted text-body-lg max-w-[54ch]">
              Sourcing, manufacturing partnerships and professional services for international
              buyers. {SHIVESHWAR_CANONICAL_SENTENCE}
            </p>
          </HeroCopyMotion>

          <HeroCopyMotion delay={320}>
            <div className="mt-md flex flex-wrap items-center gap-md">
              <ButtonLink href="/rfq" size="lg" arrow>
                Request a Quote
              </ButtonLink>
              <ButtonLink href="/businesses" size="lg" variant="secondary">
                Explore What We Export
              </ButtonLink>
            </div>
          </HeroCopyMotion>

          <HeroCopyMotion delay={600}>
            <p className="surface-faint mt-3xl flex items-center gap-xs text-body-sm">
              <span aria-hidden className="bg-bronze inline-block h-8 w-px animate-pulse" />
              scroll to learn more
            </p>
          </HeroCopyMotion>
        </div>
      </div>
    </section>
  );
}
