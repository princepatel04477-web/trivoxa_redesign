'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { HeroCopyMotion } from '@/components/sections/hero-copy-motion';
import RotatingText from '@/components/reactbits/RotatingText/RotatingText';
import Magnet from '@/components/reactbits/Magnet/Magnet';
import DarkVeil from '@/components/reactbits/DarkVeil/DarkVeil';
import Noise from '@/components/reactbits/Noise/Noise';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

/**
 * Hero component — Rebuilt strictly to Prompt 2 / State 1 specifications.
 *
 * STATE 1 (At the fold, visible immediately without scrolling):
 * - Dateline / HQ eyebrow
 * - Split headline flanking the center media card:
 *     "Building the Future" (left) · [Mundra Port Media Card] · "of Global Commerce." (right)
 * - Accessible <h1> preserved in the DOM for SEO and screen readers.
 * - Sector taxonomy badge with cycling sector names via RotatingText.
 * - Authoritative lede paragraph featuring the canonical Shiveshwar lineage sentence.
 * - Dual primary and secondary CTAs ("Request a Quote" / "Explore What We Export").
 * - Institutional B2B proof ribbon (Surat HQ, Mundra & JNPT, 24h SLA).
 * - Animated scroll cue.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const webglSlot = useWebGLSlot('hero-darkveil', sectionRef);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-surface="deep"
      className="surface-bg surface-fg relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24"
    >
      {/* Background WebGL / Token Fallback */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {webglSlot.hasSlot && !reducedMotion ? (
          <DarkVeil
            hueShift={0}
            noiseIntensity={0.03}
            scanlineIntensity={0.02}
            speed={0.3}
            className="w-full h-full opacity-50"
          />
        ) : (
          <div className="from-espresso-deep via-espresso to-espresso-deep relative h-full w-full bg-gradient-to-b">
            <Noise patternSize={200} patternAlpha={10} />
          </div>
        )}
      </div>

      {/* Legibility Scrim */}
      <div
        aria-hidden="true"
        className="from-espresso-deep/95 via-espresso-deep/60 to-espresso-deep/95 pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b"
      />

      <div className="container-content relative z-10 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col items-center w-full max-w-[1240px] mx-auto text-center gap-5 sm:gap-7">
          {/* Eyebrow / Dateline — CSS entrance only; this sits on the LCP path. */}
          <HeroCopyMotion delay={0}>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="bg-bronze inline-block h-[2px] w-6 shrink-0" />
              <span className="text-bronze text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono">
                SURAT · GLOBAL HQ
              </span>
              <span aria-hidden className="bg-bronze inline-block h-[2px] w-6 shrink-0" />
            </div>
          </HeroCopyMotion>

          {/* Accessible H1 in the DOM */}
          <h1 className="sr-only">
            Building the Future of Global Commerce. Trivoxa Group.
          </h1>

          {/* Split Headline around Center Media Card */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 my-1 sm:my-2">
            <span
              aria-hidden="true"
              className="text-ivory font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.06] tracking-tight lg:text-right lg:flex-1"
            >
              Building the Future
            </span>

            {/* Center Media Card: Mundra Port / Shipping Corridor */}
            <div className="border-bronze/40 bg-espresso group relative aspect-[16/10] w-full max-w-[300px] shrink-0 overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.7)] sm:max-w-[360px] lg:max-w-[380px]">
              <Image
                src="/brand/eagle-poster.webp"
                alt="Trivoxa international maritime logistics and manufacturing operations"
                fill
                priority
                sizes="(max-width: 768px) 300px, 380px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-85"
              />
              <div className="from-espresso-deep/95 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-3 bottom-2.5 flex items-center justify-between">
                <span className="text-ivory/90 bg-espresso-deep/80 border-bronze/30 rounded border px-2.5 py-0.5 font-mono text-[10px] font-medium tracking-wider uppercase sm:text-xs">
                  Mundra Port · INMUN
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="text-ivory font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.06] tracking-tight lg:text-left lg:flex-1"
            >
              of Global Commerce.
            </span>
          </div>

          {/* Sector Taxonomy Pill */}
          <div className="border-bronze/30 bg-espresso/80 text-bronze inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs sm:text-sm">
            <span className="text-ivory/70 font-mono text-[10px] uppercase tracking-wider">
              Export Sectors:
            </span>
            <RotatingText
              texts={[
                'Textiles & Apparel',
                'Pharmaceuticals',
                'Building Materials',
                'Agri & Food',
                'Engineering Hardware',
              ]}
              rotationInterval={2400}
              mainClassName="text-ivory font-medium"
            />
          </div>

          {/* Authoritative Lede Paragraph */}
          <p className="text-ivory/80 mx-auto max-w-[42rem] text-center text-base leading-relaxed sm:text-lg lg:max-w-[48rem] lg:text-xl">
            Sourcing, manufacturing partnerships and professional services for international
            buyers. {SHIVESHWAR_CANONICAL_SENTENCE}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
            <Magnet magnetStrength={0.25} padding={40}>
              <ButtonLink href="/rfq" size="lg" arrow data-cursor="target">
                Request a Quote
              </ButtonLink>
            </Magnet>
            <ButtonLink href="/businesses" size="lg" variant="secondary" data-cursor="target">
              Explore What We Export
            </ButtonLink>
          </div>

          {/* Institutional Proof Ribbon */}
          <div className="text-ivory/70 mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t pt-4 text-xs sm:mt-6 sm:gap-x-8 sm:text-sm">
            <span className="flex items-center gap-2">
              <span className="bg-bronze size-1.5 shrink-0 rounded-full" />
              <span className="text-bronze font-mono font-semibold">Surat, Gujarat</span>
              <span>· Global HQ</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-bronze size-1.5 shrink-0 rounded-full" />
              <span className="text-bronze font-mono font-semibold">Mundra &amp; JNPT</span>
              <span>· Port Lanes</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-bronze size-1.5 shrink-0 rounded-full" />
              <span className="text-bronze font-mono font-semibold">24h SLA</span>
              <span>· Guaranteed RFQ Response</span>
            </span>
          </div>

          {/* Scroll Cue */}
          <div className="pt-2">
            <p className="text-ivory/50 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-widest">
              <span aria-hidden className="bg-bronze inline-block h-4 w-px animate-pulse" />
              scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
