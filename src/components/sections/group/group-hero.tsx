'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import TextPressure from '@/components/reactbits/TextPressure/TextPressure';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { DIVISIONS, INDUSTRIES } from '@/content/taxonomy';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { WebGLErrorBoundary } from '@/components/three/webgl-error-boundary';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const LightRays = dynamic(() => import('@/components/reactbits/LightRays/LightRays'), {
  ssr: false,
});

export function GroupHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const webglSlot = useWebGLSlot('group-lightrays', sectionRef);
  const reducedMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-espresso-deep py-24 sm:py-32 text-ivory">
      {/* LightRays WebGL background with CSS fallback */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {webglSlot.hasSlot && !reducedMotion ? (
          <WebGLErrorBoundary fallback={null}>
            <LightRays
              raysOrigin="top-center"
              raysColor={BRAND.bronze.hex}
              raysSpeed={1.0}
              lightSpread={0.7}
              rayLength={1.8}
              noiseAmount={0.04}
            />
          </WebGLErrorBoundary>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bronze/25 via-espresso/80 to-espresso-deep" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-espresso-deep/60 to-espresso-deep pointer-events-none" />

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-xs text-bronze">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-ivory/80">The Group</span>
        </nav>

        <p className="eyebrow font-mono text-xs uppercase tracking-widest text-bronze mb-4">
          Corporate Heritage & Sourcing Network
        </p>

        {/* TextPressure Title */}
        <h1 className="my-6 max-w-[48rem]">
          <span className="hidden sm:block h-28 w-full">
            <TextPressure
              as="span"
              text="The Group"
              textColor={BRAND.ivory.hex}
              strokeColor={BRAND.bronze.hex}
              fontFamily="var(--font-serif, serif)"
            />
          </span>
          <span className="sm:hidden font-serif text-5xl font-bold text-ivory block">
            The Group
          </span>
        </h1>

        <p className="mt-6 max-w-[48rem] text-lg sm:text-xl text-ivory/90 leading-relaxed font-sans">
          {SHIVESHWAR_CANONICAL_SENTENCE}
        </p>

        {/* Meta Stats Bar */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-bronze/20 pt-8 sm:grid-cols-5">
          <div>
            <p className="font-mono text-xs text-bronze">Established</p>
            <p className="font-serif text-2xl font-bold text-ivory">{COMPANY.founded.year}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-bronze">Headquarters</p>
            <p className="font-serif text-2xl font-bold text-ivory">Surat, Gujarat</p>
          </div>
          <div>
            <p className="font-mono text-xs text-bronze">Mill Foundation</p>
            <p className="font-serif text-2xl font-bold text-ivory">Shiveshwar</p>
          </div>
          <div>
            <p className="font-mono text-xs text-bronze">Divisions</p>
            <p className="font-serif text-2xl font-bold text-ivory">{DIVISIONS.length}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-bronze">Export Sectors</p>
            <p className="font-serif text-2xl font-bold text-ivory">{INDUSTRIES.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/businesses" arrow>
            What we export
          </ButtonLink>
          <ButtonLink href="/rfq" variant="secondary">
            Request a Quotation
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
