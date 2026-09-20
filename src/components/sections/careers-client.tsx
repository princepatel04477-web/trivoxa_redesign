'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, Copy, Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import FallingText from '@/components/reactbits/FallingText/FallingText';
import Stepper from '@/components/reactbits/Stepper/Stepper';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import {
  CAREERS_EMAIL,
  HIRING_PROCESS,
  OPEN_ROLES,
  WHAT_WE_LOOK_FOR,
  hasOpenRoles,
} from '@/content/editorial';
import { COMPANY, LEADERSHIP } from '@/content/company';
import { DIVISIONS, INDUSTRIES } from '@/content/taxonomy';

const ROLE_KEYWORDS = [
  'Customs Specialist',
  'Quality Inspector',
  'Freight Coordinator',
  'Loom Technician',
  'Software Engineer',
  'Documentation Desk',
  'Commodity Sourcing',
  'Incoterms CIF / FOB',
  'Surat Mill Operations',
];

export function CareersClient() {
  const [copied, setCopied] = useState(false);
  const hiring = hasOpenRoles();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CAREERS_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full">
      {/* 1. Hero with FallingText of role keywords */}
      <section className="bg-espresso-deep py-20 text-ivory border-b border-bronze/20 overflow-hidden">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-mono text-xs text-bronze">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-ivory/80">Careers</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-bronze mb-3">
            Sourcing Desks & Operations · Surat
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ivory max-w-[56rem]">
            <SplitText
              text={
                hiring
                  ? 'Roles open right now.'
                  : 'No open roles today. The invitation still stands.'
              }
              tag="span"
              className="inline-block"
              delay={25}
            />
          </h1>

          <p className="mt-6 max-w-[48rem] text-base sm:text-lg text-ivory/80 leading-relaxed font-sans">
            Trivoxa Group is a founder-led export business in {COMPANY.headquarters}, building an international trading company on top of a manufacturing foundation that has been running for decades. Small team, real consequences, work that ships.
          </p>

          {/* FallingText Physics Keywords Canvas */}
          <div className="mt-10 rounded-2xl border border-bronze/25 bg-espresso/60 p-4">
            <div className="flex items-center justify-between px-2 mb-2 font-mono text-xs text-bronze">
              <span>Interactive Skill Arena (Hover to interact)</span>
              <span>{ROLE_KEYWORDS.length} Core Capabilities</span>
            </div>
            <FallingText words={ROLE_KEYWORDS} />
          </div>

          {/* Email Copy CTA Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-bronze/20 pt-6">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2 rounded-xl border border-bronze/40 bg-espresso px-5 py-3 font-mono text-xs text-ivory hover:border-bronze transition-all"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied {CAREERS_EMAIL} to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4 text-bronze group-hover:scale-110 transition-transform" />
                  <span>Copy direct email: <strong className="text-bronze">{CAREERS_EMAIL}</strong></span>
                </>
              )}
            </button>

            <a
              href={`mailto:${CAREERS_EMAIL}?subject=Speculative%20application`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-bronze bg-bronze px-5 py-3 font-mono text-xs font-semibold text-espresso-deep hover:bg-bronze transition-colors"
            >
              <Mail className="size-4" />
              <span>Launch Mail Composer →</span>
            </a>
          </div>
        </Container>
      </section>

      {/* 2. Open Positions or Capability Hiring Block */}
      <Section surface="light" id="open-roles" className="py-16">
        <Container>
          {hiring ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-8">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-2 font-semibold">
                    Current Openings · {OPEN_ROLES.length} Active Positions
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                    Grow our global trade desks.
                  </h2>
                  <p className="mt-3 text-base text-stone-600 max-w-[44rem] leading-relaxed">
                    We are growing our global trade desks. Direct your CV and portfolio of closed trade contracts to Parth (Founder) at{' '}
                    <a
                      href={`mailto:${CAREERS_EMAIL}`}
                      className="font-semibold text-bronze-ink hover:underline font-mono"
                    >
                      {CAREERS_EMAIL}
                    </a>.
                  </p>
                </div>
                <a
                  href={`mailto:${CAREERS_EMAIL}?subject=Application%20for%20Trade%20Desk`}
                  className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-xs font-mono font-semibold text-white hover:bg-stone-800 transition-colors shrink-0"
                >
                  <Mail className="size-4 text-bronze" />
                  <span>Email Parth (Founder) →</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {OPEN_ROLES.map((role) => (
                  <div
                    key={role.slug}
                    id={role.slug}
                    className="p-6 sm:p-8 rounded-2xl border border-stone-200/90 bg-white hover:border-bronze/50 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider bg-stone-100 text-stone-700 px-2.5 py-1 rounded-md">
                          <Briefcase className="size-3 text-bronze" />
                          {role.team}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider bg-bronze/10 text-bronze-ink px-2.5 py-1 rounded-md">
                          <MapPin className="size-3 text-bronze" />
                          {role.location}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-md">
                          {role.type}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-bronze-ink transition-colors mb-3">
                        {role.title}
                      </h3>
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {role.summary}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-mono text-xs text-stone-400">Direct Founder Route</span>
                      <a
                        href={`mailto:${CAREERS_EMAIL}?subject=Application%20for%20${encodeURIComponent(role.title)}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-stone-900 hover:text-bronze transition-colors"
                      >
                        <span>Apply to Parth (Founder)</span>
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-bronze/40 rounded-2xl bg-white p-8 sm:p-12 shadow-sm">
              <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-2">
                Current Openings · 0
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 max-w-[42rem]">
                We are not hiring against a vacancy right now — we are hiring against capability.
              </h2>

              <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base text-stone-600 leading-relaxed max-w-[48rem]">
                <p>
                  {LEADERSHIP.length} founders, {DIVISIONS.length} export divisions and {INDUSTRIES.length} industries: when we need someone, it is usually because a category is being onboarded, a factory audit protocol is being systematised, or an export lane needs dedicated coordination. The role is created around the person who can own the outcome.
                </p>
                <p>
                  We actively look for export documentation specialists, quality inspectors with weaving or materials backgrounds, cross-border freight coordinators (Mundra / Nhava Sheva lanes), and software engineers who understand international trade workflows.
                </p>
              </div>

              <div className="mt-8 border-t border-stone-200 pt-6">
                <h3 className="font-semibold text-stone-900 text-sm">
                  What your speculative application should contain:
                </h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600 list-disc pl-5">
                  <li>A concise summary of operational responsibilities you have managed (customs codes, consignments, or platforms).</li>
                  <li>Which export division or industry you want to take on, and which bottleneck you would solve first.</li>
                  <li>Your CV and availability for on-site work in Surat or structured hybrid engagement.</li>
                </ul>
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* 3. "How We Hire" as Stepper (Read-Only Walkthrough) */}
      <Section surface="dark" id="how-we-hire" className="py-20 bg-espresso-deep text-ivory">
        <Container>
          <div className="max-w-[48rem] mx-auto mb-12 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-bronze block mb-2">
              Hiring Protocol
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory">
              How we hire: Four steps, and we tell you where you are in them.
            </h2>
            <p className="mt-3 text-sm text-ivory/70">
              Interactive process walkthrough. Every application receives an explicit reply.
            </p>
          </div>

          <div className="max-w-[48rem] mx-auto rounded-2xl border border-bronze/30 bg-espresso p-6 sm:p-10 shadow-2xl">
            <Stepper
              initialStep={1}
              contentClassName="py-4"
              nextButtonText="Next Stage →"
              backButtonText="← Previous Stage"
            >
              {HIRING_PROCESS.map((step) => (
                <div key={step.step} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-bronze/20 pb-3">
                    <span className="font-mono text-xs text-bronze uppercase">
                      Stage 0{step.step} of 04
                    </span>
                    <span className="font-mono text-xs text-ivory/60">
                      Founder Handled
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-ivory">
                    {step.title}
                  </h3>
                  <p className="text-base text-ivory/80 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </Stepper>
          </div>
        </Container>
      </Section>

      {/* 4. What We Look For */}
      <Section surface="light" className="py-20 border-t border-stone-200">
        <Container>
          <SectionHeading
            eyebrow="What we look for"
            title="Four things, none of them a degree."
            lede="What matters to our partners and factory teams in Surat."
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {WHAT_WE_LOOK_FOR.map((item, index) => (
              <div
                key={item.slug}
                className="p-6 rounded-2xl border border-stone-200 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-bronze font-bold block mb-1">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
