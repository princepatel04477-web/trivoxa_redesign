'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ButtonLink } from '@/components/ui/button';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { HeroCopyMotion } from '@/components/sections/hero-copy-motion';
import RotatingText from '@/components/reactbits/RotatingText/RotatingText';
import Magnet from '@/components/reactbits/Magnet/Magnet';
import DarkVeil from '@/components/reactbits/DarkVeil/DarkVeil';
import Noise from '@/components/reactbits/Noise/Noise';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const Hero3DLogo = dynamic(
  () => import('@/components/three/hero-3d-logo').then((mod) => mod.Hero3DLogo),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_24px_rgba(168,139,104,0.4)]">
          <Image
            src="/brand/_incoming/1.png"
            alt="Trivoxa Group 3D Emblem"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    ),
  }
);

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
      className="surface-bg surface-fg relative flex min-h-[100dvh] lg:h-[100dvh] lg:max-h-[100dvh] flex-col justify-center overflow-hidden pt-20 pb-6 sm:pt-24 sm:pb-8 lg:pt-24 lg:pb-6"
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

      <div className="container-content relative z-10 py-2 sm:py-4 lg:py-4 flex flex-col justify-center h-full">
        <div className="flex flex-col items-center w-full max-w-[1240px] mx-auto text-center gap-3 sm:gap-4 lg:gap-5">
          {/* Eyebrow / Dateline with 3D Logo Emblem */}
          <HeroCopyMotion delay={0}>
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 drop-shadow-[0_0_12px_rgba(168,139,104,0.5)]">
                <Image
                  src="/brand/_incoming/1.png"
                  alt="Trivoxa Group 3D Emblem"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <span aria-hidden className="bg-bronze inline-block h-[2px] w-5 shrink-0" />
              <span className="text-bronze text-xs sm:text-sm font-semibold tracking-widest uppercase font-mono">
                SURAT · GLOBAL HQ
              </span>
              <span aria-hidden className="bg-bronze inline-block h-[2px] w-5 shrink-0" />
            </div>
          </HeroCopyMotion>

          {/* Accessible H1 in the DOM */}
          <h1 className="sr-only">
            Building the Future of Global Commerce. Trivoxa Group.
          </h1>

          {/* Split Headline around Center Media Card */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-6 my-0 sm:my-1">
            <span
              aria-hidden="true"
              className="text-ivory font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal leading-[1.08] tracking-tight lg:text-right lg:flex-1"
            >
              Building the Future
            </span>

            {/* Center Media Card: Interactive 3D Horse Emblem */}
            <div className="border-bronze/50 bg-radial from-bronze/20 via-espresso/95 to-espresso-deep group relative w-[260px] h-[210px] sm:w-[310px] sm:h-[240px] lg:w-[340px] lg:h-[260px] shrink-0 overflow-hidden rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(168,139,104,0.15)]">
              <Hero3DLogo />
            </div>

            <span
              aria-hidden="true"
              className="text-ivory font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal leading-[1.08] tracking-tight lg:text-left lg:flex-1"
            >
              of Global Commerce.
            </span>
          </div>

          {/* Sector Taxonomy Pill */}
          <div className="border-bronze/30 bg-espresso/80 text-bronze inline-flex items-center gap-2 rounded-full border px-4 py-1 text-xs sm:text-sm">
            <span className="text-ivory/70 font-mono text-[10px] uppercase tracking-wider">
              Export Sectors:
            </span>
            <RotatingText
              texts={[
                'Textiles & Apparel',
                'Jewellery & Precious Products',
                'Pharmaceuticals',
                'Building Materials',
                'Agri, Food & Seafood',
                'Engineering Hardware',
              ]}
              rotationInterval={2400}
              mainClassName="text-ivory font-medium"
            />
          </div>

          {/* Authoritative Lede Paragraph */}
          <p className="text-ivory/80 mx-auto max-w-[40rem] text-center text-sm sm:text-base leading-relaxed lg:max-w-[46rem]">
            Sourcing, manufacturing partnerships and professional services for international
            buyers. {SHIVESHWAR_CANONICAL_SENTENCE}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Magnet magnetStrength={0.25} padding={40}>
              <ButtonLink href="/rfq" size="md" arrow data-cursor="target">
                Request a Quote
              </ButtonLink>
            </Magnet>
            <ButtonLink href="/businesses" size="md" variant="secondary" data-cursor="target">
              Explore What We Export
            </ButtonLink>
          </div>

          {/* Institutional Proof Ribbon */}
          <div className="text-ivory/70 mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 border-t border-bronze/20 pt-3 text-xs sm:text-sm">
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
          <div className="pt-1">
            <p className="text-ivory/50 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest">
              <span aria-hidden className="bg-bronze inline-block h-3 w-px animate-pulse" />
              scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
