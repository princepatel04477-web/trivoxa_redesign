'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import DepthCarousel from '@/components/reactbits/DepthCarousel/DepthCarousel';
import AnimatedList from '@/components/reactbits/AnimatedList/AnimatedList';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import { INSIGHT_SERIES, type InsightSeries } from '@/content/editorial';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

const FEATURED_BRIEFS = [
  {
    title: 'Market Intelligence',
    series: 'Quarterly Category Report',
    date: 'Horizon 2026-Q4',
    image: '/brand/og/industry-agriculture-food.png',
    summary: 'Quarterly price movement on the lines we ship, with the HS headings named and freight rate direction on Mundra & Nhava Sheva lanes.',
    cadence: 'Quarterly, per category',
  },
  {
    title: 'Compliance & Documentation',
    series: 'Regulatory Briefing',
    date: 'Continuous Updates',
    image: '/brand/og/compliance.png',
    summary: 'Destination-market labelling changes, registration certificates, and worked examples of document sets for real consignments.',
    cadence: 'When something changes',
  },
  {
    title: 'Sourcing & Supply Chains',
    series: 'Operational Deep Dive',
    date: 'Monthly Release',
    image: '/brand/og/industry-engineering-industrial.png',
    summary: 'How an export category is onboarded from Surat mills, pre-shipment inspection protocols, and supplier validation criteria.',
    cadence: 'Monthly while onboarding',
  },
];

export function InsightsClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleFilter = (catSlug: string) => {
    if (catSlug === activeCategory) return;
    if (!reducedMotion && listContainerRef.current) {
      const state = Flip.getState(listContainerRef.current.querySelectorAll('.series-card'));
      setActiveCategory(catSlug);
      requestAnimationFrame(() => {
        Flip.from(state, {
          duration: 0.4,
          ease: 'power2.out',
          absolute: false,
        });
      });
    } else {
      setActiveCategory(catSlug);
    }
  };

  const filteredSeries = INSIGHT_SERIES.filter((s) =>
    activeCategory === 'all' ? true : s.slug === activeCategory
  );

  const carouselItems = FEATURED_BRIEFS.map((b) => ({
    image: b.image,
    alt: b.title,
    title: b.title,
    series: b.series,
    description: b.summary,
    date: b.date,
  }));

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
  };

  return (
    <div className="w-full">
      {/* 1. Hero */}
      <section className="bg-[#171210] py-20 text-[#F4EFE6] border-b border-[#A88B68]/20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-mono text-xs text-[#A88B68]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#F4EFE6]/80">Insights</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#A88B68] mb-3">
            Editorial & Trade Intelligence
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4EFE6] max-w-4xl">
            <SplitText
              text="What we are learning about these export corridors."
              tag="span"
              className="inline-block"
              delay={25}
            />
          </h1>

          <p className="mt-6 max-w-3xl text-base sm:text-lg text-[#F4EFE6]/80 leading-relaxed font-sans">
            We publish when we have something a buyer can act on — a price movement with the HS heading named, a credential with its registration number, a document set from a real consignment.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#A88B68]/20 pt-6">
            <div>
              <p className="font-mono text-xs text-[#A88B68]">Series Defined</p>
              <p className="font-serif text-2xl font-bold text-[#F4EFE6]">{INSIGHT_SERIES.length}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#A88B68]">First Release</p>
              <p className="font-serif text-2xl font-bold text-[#F4EFE6]">2026-Q4</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#A88B68]">Cadence</p>
              <p className="font-serif text-2xl font-bold text-[#F4EFE6]">Quarterly</p>
            </div>
            <div>
              <p className="font-mono text-xs text-[#A88B68]">Next Up</p>
              <p className="font-serif text-2xl font-bold text-[#F4EFE6]">HS Analytics</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. DEPTHCAROUSEL for Featured Editorial Series (COMPULSORY) */}
      <section className="py-20 bg-[#171210] overflow-hidden text-[#F4EFE6]">
        <Container>
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A88B68] block mb-2">
              Featured Editorial Tracks
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#F4EFE6]">
              Intelligence Built on Real Freight Data
            </h2>
          </div>

          <div className="relative h-[480px] w-full">
            <DepthCarousel
              items={carouselItems}
              cardWidth={380}
              cardHeight={420}
              depth={220}
              spread={110}
              blur={reducedMotion ? 0 : 4}
              autoplay={!reducedMotion}
              autoplayDelay={5000}
              loop
              renderItem={(rawItem) => {
                const item = rawItem as (typeof carouselItems)[0];
                return (
                  <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-[#A88B68]/40 bg-[#241C18] p-6 text-[#F4EFE6] flex flex-col justify-between shadow-2xl">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#241C18] to-transparent" />
                    </div>

                    <div className="mt-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#A88B68]">
                          <span>{item.series}</span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-[#F4EFE6] mt-2">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-[#F4EFE6]/75 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#A88B68]/20 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#A88B68]">
                          Read Series Scope →
                        </span>
                        <ArrowUpRight className="size-4 text-[#A88B68]" />
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </Container>
      </section>

      {/* 3. Article & Series List Below with GSAP Flip & AnimatedList */}
      <Section surface="light" className="py-20">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Editorial Commitments
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Three structured research series with explicit deliverables and published cadences.
              </p>
            </div>

            {/* GSAP Flip Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-full border border-stone-200" role="tablist">
              <button
                type="button"
                onClick={() => handleFilter('all')}
                className={`px-3.5 py-1 rounded-full font-mono text-xs transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-[#241C18] text-[#FAF8F3] font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Series ({INSIGHT_SERIES.length})
              </button>
              {INSIGHT_SERIES.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => handleFilter(s.slug)}
                  className={`px-3.5 py-1 rounded-full font-mono text-xs transition-colors ${
                    activeCategory === s.slug
                      ? 'bg-[#241C18] text-[#FAF8F3] font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div ref={listContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredSeries.map((series: InsightSeries) => (
              <div
                key={series.slug}
                className="series-card flex flex-col justify-between p-6 rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <span className="font-mono text-xs text-[#A88B68] font-semibold">
                      {series.cadence}
                    </span>
                    <span className="font-mono text-[10px] uppercase text-stone-400">
                      Editorial Track
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-stone-900 mb-3">
                    {series.name}
                  </h3>

                  <div className="mt-4">
                    <p className="font-mono text-xs uppercase tracking-wider text-stone-500 mb-2">
                      Will publish:
                    </p>
                    <AnimatedList
                      items={series.willPublish}
                      className="flex flex-col gap-2"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-[#A88B68]">
                  <span>Direct to subscribers</span>
                  <span>Quarterly →</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. #subscribe: Animated Newsletter Form (same as footer) */}
      <Section surface="dark" id="subscribe" className="py-20 bg-[#171210] text-[#F4EFE6] border-t border-[#A88B68]/20 scroll-mt-24">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A88B68] block mb-3">
              Quarterly Briefing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4EFE6]">
              Be told when the first trade report goes out.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#F4EFE6]/80 leading-relaxed font-sans">
              Subscribe to receive our direct briefings on market intelligence, tariff shifts, and export compliance from our desks in Surat.
            </p>

            <div className="mt-8 max-w-md mx-auto">
              {isSubscribed ? (
                <div className="rounded-xl border border-[#A88B68]/40 bg-[#241C18] p-4 text-center font-mono text-xs text-[#A88B68]">
                  ✓ Subscribed to quarterly dispatch. First release arrives in 2026-Q4.
                </div>
              ) : (
                <ClickSpark sparkColor="#A88B68" sparkCount={8}>
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter corporate email..."
                      className="flex-1 rounded-xl border border-stone-800 bg-[#241C18] px-4 py-3 text-xs text-[#F4EFE6] placeholder-stone-500 outline-none transition-all duration-300 focus:border-[#A88B68] focus:ring-1 focus:ring-[#A88B68]"
                    />
                    <button
                      type="submit"
                      className="rounded-xl border border-[#A88B68]/40 bg-[#A88B68] px-5 py-3 font-mono text-xs font-semibold text-[#171210] transition-colors hover:bg-[#C4A47C]"
                    >
                      Subscribe →
                    </button>
                  </form>
                </ClickSpark>
              )}
            </div>

            <p className="mt-4 text-[11px] font-mono text-[#F4EFE6]/50">
              No tracking pixels · Delivered to group-domain and corporate inboxes only.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
