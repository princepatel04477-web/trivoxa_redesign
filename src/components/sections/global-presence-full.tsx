'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Container, Section } from '@/components/ui/layout';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import Counter from '@/components/reactbits/Counter/Counter';
import SpotlightCard from '@/components/reactbits/SpotlightCard/SpotlightCard';
import { GlobeLoader } from '@/components/three/globe-loader';
import { presenceNumbers, regionBlocks } from '@/lib/selectors';
import { PORTS } from '@/content/taxonomy';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REGIONS = [
  {
    title: 'Europe',
    slug: 'europe',
    subtitle: 'Textiles and precision components into Rotterdam & Hamburg',
    hubPort: 'Rotterdam',
    locode: 'NLRTM',
    marketFocus: 'European single market buyers with strict REACH chemical compliance and OEKO-TEX certification standards.',
    image: '/brand/og/industry-textile-apparel.png',
    lanePath: 'M 30 180 Q 140 40 310 70',
  },
  {
    title: 'Middle East',
    slug: 'middle-east',
    subtitle: 'Spices, building materials, and denim fabrics',
    hubPort: 'Jebel Ali',
    locode: 'AEJEA',
    marketFocus: 'High-velocity replenishment corridors across UAE, Saudi Arabia, and Oman through Dubai logistics hubs.',
    image: '/brand/og/industry-building-materials.png',
    lanePath: 'M 30 180 Q 120 120 220 135',
  },
  {
    title: 'Africa',
    slug: 'africa',
    subtitle: 'Pharmaceutical formulations and agricultural staples',
    hubPort: 'Mombasa',
    locode: 'KEMBA',
    marketFocus: 'East and West African commercial distribution tenders, hospital supply contracts, and grain/spice packaging plants.',
    image: '/brand/og/industry-healthcare-pharmaceuticals.png',
    lanePath: 'M 30 180 Q 70 200 170 260',
  },
  {
    title: 'North America',
    slug: 'north-america',
    subtitle: 'Commercial textiles, quartz slabs, and engineered fittings',
    hubPort: 'New York',
    locode: 'USNYC',
    marketFocus: 'US and Canadian institutional procurement requiring FDA registered facilities, UL standards, and verified warehouse drops.',
    image: '/brand/og/product-engineered-quartz.png',
    lanePath: 'M 30 180 Q 130 30 330 60',
  },
  {
    title: 'South America',
    slug: 'south-america',
    subtitle: 'Industrial fasteners, machine parts, and chemical intermediates',
    hubPort: 'Santos',
    locode: 'BRSSZ',
    marketFocus: 'Mercosur manufacturing assembly and agricultural equipment supply requiring consular documentation and phytosanitary certificates.',
    image: '/brand/og/industry-engineering-industrial.png',
    lanePath: 'M 30 180 Q 90 230 230 290',
  },
  {
    title: 'Asia-Pacific',
    slug: 'asia-pacific',
    subtitle: 'Technical yarns, specialized fabrics, and oleochemicals',
    hubPort: 'Singapore',
    locode: 'SGSIN',
    marketFocus: 'ASEAN regional re-export, electronics packaging, and contract blending supply chains operating on just-in-time schedules.',
    image: '/brand/og/product-cotton-yarn.png',
    lanePath: 'M 30 180 Q 200 190 320 220',
  },
];

export function GlobalPresenceFull() {
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const numbers = presenceNumbers();
  const ports = PORTS;
  const blocks = regionBlocks();
  const reducedMotion = useReducedMotion();

  const currentRegion = REGIONS[activeRegionIndex] ?? REGIONS[0]!;

  // Pinned 300vh scrub through 6 regions
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const step = Math.min(
          REGIONS.length - 1,
          Math.floor(self.progress * REGIONS.length)
        );
        setActiveRegionIndex(step);

        if (pathRef.current) {
          const totalLen = 400;
          const subProgress = (self.progress * REGIONS.length) % 1;
          pathRef.current.style.strokeDashoffset = `${totalLen - subProgress * totalLen}`;
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [reducedMotion]);

  return (
    <>
      {/* 1. Full-Page 300vh Pinned Globe Scrub Section */}
      <section
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-espresso-deep text-ivory flex flex-col justify-between"
      >
        {/* Subtle Topography SVG Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-15">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="full-presence-topo" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 0 30 Q 15 10, 30 30 T 60 30" fill="none" stroke={BRAND.bronze.hex} strokeWidth="0.75" />
                <path d="M 0 45 Q 15 25, 30 45 T 60 45" fill="none" stroke={BRAND.bronze.hex} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#full-presence-topo)" />
          </svg>
        </div>

        {/* Top Header Bar */}
        <div className="relative z-10 w-full pt-8 sm:pt-12">
          <Container>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-bronze/20 pb-6">
              <div>
                <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 font-mono text-xs text-bronze">
                  <Link href="/" className="hover:underline">Home</Link>
                  <span>/</span>
                  <span className="text-ivory/80">Global Presence</span>
                </nav>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory">
                  <SplitText
                    text="A Global Perspective. A Local Understanding."
                    tag="span"
                    className="inline-block"
                    delay={25}
                  />
                </h1>
                <div className="mt-2">
                  <ShinyText
                    text="The corridors we actually operate in — not live shipment tracking."
                    speed={4}
                    className="text-xs sm:text-sm text-bronze"
                  />
                </div>
              </div>

              {/* UN/LOCODE Loading Port Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-bronze uppercase">Loading Ports:</span>
                {ports.map((p) => (
                  <span
                    key={p.locode}
                    className="rounded border border-bronze/30 bg-espresso/80 px-2 py-0.5 font-mono text-xs text-ivory"
                  >
                    <SplitFlapText text={p.locode} flipDuration={0.4} />
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Center Canvas & Active Region Spotlight */}
        <div className="relative z-10 flex-1 flex items-center">
          <Container className="h-full">
            <div className="grid h-full grid-cols-12 items-center gap-8 py-4">
              {/* Left Column: 3D Interactive Globe */}
              <div className="col-span-12 lg:col-span-7 h-[340px] sm:h-[460px] lg:h-[540px] flex items-center justify-center">
                <div className="relative h-full w-full max-w-[540px]">
                  <GlobeLoader />
                </div>
              </div>

              {/* Right Column: Active Region SpotlightCard + Lane SVG + Live Counter Stats */}
              <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
                <SpotlightCard
                  spotlightColor="rgba(168, 139, 104, 0.25)"
                  className="p-8 rounded-[24px] bg-espresso-deep/90 border border-bronze/40 text-ivory shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b border-bronze/20 pb-3 mb-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-bronze">
                      Region 0{activeRegionIndex + 1} of 06
                    </span>
                    <span className="font-mono text-xs font-semibold text-ivory bg-espresso px-2.5 py-1 rounded border border-bronze/30">
                      Hub: {currentRegion.hubPort} ({currentRegion.locode})
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-ivory">
                    {currentRegion.title}
                  </h3>
                  <p className="mt-2 text-sm text-bronze font-medium">
                    {currentRegion.subtitle}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-ivory/70 leading-relaxed">
                    {currentRegion.marketFocus}
                  </p>

                  {/* Lane Route SVG */}
                  <div className="mt-6 pt-4 border-t border-bronze/20">
                    <div className="flex items-center justify-between font-mono text-[11px] text-bronze mb-1">
                      <span>Surat / Mundra (IN)</span>
                      <span>{currentRegion.hubPort} ({currentRegion.locode})</span>
                    </div>
                    <svg viewBox="0 0 360 80" className="w-full h-12 overflow-visible">
                      <path
                        d={currentRegion.lanePath}
                        fill="none"
                        stroke="rgba(168, 139, 104, 0.2)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      <path
                        ref={pathRef}
                        d={currentRegion.lanePath}
                        fill="none"
                        stroke={BRAND.bronze.hex}
                        strokeWidth="2.5"
                        strokeDasharray="400"
                        strokeDashoffset="0"
                        className="transition-all duration-300"
                      />
                      <circle cx="30" cy="50" r="4" fill={BRAND.bronze.hex} />
                      <circle cx="320" cy="20" r="4" fill={BRAND.bronze.hex} />
                    </svg>
                  </div>
                </SpotlightCard>

                {/* Counter Stats Bar */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-bronze/20 pt-4 text-center">
                  <div className="p-2 rounded-lg bg-espresso/60 border border-bronze/20">
                    <p className="font-mono text-[11px] text-bronze">Regions</p>
                    <p className="font-serif text-xl font-bold text-ivory">
                      <Counter value={numbers.regions} fontSize={20} />
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-espresso/60 border border-bronze/20">
                    <p className="font-mono text-[11px] text-bronze">Industries</p>
                    <p className="font-serif text-xl font-bold text-ivory">
                      <Counter value={numbers.industries} fontSize={20} />
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-espresso/60 border border-bronze/20">
                    <p className="font-mono text-[11px] text-bronze">Ports</p>
                    <p className="font-serif text-xl font-bold text-ivory">
                      <Counter value={numbers.ports} fontSize={20} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Region Step Indicator Bar at Bottom */}
        <div className="relative z-10 w-full border-t border-bronze/20 py-4 bg-espresso-deep/80 backdrop-blur-sm">
          <Container>
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {REGIONS.map((r, idx) => (
                <button
                  key={r.slug}
                  type="button"
                  onClick={() => setActiveRegionIndex(idx)}
                  className={`px-3 py-1 rounded-full font-mono text-xs transition-all ${
                    activeRegionIndex === idx
                      ? 'bg-bronze text-espresso-deep font-bold shadow'
                      : 'text-ivory/60 hover:text-ivory'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </Container>
        </div>
      </section>

      {/* 2. Detailed Region Blocks Grid Below */}
      <Section surface="light" id="regions" className="py-20">
        <Container>
          <div className="border-b border-stone-200 pb-6 mb-12">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              Verified Regional Supply Lines
            </h2>
            <p className="mt-2 text-base text-stone-600 max-w-[48rem]">
              Positioning is a sentence about the buyer, not an adjective about the market. Industry links lead directly to published catalogue rows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blocks.map(({ region, industries }) => (
              <div
                key={region.slug}
                className="flex flex-col justify-between p-6 rounded-2xl border border-stone-200 bg-stone-50 shadow-sm"
              >
                <div>
                  <div className="flex items-baseline justify-between border-b border-stone-200 pb-3 mb-4">
                    <h3 className="font-serif text-xl font-bold text-stone-900">{region.name}</h3>
                    <span className="font-mono text-xs text-bronze">
                      {industries.length} sectors
                    </span>
                  </div>

                  <p className="text-sm font-medium text-stone-800 leading-snug">
                    {region.marketFocus}
                  </p>

                  <p className="mt-3 text-xs text-stone-600 leading-relaxed">
                    {region.verifiableDetail}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 block mb-2">
                    Key Sectors:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {industries.map((ind) => (
                      <Link
                        key={ind.slug}
                        href={`/industries/${ind.slug}`}
                        className="rounded border border-stone-300 bg-white px-2 py-0.5 text-xs text-stone-700 hover:border-bronze hover:text-espresso transition-colors"
                      >
                        {ind.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3. Dedicated Loading Ports Section (#ports) */}
      <Section surface="dark" id="ports" className="py-20 border-t border-bronze/20">
        <Container>
          <div className="border-b border-bronze/20 pb-6 mb-12">
            <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-2">
              Maritime Infrastructure
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-ivory">
              Three Gujarat & Maharashtra Loading Ports
            </h2>
            <p className="mt-2 text-base text-ivory/70 max-w-[48rem]">
              Consignments originate within hours of the western seaboard. Cargo routes are chosen by commodity requirements, vessel frequency, and destination port clearance agreements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PORTS.map((port) => (
              <div
                key={port.slug}
                className="p-6 rounded-2xl border border-bronze/30 bg-espresso text-ivory flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-bronze/20 pb-3 mb-4">
                    <span className="font-mono text-sm font-bold text-bronze">{port.locode}</span>
                    <span className="font-mono text-xs text-ivory/60">Western India</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ivory">{port.name}</h3>
                  <p className="mt-3 text-sm text-ivory/80 leading-relaxed">
                    {port.reason}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-bronze/20 flex items-center justify-between text-xs font-mono text-bronze">
                  <span>Operational Hub</span>
                  <span>Direct Export Route →</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
