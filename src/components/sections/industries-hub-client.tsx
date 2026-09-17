'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container, Section } from '@/components/ui/layout';
import { ArrowLink } from '@/components/ui/link';
import { SectionHeading } from '@/components/ui/typography';
import { CAPABILITIES } from '@/content/capabilities';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import ChromaGrid, { type ChromaItem } from '@/components/reactbits/ChromaGrid/ChromaGrid';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { useWebGLSlot } from '@/lib/motion/webgl-budget';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

const Grainient = dynamic(() => import('@/components/reactbits/Grainient/Grainient'), {
  ssr: false,
});

export interface IndustryHubItem {
  slug: string;
  name: string;
  shortDescription: string;
  status: 'live' | 'onboarding';
  icon: string;
  productCount: number;
  liveProductCount: number;
}

interface IndustriesHubClientProps {
  hub: IndustryHubItem[];
  liveCount: number;
  productCount: number;
  portsLocode: string;
}

type FilterTab = 'all' | 'catalogued' | 'quoted';

export function IndustriesHubClient({
  hub,
  liveCount,
  productCount,
  portsLocode,
}: IndustriesHubClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const heroSectionRef = useRef<HTMLElement>(null);
  const webglSlot = useWebGLSlot('industries-grainient', heroSectionRef);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Filter logic:
  // - all: all 9 industries
  // - catalogued: live catalogue rows (productCount > 0 or live)
  // - quoted: quoted per order / onboarding (e.g. Furniture & Interiors: quoted, not yet catalogued)
  const filteredIndustries = hub.filter((item) => {
    if (activeFilter === 'catalogued') return item.productCount > 0 && item.status === 'live';
    if (activeFilter === 'quoted') return item.status === 'onboarding' || item.productCount === 0;
    return true;
  });

  const handleFilterChange = (filter: FilterTab) => {
    if (filter === activeFilter) return;

    if (!reducedMotion && gridContainerRef.current) {
      const state = Flip.getState(gridContainerRef.current.querySelectorAll('article, .chroma-card'));
      setActiveFilter(filter);
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.45,
          ease: 'power2.out',
          stagger: 0.03,
          absolute: false,
        });
      });
    } else {
      setActiveFilter(filter);
    }
  };

  const chromaItems: ChromaItem[] = filteredIndustries.map((ind) => ({
    image: `/brand/og/industry-${ind.slug}.png`,
    title: ind.name,
    subtitle: ind.shortDescription,
    handle: ind.productCount > 0 ? `${ind.productCount} rows` : 'Quoted on order',
    location: ind.status === 'live' ? 'Live' : 'Onboarding',
    url: `/industries/${ind.slug}`,
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(168,139,104,0.18), rgba(23,18,16,0.95))',
  }));

  return (
    <>
      {/* Hero: SplitText title + Grainient background */}
      <section ref={heroSectionRef} className="relative overflow-hidden bg-espresso-deep py-20 lg:py-28 text-ivory">
        {/* WebGL Grainient or CSS Fallback */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {webglSlot.hasSlot && !reducedMotion ? (
            <Grainient
              color1={BRAND.bronze.hex}
              color2={BRAND.espresso.hex}
              color3={BRAND.espressoDeep.hex}
              warpStrength={0.8}
              warpSpeed={1.2}
              grainAmount={0.06}
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bronze/20 via-espresso-deep to-espresso-deep" />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-espresso-deep/60 to-espresso-deep pointer-events-none" />

        <Container className="relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 font-mono text-xs text-bronze">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-ivory/80">Industries</span>
          </nav>

          <p className="eyebrow font-mono text-xs uppercase tracking-widest text-bronze mb-3">
            Industries We Serve
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ivory max-w-[56rem]">
            <SplitText
              text={`${hub.length} industries. One sourcing discipline.`}
              tag="span"
              className="inline-block"
              delay={35}
            />
          </h1>

          <p className="mt-6 max-w-[48rem] text-base sm:text-lg text-ivory/80 leading-relaxed">
            Each industry below is backed by catalogue rows with HS codes, grades, MOQs and lead times — or it is labelled onboarding, with what we can do for you today stated instead.
          </p>

          {/* Meta stats bar */}
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-bronze/20 pt-6 sm:grid-cols-4">
            <div>
              <p className="font-mono text-xs text-bronze">Industries</p>
              <p className="font-serif text-2xl font-bold text-ivory">{hub.length}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Live today</p>
              <p className="font-serif text-2xl font-bold text-ivory">{liveCount}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Catalogue rows</p>
              <p className="font-serif text-2xl font-bold text-ivory">{productCount}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Loading ports</p>
              <p className="font-mono text-sm font-semibold text-ivory mt-1">{portsLocode}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Grid Section with GSAP Flip Filter Pills */}
      <Section surface="light" className="py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-10">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900">
                Explore All Sectors
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Filter by verified catalog status or bespoke quoted supply
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-full border border-stone-200 w-fit" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'all'}
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-200 ${
                  activeFilter === 'all'
                    ? 'bg-espresso text-ivory-soft shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                All ({hub.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'catalogued'}
                onClick={() => handleFilterChange('catalogued')}
                className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-200 ${
                  activeFilter === 'catalogued'
                    ? 'bg-espresso text-ivory-soft shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Catalogued ({hub.filter((h) => h.productCount > 0 && h.status === 'live').length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === 'quoted'}
                onClick={() => handleFilterChange('quoted')}
                className={`px-4 py-1.5 rounded-full font-mono text-xs transition-all duration-200 ${
                  activeFilter === 'quoted'
                    ? 'bg-espresso text-ivory-soft shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                Quoted ({hub.filter((h) => h.status === 'onboarding' || h.productCount === 0).length})
              </button>
            </div>
          </div>

          {/* ChromaGrid container */}
          <div ref={gridContainerRef} className="w-full">
            <ChromaGrid
              items={chromaItems}
              radius={300}
              damping={0.45}
              className="py-4"
            />
          </div>
        </Container>
      </Section>

      {/* Capabilities Section */}
      <Section surface="dark" id="capabilities" className="py-20 bg-espresso-deep text-ivory">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title="Eight things we do, whichever industry the order is in."
            lede="Each one is evidenced somewhere on this site — a process step, a register, a catalogue column. Where we cannot evidence it, we do not list it."
          />

          <div className="mt-12 grid grid-cols-12 gap-6">
            {CAPABILITIES.map((capability, index) => (
              <div
                key={capability.slug}
                className="col-span-12 md:col-span-6 border-t border-bronze/20 pt-6 flex flex-col justify-between"
              >
                <div>
                  <p className="font-mono text-xs text-bronze mb-1">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif text-xl font-medium text-ivory">
                    {capability.name}
                  </h3>
                  <p className="mt-2 text-sm text-ivory/70 leading-relaxed max-w-[60ch]">
                    {capability.body}
                  </p>
                </div>
                <div className="mt-4 pt-2">
                  <ArrowLink href={capability.evidenceHref} className="text-xs text-bronze hover:text-ivory">
                    {capability.evidence} →
                  </ArrowLink>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
