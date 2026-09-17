'use client';

import React, { useEffect, useRef } from 'react';
import { Factory, ClipboardCheck, Stamp, Handshake } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import MagicBento, { ParticleCard } from '@/components/reactbits/MagicBento/MagicBento';
import ScrollFloat from '@/components/reactbits/ScrollFloat/ScrollFloat';
import OrbitImages from '@/components/reactbits/OrbitImages/OrbitImages';
import AnimatedList from '@/components/reactbits/AnimatedList/AnimatedList';
import CurvedLoop from '@/components/reactbits/CurvedLoop/CurvedLoop';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, svg } from '@/lib/motion/anime';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const QUALITY_CHECKS = [
  'GSM check',
  'Composition check',
  'Carton drop test',
  'Pre-shipment photos',
  'Report before sailing',
];

const FABRIC_IMAGES = [
  '/brand/og/product-cotton-denim-fabric.png',
  '/brand/og/product-cotton-yarn.png',
  '/brand/og/product-home-textiles.png',
  '/brand/og/product-technical-non-woven-textiles.png',
];

export function WhyTrivoxa() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsSvgRef = useRef<SVGSVGElement>(null);
  const checkmarksRef = useRef<(SVGSVGElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const cards = sectionRef.current.querySelectorAll('.bento-batch-item');
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cards, {
        start: 'top 85%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 32, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Anime.js step visual "Order 1 -> 2 -> 3 -> 5"
  useEffect(() => {
    if (reducedMotion || !stepsSvgRef.current) return;

    const path = stepsSvgRef.current.querySelector<SVGPathElement>('.step-path');
    const glowDot = stepsSvgRef.current.querySelector<SVGCircleElement>('.dot-glow');
    if (!path) return;

    const drawable = svg.createDrawable(path);
    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 1600,
      ease: 'inOutQuad',
      loop: true,
      direction: 'alternate',
    });

    if (glowDot) {
      animate(glowDot, {
        scale: [1, 1.4, 1],
        opacity: [0.8, 1, 0.8],
        duration: 1200,
        ease: 'easeInOutSine',
        loop: true,
      });
    }
  }, [reducedMotion]);

  // Anime.js checkmark stroke draw
  useEffect(() => {
    if (reducedMotion) return;
    checkmarksRef.current.forEach((svgEl, i) => {
      if (!svgEl) return;
      const path = svgEl.querySelector('path');
      if (!path) return;
      const drawable = svg.createDrawable(path);
      animate(drawable, {
        draw: ['0 0', '0 1'],
        duration: 600,
        delay: i * 180,
        ease: 'outQuart',
      });
    });
  }, [reducedMotion]);

  return (
    <Section surface="deep" className="overflow-hidden py-24">
      <div ref={sectionRef}>
        <Container>
        <div className="mb-12 text-center md:mb-16">
          <p className="surface-accent text-eyebrow mb-3 tracking-widest uppercase">
            Why Businesses Choose Trivoxa
          </p>
          <ScrollFloat
            animationDuration={1}
            stagger={0.03}
            containerClassName="justify-center"
            textClassName="font-serif text-heading-xl md:text-display-sm text-surface-paper"
          >
            Built on Experience. Focused on Partnership.
          </ScrollFloat>
        </div>

        <MagicBento
          enableStars
          enableSpotlight
          enableBorderGlow
          enableTilt={false}
          clickEffect
          glowColor="168, 139, 104"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Tile 1: Manufacturing Foundation (2x2 on desktop) */}
          <div className="bento-batch-item col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2">
            <ParticleCard
              glowColor="168, 139, 104"
              className="card--border-glow flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-stone-800/80 bg-stone-950/70 p-6 backdrop-blur-md md:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Factory className="size-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-700/60 bg-stone-900/80 px-3 py-1 font-mono text-xs text-stone-400">
                    Surat Mill Heritage
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-stone-100 md:text-3xl">
                  Manufacturing Foundation
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-300 md:text-base">
                  Our parent company Shiveshwar Textiles weaves export-grade cotton and polyester in
                  Surat. That floor-level knowledge sets every specification we quote.
                </p>
              </div>

              {/* Orbiting fabric thumbnails */}
              <div className="relative mt-8 flex h-52 w-full items-center justify-center overflow-hidden rounded-xl border border-stone-800/60 bg-stone-900/40 md:h-64">
                <OrbitImages
                  images={FABRIC_IMAGES}
                  radius={75}
                  duration={24}
                  itemSize={44}
                  centerContent={
                    <div className="flex flex-col items-center justify-center rounded-lg border border-accent/40 bg-stone-950/90 px-3 py-2 text-center shadow-lg">
                      <span className="font-serif text-xs font-medium text-accent">
                        Shiveshwar Textiles
                      </span>
                      <span className="font-mono text-[10px] text-stone-400">Est. Surat</span>
                    </div>
                  }
                />
              </div>
            </ParticleCard>
          </div>

          {/* Tile 2: Quality-Driven Operations (Tall tile on desktop) */}
          <div className="bento-batch-item col-span-1 md:col-span-1 lg:col-span-2 lg:row-span-2">
            <ParticleCard
              glowColor="168, 139, 104"
              className="card--border-glow flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-stone-800/80 bg-stone-950/70 p-6 backdrop-blur-md md:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <ClipboardCheck className="size-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-700/60 bg-stone-900/80 px-3 py-1 font-mono text-xs text-stone-400">
                    5-Stage Protocol
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-stone-100 md:text-3xl">
                  Quality-Driven Operations
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-300 md:text-base">
                  Each order carries a written inspection plan: GSM and composition checks, carton
                  drop tests, pre-shipment photos. You see the report before the vessel sails.
                </p>
              </div>

              <div className="mt-6 rounded-xl border border-stone-800/60 bg-stone-900/40 p-4">
                <AnimatedList
                  items={QUALITY_CHECKS}
                  itemClassName="flex items-center gap-3 py-1.5 font-mono text-xs text-stone-300"
                  displayScrollbar={false}
                />
              </div>
            </ParticleCard>
          </div>

          {/* Tile 3: Global Trade Expertise (Wide tile) */}
          <div className="bento-batch-item col-span-1 md:col-span-2 lg:col-span-2">
            <ParticleCard
              glowColor="168, 139, 104"
              className="card--border-glow flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-stone-800/80 bg-stone-950/70 p-6 backdrop-blur-md md:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Stamp className="size-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-700/60 bg-stone-900/80 px-3 py-1 font-mono text-xs text-stone-400">
                    Documentation
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-stone-100 md:text-2xl">
                  Global Trade Expertise
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  We prepare the paperwork buyers actually get asked for: COO, phytosanitary,
                  material test certificates. Incoterms and lead times are quoted per line, not per
                  brochure.
                </p>
              </div>

              <div className="relative mt-4 h-24 overflow-hidden rounded-xl border border-stone-800/50 bg-stone-900/30">
                <CurvedLoop
                  marqueeText="COO · Phytosanitary · Material Test Certificates · Incoterms per line ·"
                  speed={1.5}
                  curveAmount={40}
                  className="font-mono text-xs uppercase tracking-widest text-accent/80"
                />
              </div>
            </ParticleCard>
          </div>

          {/* Tile 4: Long-Term Partnerships (Standard tile) */}
          <div className="bento-batch-item col-span-1 md:col-span-2 lg:col-span-2">
            <ParticleCard
              glowColor="168, 139, 104"
              className="card--border-glow flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-stone-800/80 bg-stone-950/70 p-6 backdrop-blur-md md:p-8"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                    <Handshake className="size-5 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="rounded-full border border-stone-700/60 bg-stone-900/80 px-3 py-1 font-mono text-xs text-stone-400">
                    Repeat Volume
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-stone-100 md:text-2xl">
                  Long-Term Partnerships
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">
                  Most of our capacity is reserved by buyers on their second and third programme. We
                  price for the fifth order, not the first.
                </p>
              </div>

              {/* Step visual "Order 1 -> 2 -> 3 -> 4 -> 5" */}
              <div className="mt-4 flex flex-col justify-center rounded-xl border border-[#3D322A]/50 bg-[#171210]/60 p-4">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-[#8C8279]">
                  <span>Order 1</span>
                  <span>Order 2</span>
                  <span>Order 3</span>
                  <span>Order 4</span>
                  <span className="font-semibold text-[#A88B68]">Order 5 (Partner)</span>
                </div>
                <svg
                  ref={stepsSvgRef}
                  viewBox="0 0 320 32"
                  className="h-8 w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="16"
                    y1="16"
                    x2="304"
                    y2="16"
                    stroke="#3D322A"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <path
                    className="step-path"
                    d="M 16 16 L 304 16"
                    stroke="#A88B68"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="5" fill="#171210" stroke="#A88B68" strokeWidth="2" />
                  <circle cx="88" cy="16" r="5" fill="#171210" stroke="#A88B68" strokeWidth="2" />
                  <circle cx="160" cy="16" r="5" fill="#171210" stroke="#A88B68" strokeWidth="2" />
                  <circle cx="232" cy="16" r="5" fill="#171210" stroke="#A88B68" strokeWidth="2" />
                  <circle
                    className="dot-glow"
                    cx="304"
                    cy="16"
                    r="7"
                    fill="#A88B68"
                    filter="drop-shadow(0 0 6px rgba(168,139,104,0.8))"
                  />
                </svg>
              </div>
            </ParticleCard>
          </div>
        </MagicBento>
      </Container>
      </div>
    </Section>
  );
}

