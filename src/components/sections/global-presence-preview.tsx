'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import SplitFlapText from '@/components/reactbits/SplitFlapText/SplitFlapText';
import ChromaGrid from '@/components/reactbits/ChromaGrid/ChromaGrid';
import Counter from '@/components/reactbits/Counter/Counter';
import { GlobeLoader } from '@/components/three/globe-loader';
import { presenceNumbers } from '@/lib/selectors';
import { animate, svg } from '@/lib/motion/anime';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REGION_DATA = [
  {
    title: 'Europe',
    subtitle: 'Textiles and precision components into Rotterdam & Hamburg',
    location: 'Rotterdam (NL RTM)',
    handle: 'Hub Port',
    image: '/brand/og/industry-textile-apparel.png',
    borderColor: '#A88B68',
    gradient: 'linear-gradient(145deg, rgba(168,139,104,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 140 60 280 90',
  },
  {
    title: 'Middle East',
    subtitle: 'Spices, building materials, and denim fabrics',
    location: 'Jebel Ali (AE JEA)',
    handle: 'Hub Port',
    image: '/brand/og/industry-building-materials.png',
    borderColor: '#C4A47C',
    gradient: 'linear-gradient(145deg, rgba(196,164,124,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 120 130 200 140',
  },
  {
    title: 'Africa',
    subtitle: 'Pharmaceutical formulations and agricultural staples',
    location: 'Mombasa (KE MBA)',
    handle: 'Hub Port',
    image: '/brand/og/industry-healthcare-pharmaceuticals.png',
    borderColor: '#8C7355',
    gradient: 'linear-gradient(145deg, rgba(140,115,85,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 80 200 160 250',
  },
  {
    title: 'North America',
    subtitle: 'Commercial textiles, quartz slabs, and engineered fittings',
    location: 'New York (US NYC)',
    handle: 'Hub Port',
    image: '/brand/og/product-engineered-quartz.png',
    borderColor: '#A88B68',
    gradient: 'linear-gradient(145deg, rgba(168,139,104,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 120 40 320 80',
  },
  {
    title: 'South America',
    subtitle: 'Industrial fasteners, machine parts, and chemical intermediates',
    location: 'Santos (BR SSZ)',
    handle: 'Hub Port',
    image: '/brand/og/industry-engineering-industrial.png',
    borderColor: '#AF916E',
    gradient: 'linear-gradient(145deg, rgba(175,145,110,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 100 240 220 280',
  },
  {
    title: 'Asia-Pacific',
    subtitle: 'Yarn, agro-commodities, and digital services',
    location: 'Singapore (SG SIN)',
    handle: 'Hub Port',
    image: '/brand/og/product-cotton-yarn.png',
    borderColor: '#C4A47C',
    gradient: 'linear-gradient(145deg, rgba(196,164,124,0.15), rgba(23,18,16,0.95))',
    lanePath: 'M 40 180 Q 180 200 290 220',
  },
];

export function GlobalPresencePreview() {
  const numbers = presenceNumbers();
  const [activeRegionIndex, setActiveRegionIndex] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const routeSvgRef = useRef<SVGSVGElement>(null);
  const lanePathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  // Draw SVG route map whenever activeRegionIndex changes
  useEffect(() => {
    if (reducedMotion || !lanePathRef.current) return;

    const path = lanePathRef.current;
    const drawable = svg.createDrawable(path);
    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 1200,
      ease: 'inOutQuad',
    });
  }, [activeRegionIndex, reducedMotion]);

  // Pin section on desktop for 150vh scrub rotation
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Stats trigger on enter
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => setStatsVisible(true),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const activeRegion = REGION_DATA[activeRegionIndex] ?? REGION_DATA[0]!;

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-stone-950 text-stone-100">
      {/* Background: Static Topography SVG (0 WebGL budget consumed) */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M 0 50 Q 50 20 100 50 T 200 50 M 0 100 Q 50 70 100 100 T 200 100 M 0 150 Q 50 120 100 150 T 200 150"
                fill="none"
                stroke="#A88B68"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
        </svg>
      </div>

      <Section surface="deep" className="relative z-10 py-24">
        <Container>
          {/* Header */}
          <div className="mb-12">
            <p className="surface-accent text-eyebrow mb-3 tracking-widest uppercase">
              Global Presence
            </p>
            <SplitText
              text="A Global Perspective. A Local Understanding."
              className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl md:text-5xl"
            />
            <div className="mt-3">
              <ShinyText
                text="The corridors we actually operate in — not live shipment tracking."
                speed={4}
                className="font-sans text-sm text-stone-400 md:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-12 items-center gap-10 lg:gap-16">
            {/* Left: Globe and Route Visual */}
            <div className="col-span-12 lg:col-span-6">
              <div className="relative aspect-square w-full max-w-[500px] mx-auto overflow-hidden rounded-[28px] border border-[#3D322A] bg-[#171210]/90 p-4">
                <GlobeLoader />

                {/* SVG Route Lane overlay for active region */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
                  <svg
                    ref={routeSvgRef}
                    viewBox="0 0 360 360"
                    className="h-full w-full"
                    fill="none"
                  >
                    <path
                      ref={lanePathRef}
                      d={activeRegion.lanePath}
                      stroke="#A88B68"
                      strokeWidth="2.5"
                      strokeDasharray="6 4"
                      strokeLinecap="round"
                    />
                    <circle cx="40" cy="180" r="4" fill="#F4EFE6" />
                    <text x="40" y="200" fill="#A88B68" fontSize="10" fontFamily="monospace">
                      SURAT HQ
                    </text>
                  </svg>
                </div>

                <div className="absolute bottom-4 left-4 rounded-full border border-[#3D322A] bg-[#171210]/90 px-3 py-1 font-mono text-[11px] text-[#A88B68] backdrop-blur-md">
                  Corridor: Surat → {activeRegion.location}
                </div>
              </div>
            </div>

            {/* Right: Overview, Ports & Stats */}
            <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-[#F4EFE6] font-medium">
                  Direct Trade Corridors
                </h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-[#8C8279]">
                  Six primary overseas destinations serviced continuously from Western India ports. 
                  Every consignment is monitored from gate-in through customs discharge.
                </p>
              </div>

              {/* Port Chips with SplitFlapText */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs text-[#8C8279]">Loading Hubs:</span>
                {[
                  { code: 'INMUN', name: 'Mundra' },
                  { code: 'INIXY', name: 'Kandla' },
                  { code: 'INNSA', name: 'Nhava Sheva' },
                ].map((port) => (
                  <div
                    key={port.code}
                    className="flex items-center gap-2 rounded-lg border border-[#3D322A] bg-[#241C18]/80 px-3 py-1.5 font-mono text-xs text-[#F4EFE6]"
                  >
                    <span className="text-[#A88B68]">
                      <SplitFlapText text={port.code} fontSize="14px" flipDuration={0.35} />
                    </span>
                    <span className="text-[#8C8279]">({port.name})</span>
                  </div>
                ))}
              </div>

              {/* Stats Row: Regions 6 · Industries 9 · Ports 3 using Counter */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-[#3D322A] pt-6">
                <div className="flex gap-8">
                  <div>
                    <span className="font-mono text-xs text-[#8C8279] uppercase">Regions</span>
                    <div className="font-serif text-2xl text-[#A88B68]">
                      {statsVisible ? <Counter value={6} /> : 6}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#8C8279] uppercase">Industries</span>
                    <div className="font-serif text-2xl text-[#A88B68]">
                      {statsVisible ? <Counter value={9} /> : 9}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#8C8279] uppercase">Ports</span>
                    <div className="font-serif text-2xl text-[#A88B68]">
                      {statsVisible ? <Counter value={3} /> : 3}
                    </div>
                  </div>
                </div>

                <Link
                  href="/global-presence"
                  className="group inline-flex items-center gap-2 rounded-xl border border-[#A88B68]/40 bg-[#A88B68]/10 px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#A88B68] transition-all hover:bg-[#A88B68] hover:text-[#171210]"
                  data-cursor="target"
                >
                  <span>View Our Global Network</span>
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 6 Region Cards: 3x2 desktop grid / 1 col mobile */}
          <div className="mt-14 w-full">
            <ChromaGrid
              items={REGION_DATA}
              radius={300}
              damping={0.45}
              onItemHover={(idx) => setActiveRegionIndex(idx)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            />
          </div>

          <p className="mt-8 text-center font-mono text-xs text-[#8C8279]">
            Response window {numbers.responseWindow}
          </p>
        </Container>
      </Section>
    </div>
  );
}

