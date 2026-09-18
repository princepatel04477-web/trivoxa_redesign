'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import ChromaGrid from '@/components/reactbits/ChromaGrid/ChromaGrid';
import { CountUp } from '@/components/motion/count-up';
import { GlobeLoader } from '@/components/three/globe-loader';
import { presenceNumbers } from '@/lib/selectors';

const REGION_DATA = [
  {
    title: 'Europe',
    subtitle: 'Textiles and precision components into Rotterdam & Hamburg',
    location: 'Rotterdam (NL RTM)',
    handle: 'Hub Port',
    image: '/brand/og/industry-textile-apparel.png',
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(168,139,104,0.15), rgba(23,18,16,0.95))',
  },
  {
    title: 'Middle East',
    subtitle: 'Spices, building materials, and denim fabrics',
    location: 'Jebel Ali (AE JEA)',
    handle: 'Hub Port',
    image: '/brand/og/industry-building-materials.png',
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(196,164,124,0.15), rgba(23,18,16,0.95))',
  },
  {
    title: 'Africa',
    subtitle: 'Pharmaceutical formulations and agricultural staples',
    location: 'Mombasa (KE MBA)',
    handle: 'Hub Port',
    image: '/brand/og/industry-healthcare-pharmaceuticals.png',
    borderColor: BRAND.bronzeInk.hex,
    gradient: 'linear-gradient(145deg, rgba(140,115,85,0.15), rgba(23,18,16,0.95))',
  },
  {
    title: 'North America',
    subtitle: 'Commercial textiles, quartz slabs, and engineered fittings',
    location: 'New York (US NYC)',
    handle: 'Hub Port',
    image: '/brand/og/product-engineered-quartz.png',
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(168,139,104,0.15), rgba(23,18,16,0.95))',
  },
  {
    title: 'South America',
    subtitle: 'Industrial fasteners, machine parts, and chemical intermediates',
    location: 'Santos (BR SSZ)',
    handle: 'Hub Port',
    image: '/brand/og/industry-engineering-industrial.png',
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(175,145,110,0.15), rgba(23,18,16,0.95))',
  },
  {
    title: 'Asia-Pacific',
    subtitle: 'Yarn, agro-commodities, and digital services',
    location: 'Singapore (SG SIN)',
    handle: 'Hub Port',
    image: '/brand/og/product-cotton-yarn.png',
    borderColor: BRAND.bronze.hex,
    gradient: 'linear-gradient(145deg, rgba(196,164,124,0.15), rgba(23,18,16,0.95))',
  },
];

export function GlobalPresencePreview() {
  const numbers = presenceNumbers();
  const [, setActiveRegionIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={sectionRef} data-surface="deep" className="relative overflow-hidden bg-stone-950 text-stone-100">
      {/* Background: Static Topography SVG (0 WebGL budget consumed) */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topo" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M 0 50 Q 50 20 100 50 T 200 50 M 0 100 Q 50 70 100 100 T 200 100 M 0 150 Q 50 120 100 150 T 200 150"
                fill="none"
                stroke={BRAND.bronze.hex}
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

          <div className="grid grid-cols-12 items-stretch gap-8 lg:gap-12">
            {/* Left: Command-Center 3D Interactive Globe Card */}
            <div className="col-span-12 lg:col-span-6 flex flex-col">
              <div className="relative aspect-square w-full max-w-[520px] mx-auto overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-950/90 p-5 shadow-2xl flex flex-col justify-between">
                {/* Globe Canvas */}
                <div className="absolute inset-0">
                  <GlobeLoader />
                </div>

                {/* Top Badge: Live Network Status */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 rounded-full border border-stone-800/90 bg-stone-900/80 px-3 py-1 font-mono text-[11px] text-stone-300 backdrop-blur-md">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Global Trade Network</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500 uppercase tracking-wider hidden sm:inline">
                    Interactive 3D Sphere
                  </span>
                </div>

                {/* Bottom Route Summary Bar */}
                <div className="relative z-10 rounded-2xl border border-stone-800/90 bg-stone-900/90 px-4 py-2.5 backdrop-blur-md">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-bronze" />
                      <span className="text-bronze font-semibold">Surat Global HQ</span>
                    </div>
                    <span className="text-stone-400">Gateways: Mundra & JNPT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Overview, Ports & Stats */}
            <div className="col-span-12 lg:col-span-6 flex flex-col justify-between gap-6">
              <div>
                <p className="font-mono text-xs font-semibold tracking-widest text-bronze uppercase mb-2">
                  Maritime Trade Architecture
                </p>
                <h3 className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium leading-tight">
                  Direct Corridors ex Western India
                </h3>
                <p className="mt-3 text-sm md:text-base leading-relaxed text-stone-400">
                  Six primary overseas destinations serviced continuously from Western India ports. 
                  Every consignment is monitored from factory gate-in through customs discharge with full compliance documentation.
                </p>
              </div>

              {/* Designated Outbound Loading Hubs */}
              <div className="space-y-2.5">
                <span className="font-mono text-xs text-stone-400 uppercase tracking-wider block">
                  Designated Outbound Loading Hubs
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { code: 'INMUN', name: 'Mundra Port', state: 'Gujarat' },
                    { code: 'INIXY', name: 'Kandla Port', state: 'Gujarat' },
                    { code: 'INNSA', name: 'Nhava Sheva', state: 'JNPT Mumbai' },
                  ].map((port) => (
                    <div
                      key={port.code}
                      className="group rounded-xl border border-stone-800/80 bg-stone-900/60 p-3.5 transition-colors hover:border-bronze/50 hover:bg-stone-900/90"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-bronze tracking-wider">
                          {port.code}
                        </span>
                        <span className="size-1.5 rounded-full bg-bronze/50 group-hover:bg-bronze transition-colors" />
                      </div>
                      <p className="mt-2 font-serif text-sm font-medium text-stone-200">
                        {port.name}
                      </p>
                      <p className="font-mono text-[11px] text-stone-500 mt-0.5">
                        {port.state}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats and Action Card */}
              <div className="rounded-2xl border border-stone-800/80 bg-stone-900/40 p-5 sm:p-6">
                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-stone-800/80">
                  <div className="px-2">
                    <div className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
                      <CountUp value={numbers.regions} />
                    </div>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-stone-400">
                      Global Regions
                    </span>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
                      <CountUp value={numbers.industries} />
                    </div>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-stone-400">
                      Core Sectors
                    </span>
                  </div>
                  <div className="px-2">
                    <div className="font-serif text-3xl sm:text-4xl text-stone-100 font-medium">
                      <CountUp value={numbers.ports} />
                    </div>
                    <span className="mt-1 block font-mono text-[11px] uppercase tracking-wider text-stone-400">
                      Export Hubs
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="font-mono text-xs text-stone-400">
                    SLA Inbound Response: <span className="text-bronze font-semibold">{numbers.responseWindow}</span>
                  </span>
                  <Link
                    href="/global-presence"
                    className="group inline-flex items-center gap-2 rounded-xl border border-bronze/40 bg-bronze/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-bronze transition-all hover:bg-bronze hover:text-stone-950"
                    data-cursor="target"
                  >
                    <span>View Global Network</span>
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
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

          <p className="mt-8 text-center font-mono text-xs surface-faint">
            Response window {numbers.responseWindow}
          </p>
        </Container>
      </Section>
    </div>
  );
}
