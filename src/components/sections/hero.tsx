'use client';

import { EagleLoader } from '@/components/three/eagle-loader';
import { KineticTextReveal } from '@/components/motion/kinetic-text-reveal';
import {
  HeroEntranceTimeline,
  useHeroHeadlineComplete,
} from '@/components/sections/hero-entrance-timeline';
import { ButtonLink } from '@/components/ui/button';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';

/**
 * P6 · Hero — Sovereign, Rigorous, Architectural.
 *
 * Content is structured to guarantee perfect vertical clearance below the fixed
 * header on all viewports (laptops, standard monitors, 4K, and mobile).
 *
 * Text reveals are orchestrated by GSAP & Anime.js:
 *  1. Eyebrow hairline extends and text slides up from mask
 *  2. Headline words rise with 3D perspective from overflow masks
 *  3. Lede copy fades & glides up
 *  4. CTAs enter with tactile spring
 *  5. Proof ribbon docks with industrial port and SLA specifications
 */
export function Hero() {
  return (
    <section
      id="hero"
      data-surface="deep"
      className="surface-bg surface-fg relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      <EagleLoader />

      {/* legibility veil — the particles never fight the type */}
      <div
        aria-hidden
        className="from-espresso-deep/90 via-espresso-deep/45 to-espresso-deep/90 pointer-events-none absolute inset-0 bg-gradient-to-b"
      />

      <div className="container-content relative z-10 py-4 sm:py-6 lg:py-8">
        <HeroEntranceTimeline>
          <HeroContent />
        </HeroEntranceTimeline>
      </div>
    </section>
  );
}

/**
 * Rendered inside <HeroEntranceTimeline>, so `useHeroHeadlineComplete` reads
 * the handoff it provides — the lede/CTAs/proof-ribbon/scroll-cue below wait
 * for the headline (owned entirely by KineticTextReveal) to finish before
 * they play.
 */
function HeroContent() {
  const onHeadlineComplete = useHeroHeadlineComplete();

  return (
    <div className="flex max-w-[56rem] lg:max-w-[64rem] flex-col items-start gap-md sm:gap-lg">
      {/* Eyebrow */}
      <div className="overflow-hidden">
        <p className="eyebrow flex items-center gap-xs">
          <span
            aria-hidden
            className="hero-eyebrow-rule bg-bronze inline-block h-[3px] w-6 shrink-0 origin-left"
          />
          <span className="hero-eyebrow-text inline-block">
            International Trade &amp; Business Group
          </span>
        </p>
      </div>

      {/* Headline with Kinetic Text Reveal */}
      <KineticTextReveal
        as="h1"
        isHero
        onComplete={onHeadlineComplete}
        className="text-display-xl font-normal leading-[1.02] tracking-tight max-w-[56rem] lg:max-w-[64rem]"
      >
        Building the Future of Global Commerce.
      </KineticTextReveal>

      {/* Lede Paragraph */}
      <p className="hero-lede surface-muted text-body-lg sm:text-body-xl max-w-[42rem] lg:max-w-[48rem] leading-relaxed">
        Sourcing, manufacturing partnerships and professional services for international
        buyers. {SHIVESHWAR_CANONICAL_SENTENCE}
      </p>

      {/* Call to Actions */}
      <div className="mt-sm flex flex-wrap items-center gap-md sm:gap-lg">
        <div className="hero-cta">
          <ButtonLink href="/rfq" size="lg" arrow>
            Request a Quote
          </ButtonLink>
        </div>
        <div className="hero-cta">
          <ButtonLink href="/businesses" size="lg" variant="secondary">
            Explore What We Export
          </ButtonLink>
        </div>
      </div>

      {/* Hero Proof Ribbon — Institutional B2B Authority */}
      <div className="hero-proof-ribbon mt-lg sm:mt-xl flex flex-wrap items-center gap-x-lg gap-y-xs border-t border-ivory/12 pt-md text-body-sm surface-muted">
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-bronze shrink-0" />
          <span className="spec-value text-accent">Surat, Gujarat</span>
          <span>· Global HQ</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-bronze shrink-0" />
          <span className="spec-value text-accent">Mundra &amp; JNPT</span>
          <span>· Port Lanes</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-bronze shrink-0" />
          <span className="spec-value text-accent">24h SLA</span>
          <span>· Guaranteed RFQ Response</span>
        </span>
      </div>

      {/* Scroll Cue */}
      <div className="hero-scroll-cue pt-sm sm:pt-md">
        <p className="surface-faint flex items-center gap-xs text-body-sm">
          <span aria-hidden className="bg-bronze inline-block h-6 w-px animate-pulse" />
          scroll to explore
        </p>
      </div>
    </div>
  );
}
