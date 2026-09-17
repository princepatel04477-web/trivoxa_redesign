'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import BlurText from '@/components/reactbits/BlurText/BlurText';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import FlowingMenu from '@/components/reactbits/FlowingMenu/FlowingMenu';
import TiltedCard from '@/components/reactbits/TiltedCard/TiltedCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const PRODUCT_ITEMS = [
  {
    text: 'Textile & Apparel',
    link: '/businesses/product-exports?category=cotton-denim-fabric',
    image: '/brand/og/industry-textile-apparel.png',
  },
  {
    text: 'Healthcare & Pharma',
    link: '/businesses/product-exports?category=active-pharmaceutical-ingredients',
    image: '/brand/og/industry-healthcare-pharmaceuticals.png',
  },
  {
    text: 'Building Materials',
    link: '/businesses/product-exports?category=vitrified-ceramic-tiles',
    image: '/brand/og/industry-building-materials.png',
  },
  {
    text: 'Agriculture & Food',
    link: '/businesses/product-exports?category=cumin-whole-spices',
    image: '/brand/og/industry-agriculture-food.png',
  },
  {
    text: 'Engineering & Industrial',
    link: '/businesses/product-exports?category=industrial-fasteners',
    image: '/brand/og/industry-engineering-industrial.png',
  },
];

const SERVICE_ITEMS = [
  {
    text: 'Technology Solutions',
    link: 'https://digital.trivoxagroup.com',
    image: '/brand/og/industry-technology.png',
  },
  {
    text: 'AI Solutions',
    link: 'https://digital.trivoxagroup.com',
    image: '/brand/og/industry-technology.png',
  },
  {
    text: 'Branding & Design',
    link: 'https://digital.trivoxagroup.com',
    image: '/brand/og/industry-technology.png',
  },
  {
    text: 'Digital Marketing',
    link: 'https://digital.trivoxagroup.com',
    image: '/brand/og/industry-technology.png',
  },
  {
    text: 'Business Support',
    link: 'https://digital.trivoxagroup.com',
    image: '/brand/og/industry-technology.png',
  },
];

export function BusinessesPreview() {
  const [hoveredPanel, setHoveredPanel] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const connectorPathRef = useRef<SVGPathElement>(null);
  const reducedMotion = useReducedMotion();

  // GSAP DrawSVG connector line on scroll scrub
  useEffect(() => {
    if (reducedMotion || !containerRef.current || !connectorPathRef.current) return;

    const path = connectorPathRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 80%',
      end: 'bottom 60%',
      scrub: 1,
      onUpdate: (self) => {
        path.style.strokeDashoffset = `${length * (1 - self.progress)}`;
      },
    });

    return () => st.kill();
  }, [reducedMotion]);

  return (
    <Section surface="deep" className="relative overflow-hidden py-24">
      <Container>
        <div className="mb-12 text-center md:mb-16">
          <p className="surface-accent text-eyebrow mb-3 tracking-widest uppercase">
            Our Businesses
          </p>
          <div className="flex justify-center">
            <SplitText
              text="Two operating arms. One commitment."
              className="font-serif text-3xl font-medium text-stone-100 sm:text-4xl md:text-5xl"
            />
          </div>
          <div className="mt-3 flex justify-center text-sm text-stone-400 md:text-base">
            <BlurText
              text="Products quoted against real specifications; services delivered by a dedicated technology property."
              delay={30}
              animateBy="words"
              direction="top"
              className="max-w-2xl text-center"
            />
          </div>
        </div>

        {/* Center Connector SVG Ribbon */}
        <div className="relative mb-6 hidden justify-center md:flex">
          <div className="relative flex items-center gap-3 rounded-full border border-stone-800 bg-stone-900/80 px-4 py-1 font-mono text-xs text-accent">
            <span>Product Infrastructure</span>
            <svg width="40" height="12" viewBox="0 0 40 12" className="overflow-visible">
              <path
                ref={connectorPathRef}
                d="M 0 6 L 40 6"
                stroke="#A88B68"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Service Ecosystem</span>
          </div>
        </div>

        {/* Two Division Panels with GSAP 60/40 Width Shift */}
        <div
          ref={containerRef}
          className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8"
        >
          {/* Panel 1: Global Product Exports */}
          <div
            onMouseEnter={() => !reducedMotion && setHoveredPanel('left')}
            onMouseLeave={() => !reducedMotion && setHoveredPanel(null)}
            className={`transition-[flex] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hoveredPanel === 'left'
                ? 'lg:flex-[6]'
                : hoveredPanel === 'right'
                  ? 'lg:flex-[4]'
                  : 'lg:flex-[5]'
            }`}
          >
            <TiltedCard
              imageSrc="/brand/og/industry-textile-apparel.png"
              altText="Global Product Exports"
              rotateAmplitude={8}
              scaleOnHover={1.02}
              containerHeight="100%"
              imageHeight="100%"
              displayOverlayContent
              overlayContent={
                <div className="flex h-full flex-col justify-between rounded-[24px] border border-stone-800/80 bg-stone-950/90 p-6 md:p-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between font-mono text-xs text-stone-400">
                      <span>01 / 02</span>
                      <span className="rounded-full border border-stone-800 bg-stone-900/80 px-2.5 py-1 text-accent">
                        Physical Cargo
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-stone-100 md:text-3xl">
                      Global Product Exports
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-stone-300 md:text-sm">
                      Direct mill & factory export contracts across textiles, pharma, building
                      materials, spices, and industrial hardware.
                    </p>
                  </div>

                  {/* Flowing Menu for 5 product industries */}
                  <div className="my-6 min-h-[200px] overflow-hidden rounded-xl border border-stone-800/80 bg-stone-900/50">
                    <FlowingMenu
                      items={PRODUCT_ITEMS}
                      speed={18}
                      textColor="#F4EFE6"
                      bgColor="#1c1917"
                      marqueeBgColor="#A88B68"
                      marqueeTextColor="#171210"
                      borderColor="#292524"
                    />
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/businesses/product-exports"
                      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-stone-100"
                    >
                      <span>Explore Global Product Exports</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              }
            />
          </div>

          {/* Panel 2: Global Service Exports */}
          <div
            onMouseEnter={() => !reducedMotion && setHoveredPanel('right')}
            onMouseLeave={() => !reducedMotion && setHoveredPanel(null)}
            className={`transition-[flex] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hoveredPanel === 'right'
                ? 'lg:flex-[6]'
                : hoveredPanel === 'left'
                  ? 'lg:flex-[4]'
                  : 'lg:flex-[5]'
            }`}
          >
            <TiltedCard
              imageSrc="/brand/og/industry-technology.png"
              altText="Global Service Exports"
              rotateAmplitude={8}
              scaleOnHover={1.02}
              containerHeight="100%"
              imageHeight="100%"
              displayOverlayContent
              overlayContent={
                <div className="flex h-full flex-col justify-between rounded-[24px] border border-stone-800/80 bg-stone-950/90 p-6 md:p-8">
                  <div>
                    <div className="mb-4 flex items-center justify-between font-mono text-xs text-stone-400">
                      <span>02 / 02</span>
                      <a
                        href="https://digital.trivoxagroup.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-accent hover:border-accent"
                      >
                        <DecryptedText
                          text="digital.trivoxagroup.com"
                          speed={40}
                          className="font-mono text-xs"
                        />
                        <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>

                    <h3 className="font-serif text-2xl text-stone-100 md:text-3xl">
                      Global Service Exports
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-stone-300 md:text-sm">
                      Technology engineering, custom AI architectures, brand identity systems, and
                      offshore business process operations.
                    </p>
                  </div>

                  {/* Flowing Menu for 5 services */}
                  <div className="my-6 min-h-[200px] overflow-hidden rounded-xl border border-stone-800/80 bg-stone-900/50">
                    <FlowingMenu
                      items={SERVICE_ITEMS}
                      speed={18}
                      textColor="#F4EFE6"
                      bgColor="#1c1917"
                      marqueeBgColor="#A88B68"
                      marqueeTextColor="#171210"
                      borderColor="#292524"
                    />
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/businesses/service-exports"
                      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-stone-100"
                    >
                      <span>Explore Global Service Exports</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}

