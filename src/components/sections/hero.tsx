'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
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
          <div className="relative w-full h-full bg-gradient-to-b from-[#171210] via-[#241C18] to-[#171210]">
            <Noise patternSize={200} patternAlpha={10} />
          </div>
        )}
      </div>

      {/* Legibility Scrim */}
      <div
        aria-hidden="true"
        className="from-[#171210]/95 via-[#171210]/60 to-[#171210]/95 pointer-events-none absolute inset-0 bg-gradient-to-b z-[2]"
      />

      <div className="container-content relative z-10 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col items-center w-full max-w-[1240px] mx-auto text-center gap-5 sm:gap-7">
          {/* Eyebrow / Dateline */}
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="bg-[#A88B68] inline-block h-[2px] w-6 shrink-0" />
            <DecryptedText
              text="SURAT · GLOBAL HQ"
              animateOn="view"
              speed={40}
              className="text-xs sm:text-sm font-semibold tracking-widest text-[#A88B68] uppercase font-mono"
            />
            <span aria-hidden className="bg-[#A88B68] inline-block h-[2px] w-6 shrink-0" />
          </div>

          {/* Accessible H1 in the DOM */}
          <h1 className="sr-only">
            Building the Future of Global Commerce. Trivoxa Group.
          </h1>

          {/* Split Headline around Center Media Card */}
          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 my-1 sm:my-2">
            <span
              aria-hidden="true"
              className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.06] tracking-tight text-[#F4EFE6] lg:text-right lg:flex-1"
            >
              Building the Future
            </span>

            {/* Center Media Card: Mundra Port / Shipping Corridor */}
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[380px] aspect-[16/10] rounded-2xl overflow-hidden border border-[#A88B68]/40 bg-[#241C18] shadow-[0_20px_50px_rgba(0,0,0,0.7)] shrink-0 group">
              <Image
                src="/brand/eagle-poster.webp"
                alt="Trivoxa international maritime logistics and manufacturing operations"
                fill
                priority
                sizes="(max-width: 768px) 300px, 380px"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171210]/95 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between pointer-events-none">
                <span className="font-mono text-[10px] sm:text-xs text-[#F4EFE6]/90 font-medium tracking-wider uppercase bg-[#171210]/80 px-2.5 py-0.5 rounded border border-[#A88B68]/30">
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
              className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.06] tracking-tight text-[#F4EFE6] lg:text-left lg:flex-1"
            >
              of Global Commerce.
            </span>
          </div>

          {/* Sector Taxonomy Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A88B68]/30 bg-[#241C18]/80 text-xs sm:text-sm text-[#A88B68]">
            <span className="text-[#F4EFE6]/70 uppercase tracking-wider font-mono text-[10px]">
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
              mainClassName="font-medium text-[#F4EFE6]"
            />
          </div>

          {/* Authoritative Lede Paragraph */}
          <p className="surface-muted text-base sm:text-lg lg:text-xl max-w-[42rem] lg:max-w-[48rem] leading-relaxed text-[#F4EFE6]/80 text-center mx-auto">
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
          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2 border-t border-[#3D322A] pt-4 text-xs sm:text-sm text-[#F4EFE6]/70">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#A88B68] shrink-0" />
              <span className="font-mono text-[#A88B68] font-semibold">Surat, Gujarat</span>
              <span>· Global HQ</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#A88B68] shrink-0" />
              <span className="font-mono text-[#A88B68] font-semibold">Mundra &amp; JNPT</span>
              <span>· Port Lanes</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#A88B68] shrink-0" />
              <span className="font-mono text-[#A88B68] font-semibold">24h SLA</span>
              <span>· Guaranteed RFQ Response</span>
            </span>
          </div>

          {/* Scroll Cue */}
          <div className="pt-2">
            <p className="flex items-center justify-center gap-2 text-xs text-[#F4EFE6]/50 uppercase tracking-widest font-mono">
              <span aria-hidden className="bg-[#A88B68] inline-block h-4 w-px animate-pulse" />
              scroll to explore
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
