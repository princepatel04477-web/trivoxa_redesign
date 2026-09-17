'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/layout';
import { CATEGORIES, CONTACT, INDUSTRIES } from '@/content/taxonomy';
import { footerRegions } from '@/lib/selectors';
import { HONEYPOT_FIELD } from '@/lib/forms/mailto';
import { BRAND } from '@/lib/tokens/colors';
import TextPressure from '@/components/reactbits/TextPressure/TextPressure';
import ShinyText from '@/components/reactbits/ShinyText/ShinyText';
import DotField from '@/components/reactbits/DotField/DotField';
import Noise from '@/components/reactbits/Noise/Noise';
import FadeContent from '@/components/reactbits/FadeContent/FadeContent';
import ClickSpark from '@/components/reactbits/ClickSpark/ClickSpark';
import { animate, svg } from '@/lib/motion/anime';
import { useReducedMotion } from '@/lib/motion/useReducedMotion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SiteFooter() {
  const regions = footerRegions();
  const reducedMotion = useReducedMotion();
  const columnsRef = useRef<HTMLDivElement>(null);
  const checkmarkSvgRef = useRef<SVGSVGElement>(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [botField, setBotField] = useState('');
  const [mountTime] = useState<number>(() => Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  const playCheckmark = () => {
    if (reducedMotion || !checkmarkSvgRef.current) return;
    const path = checkmarkSvgRef.current.querySelector('path');
    if (!path) return;
    const drawable = svg.createDrawable(path);
    animate(drawable, {
      draw: ['0 0', '0 1'],
      duration: 500,
      ease: 'outQuart',
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setNewsletterError('Enter a valid business email address.');
      return;
    }
    setNewsletterError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, [HONEYPOT_FIELD]: botField, submittedAt: mountTime }),
      });

      if (res.ok) {
        setSubmitted(true);
        playCheckmark();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setNewsletterError(data.error || 'Subscription failed. Please email us directly.');
      }
    } catch {
      setNewsletterError('Connection error. Please write to hello@trivoxagroup.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Batch entrance for footer columns
  useEffect(() => {
    if (reducedMotion || !columnsRef.current) return;

    const cols = columnsRef.current.querySelectorAll('.footer-col');
    if (cols.length === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cols, {
        start: 'top 90%',
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power2.out',
              overwrite: 'auto',
            }
          );
        },
      });
    }, columnsRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      aria-label="Global footer"
      className="relative overflow-hidden border-t border-stone-800 bg-stone-950 text-stone-100"
    >
      {/* Background: DotField + Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <DotField
          dotRadius={1}
          dotSpacing={18}
          gradientFrom="rgba(168, 139, 104, 0.3)"
          gradientTo="rgba(196, 164, 124, 0.15)"
        />
        <Noise patternAlpha={10} />
      </div>

      {/* HUGE TRIVOXA WORDMARK */}
      <div className="relative z-10 border-b border-stone-800/80 pt-12 pb-6">
        <Container>
          <div className="mt-6 hidden h-32 w-full md:block">
            <TextPressure
              text="TRIVOXA"
              fontFamily="Instrument Serif"
              minFontSize={64}
              width
              weight
              italic={false}
              textColor="var(--color-ivory)"
              strokeColor="var(--color-bronze)"
              strokeWidth={1}
            />
          </div>
          <div className="mt-6 block py-4 text-center md:hidden">
            <span className="text-ivory font-serif text-5xl font-bold tracking-wider">TRIVOXA</span>
          </div>
        </Container>
      </div>

      <Container className="relative z-10 py-16">
        <div ref={columnsRef} className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
          {/* Contact Block */}
          <div className="footer-col col-span-12 flex flex-col gap-6 lg:col-span-4">
            <FadeContent blur duration={800}>
              <p className="max-w-[40ch] text-xs leading-relaxed text-stone-400">
                International trade and business group coordinating from Surat, Gujarat, India.
              </p>

              <dl className="mt-6 flex flex-col gap-4 text-xs">
                <div>
                  <dt className="surface-accent text-eyebrow mb-1 font-mono uppercase tracking-widest text-stone-500">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${CONTACT.general}`}
                      className="font-mono text-stone-300 transition-colors hover:text-accent"
                    >
                      {CONTACT.general}
                    </a>
                  </dd>
                </div>

                <div>
                  <dt className="surface-accent text-eyebrow mb-1 font-mono uppercase tracking-widest text-stone-500">
                    Callback
                  </dt>
                  <dd className="text-stone-400">
                    <Link
                      href="/contact#callback"
                      className="text-stone-300 underline decoration-stone-700 hover:text-accent"
                    >
                      Direct line on request — ask for a callback
                    </Link>
                  </dd>
                </div>

                <div>
                  <dt className="surface-accent text-eyebrow mb-1 font-mono uppercase tracking-widest text-stone-500">
                    Hours
                  </dt>
                  <dd className="text-stone-400">
                    {CONTACT.hoursIst} · {CONTACT.timezoneLabel}
                  </dd>
                </div>

                <div>
                  <dt className="surface-accent text-eyebrow mb-1 font-mono uppercase tracking-widest text-stone-500">
                    Registered office
                  </dt>
                  <dd className="text-stone-400">{CONTACT.registeredOffice}</dd>
                </div>

                <div>
                  <dt className="surface-accent text-eyebrow mb-1 font-mono uppercase tracking-widest text-stone-500">
                    Registered entity
                  </dt>
                  <dd className="text-stone-400">
                    <Link
                      href="/compliance#entity"
                      className="text-stone-300 underline decoration-stone-700 hover:text-accent"
                    >
                      Number in supplier-onboarding pack — see Compliance
                    </Link>
                  </dd>
                </div>
              </dl>
            </FadeContent>
          </div>

          {/* What We Export */}
          <nav
            aria-label="What we export"
            className="footer-col col-span-6 flex flex-col gap-2 lg:col-span-3"
          >
            <p className="surface-accent text-eyebrow mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              What We Export
            </p>
            {INDUSTRIES.slice(0, 6).map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-300 transition-colors hover:text-accent"
              >
                <span>{ind.name}</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
            <Link
              href="/industries"
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs font-medium text-accent hover:underline"
            >
              All {INDUSTRIES.length} industries →
            </Link>

            <p className="surface-accent text-eyebrow mt-6 mb-2 font-mono text-xs uppercase tracking-widest text-accent">
              Categories
            </p>
            {CATEGORIES.filter((cat) => cat.status === 'live')
              .slice(0, 5)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/businesses/product-exports?category=${cat.slug}`}
                  className="group flex items-center gap-1.5 py-1 text-xs text-stone-300 transition-colors hover:text-accent"
                >
                  <span>{cat.name}</span>
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
          </nav>

          {/* Company & Resources */}
          <nav
            aria-label="Company and Resources"
            className="footer-col col-span-6 flex flex-col gap-2 lg:col-span-2"
          >
            <p className="surface-accent text-eyebrow mb-3 font-mono text-xs uppercase tracking-widest text-accent">
              Company
            </p>
            {[
              { href: '/group', label: 'The Group' },
              { href: '/group#leadership', label: 'Leadership' },
              { href: '/group#foundation', label: 'Shiveshwar Foundation' },
              { href: '/global-presence', label: 'Global Presence' },
              { href: '/insights', label: 'Insights' },
              { href: '/careers', label: 'Careers' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-300 transition-colors hover:text-accent"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}

            <p className="surface-accent text-eyebrow mt-6 mb-2 font-mono text-xs uppercase tracking-widest text-accent">
              Resources
            </p>
            {[
              { href: '/compliance', label: 'Compliance' },
              { href: '/rfq', label: 'Request a Quote' },
              { href: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-300 transition-colors hover:text-accent"
              >
                <span>{item.label}</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          {/* Legal + Animated Newsletter */}
          <div className="footer-col col-span-12 flex flex-col gap-6 lg:col-span-3">
            <nav aria-label="Legal" className="flex flex-col gap-2">
              <p className="surface-accent text-eyebrow mb-3 font-mono text-xs uppercase tracking-widest text-accent">
                Legal
              </p>
              <Link
                href="/legal/privacy"
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-400 transition-colors hover:text-accent"
              >
                <span>Privacy Policy</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="/legal/terms"
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-400 transition-colors hover:text-accent"
              >
                <span>Terms & Conditions</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="/legal/cookies"
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-400 transition-colors hover:text-accent"
              >
                <span>Cookie Policy</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
              <Link
                href="/legal/anti-corruption"
                className="group flex items-center gap-1.5 py-1 text-xs text-stone-400 transition-colors hover:text-accent"
              >
                <span>Anti-corruption Policy</span>
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </nav>

            {/* Newsletter Form */}
            <div className="mt-4 border-t border-stone-800 pt-6">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Newsletter</p>
              <p className="mt-1 text-xs text-stone-400">
                Quarterly dispatch on global trade and business insights.
              </p>

              {submitted ? (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent">
                  <svg
                    ref={checkmarkSvgRef}
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M 20 6 L 9 17 L 4 12" />
                  </svg>
                  <span>Subscribed to quarterly dispatch.</span>
                </div>
              ) : (
                <ClickSpark sparkColor={BRAND.bronze.hex} sparkCount={8}>
                  <form onSubmit={(e) => void handleNewsletterSubmit(e)} className="mt-3 flex flex-col gap-2" noValidate>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter corporate email..."
                      className="w-full rounded-lg border border-stone-800 bg-stone-900/90 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 outline-none transition-all duration-300 focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-60"
                    />
                    <div className="absolute -left-[9999px] top-0" aria-hidden>
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={botField}
                        onChange={(e) => setBotField(e.target.value)}
                      />
                    </div>
                    {newsletterError ? (
                      <p role="alert" className="text-xs text-red-400">
                        {newsletterError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Subscribing…' : 'Subscribe →'}
                    </button>
                  </form>
                </ClickSpark>
              )}
            </div>
          </div>
        </div>

        {/* Regional Links Row: Clean static inline list of 6 regions */}
        <div className="mt-16 border-t border-stone-800/80 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-stone-500 shrink-0">
              Regions We Serve
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-stone-300">
              {regions.map((region, idx) => (
                <React.Fragment key={region.slug}>
                  <Link
                    href={`/global-presence#${region.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {region.name}
                  </Link>
                  {idx < regions.length - 1 && (
                    <span className="text-stone-600" aria-hidden="true">
                      ·
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Shiveshwar line */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-stone-800/60 pt-6 md:flex-row">
          <div className="text-center text-xs text-stone-400 md:text-left">
            <span>Our manufacturing lineage begins at </span>
            <ShinyText text="Shiveshwar Textiles" speed={3} className="font-semibold text-accent" />
            <span>, Surat. Operating internationally as Trivoxa Group.</span>
          </div>
          <p className="font-mono text-xs text-stone-500">© Trivoxa Group 2026</p>
        </div>
      </Container>
    </footer>
  );
}

