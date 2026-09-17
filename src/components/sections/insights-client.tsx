'use client';

import { BRAND } from '@/lib/tokens/colors';
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
import { HONEYPOT_FIELD } from '@/lib/forms/mailto';
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
  const [botField, setBotField] = useState('');
  const [mountTime] = useState<number>(() => Date.now());
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
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

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribeError('Enter a valid business email address.');
      return;
    }
    setSubscribeError('');
    setIsSubscribing(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, [HONEYPOT_FIELD]: botField, submittedAt: mountTime }),
      });

      if (res.ok) {
        setIsSubscribed(true);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setSubscribeError(data.error || 'Subscription failed. Please email us directly.');
      }
    } catch {
      setSubscribeError('Connection error. Please write to hello@trivoxagroup.com.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero */}
      <section className="bg-espresso-deep py-20 text-ivory border-b border-bronze/20">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-mono text-xs text-bronze">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-ivory/80">Insights</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-bronze mb-3">
            Editorial & Trade Intelligence
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory max-w-[56rem]">
            <SplitText
              text="What we are learning about these export corridors."
              tag="span"
              className="inline-block"
              delay={25}
            />
          </h1>

          <p className="mt-6 max-w-[48rem] text-base sm:text-lg text-ivory/80 leading-relaxed font-sans">
            We publish when we have something a buyer can act on — a price movement with the HS heading named, a credential with its registration number, a document set from a real consignment.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-bronze/20 pt-6">
            <div>
              <p className="font-mono text-xs text-bronze">Series Defined</p>
              <p className="font-serif text-2xl font-bold text-ivory">{INSIGHT_SERIES.length}</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">First Release</p>
              <p className="font-serif text-2xl font-bold text-ivory">2026-Q4</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Cadence</p>
              <p className="font-serif text-2xl font-bold text-ivory">Quarterly</p>
            </div>
            <div>
              <p className="font-mono text-xs text-bronze">Next Up</p>
              <p className="font-serif text-2xl font-bold text-ivory">HS Analytics</p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. DEPTHCAROUSEL for Featured Editorial Series (COMPULSORY) */}
      <section className="py-20 bg-espresso-deep overflow-hidden text-ivory">
        <Container>
          <div className="mb-8 text-center max-w-[42rem] mx-auto">
            <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-2">
              Featured Editorial Tracks
            </span>
            <h2 className="font-serif text-3xl font-bold text-ivory">
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
                  <div className="relative h-full w-full overflow-hidden rounded-[24px] border border-bronze/40 bg-espresso p-6 text-ivory flex flex-col justify-between shadow-2xl">
                    <div className="relative h-44 w-full overflow-hidden rounded-xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso to-transparent" />
                    </div>

                    <div className="mt-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-bronze">
                          <span>{item.series}</span>
                          <span>{item.date}</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-ivory mt-2">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs text-ivory/75 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-bronze/20 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-bronze">
                          Read Series Scope →
                        </span>
                        <ArrowUpRight className="size-4 text-bronze" />
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
                    ? 'bg-espresso text-ivory-soft font-semibold'
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
                      ? 'bg-espresso text-ivory-soft font-semibold'
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
                    <span className="font-mono text-xs text-bronze font-semibold">
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

                <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-bronze">
                  <span>Direct to subscribers</span>
                  <span>Quarterly →</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. #subscribe: Animated Newsletter Form (same as footer) */}
      <Section surface="dark" id="subscribe" className="py-20 bg-espresso-deep text-ivory border-t border-bronze/20 scroll-mt-24">
        <Container>
          <div className="max-w-[42rem] mx-auto text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-3">
              Quarterly Briefing
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
              Be told when the first trade report goes out.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-ivory/80 leading-relaxed font-sans">
              Subscribe to receive our direct briefings on market intelligence, tariff shifts, and export compliance from our desks in Surat.
            </p>

            <div className="mt-8 max-w-[28rem] mx-auto">
              {isSubscribed ? (
                <div className="rounded-xl border border-bronze/40 bg-espresso p-4 text-center font-mono text-xs text-bronze">
                  ✓ Subscribed to quarterly dispatch. First release arrives in 2026-Q4.
                </div>
              ) : (
                <ClickSpark sparkColor={BRAND.bronze.hex} sparkCount={8}>
                  <form onSubmit={(e) => void handleSubscribe(e)} className="flex flex-col gap-2" noValidate>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubscribing}
                        placeholder="Enter corporate email..."
                        className="flex-1 rounded-xl border border-stone-800 bg-espresso px-4 py-3 text-xs text-ivory placeholder-stone-500 outline-none transition-all duration-300 focus:border-bronze focus:ring-1 focus:ring-bronze disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={isSubscribing}
                        className="rounded-xl border border-bronze/40 bg-bronze px-5 py-3 font-mono text-xs font-semibold text-espresso-deep transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubscribing ? 'Subscribing…' : 'Subscribe →'}
                      </button>
                    </div>
                    <div className="absolute -left-[9999px] top-0" aria-hidden>
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={botField}
                        onChange={(e) => setBotField(e.target.value)}
                      />
                    </div>
                    {subscribeError ? (
                      <p role="alert" className="text-left text-xs text-red-400">
                        {subscribeError}
                      </p>
                    ) : null}
                  </form>
                </ClickSpark>
              )}
            </div>

            <p className="mt-4 text-[11px] font-mono text-ivory/50">
              No tracking pixels · Delivered to group-domain and corporate inboxes only.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
