'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/ui/layout';
import { ButtonLink } from '@/components/ui/button';
import TextPressure from '@/components/reactbits/TextPressure/TextPressure';
import { COMPANY, SHIVESHWAR_CANONICAL_SENTENCE } from '@/content/company';
import { DIVISIONS, INDUSTRIES } from '@/content/taxonomy';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

const LightRays = dynamic(() => import('@/components/reactbits/LightRays/LightRays'), {
  ssr: false,
});

export function GroupHero() {
  const webglSlot = useWebGLSlot('group-lightrays');
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#171210] py-24 sm:py-32 text-[#F4EFE6]">
      {/* LightRays WebGL background with CSS fallback */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {webglSlot.hasSlot && !reducedMotion ? (
          <LightRays
            raysOrigin="top-center"
            raysColor="#A88B68"
            raysSpeed={1.0}
            lightSpread={0.7}
            rayLength={1.8}
            noiseAmount={0.04}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#A88B68]/25 via-[#241C18]/80 to-[#171210]" />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#171210]/60 to-[#171210] pointer-events-none" />

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-xs text-[#A88B68]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className="text-[#F4EFE6]/80">The Group</span>
        </nav>

        <p className="eyebrow font-mono text-xs uppercase tracking-widest text-[#A88B68] mb-4">
          Corporate Heritage & Sourcing Network
        </p>

        {/* TextPressure Title */}
        <h1 className="my-6 max-w-3xl">
          <span className="hidden sm:block h-28 w-full">
            <TextPressure
              as="span"
              text="The Group"
              textColor="#F4EFE6"
              strokeColor="#A88B68"
              fontFamily="var(--font-serif, serif)"
            />
          </span>
          <span className="sm:hidden font-serif text-5xl font-bold text-[#F4EFE6] block">
            The Group
          </span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg sm:text-xl text-[#F4EFE6]/90 leading-relaxed font-sans">
          {SHIVESHWAR_CANONICAL_SENTENCE}
        </p>

        {/* Meta Stats Bar */}
        <div className="mt-12 grid grid-cols-2 gap-6 border-t border-[#A88B68]/20 pt-8 sm:grid-cols-5">
          <div>
            <p className="font-mono text-xs text-[#A88B68]">Established</p>
            <p className="font-serif text-2xl font-bold text-[#F4EFE6]">{COMPANY.founded.year}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#A88B68]">Headquarters</p>
            <p className="font-serif text-2xl font-bold text-[#F4EFE6]">Surat, Gujarat</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#A88B68]">Mill Foundation</p>
            <p className="font-serif text-2xl font-bold text-[#F4EFE6]">Shiveshwar</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#A88B68]">Divisions</p>
            <p className="font-serif text-2xl font-bold text-[#F4EFE6]">{DIVISIONS.length}</p>
          </div>
          <div>
            <p className="font-mono text-xs text-[#A88B68]">Export Sectors</p>
            <p className="font-serif text-2xl font-bold text-[#F4EFE6]">{INDUSTRIES.length}</p>
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
