'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Check, Copy } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import FallingText from '@/components/reactbits/FallingText/FallingText';
import Stepper from '@/components/reactbits/Stepper/Stepper';
import SplitText from '@/components/reactbits/SplitText/SplitText';
import {
  CAREERS_EMAIL,
  HIRING_PROCESS,
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
      <section className="bg-[#171210] py-20 text-[#F4EFE6] border-b border-[#A88B68]/20 overflow-hidden">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 font-mono text-xs text-[#A88B68]">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-[#F4EFE6]/80">Careers</span>
          </nav>

          <p className="font-mono text-xs uppercase tracking-widest text-[#A88B68] mb-3">
            Sourcing Desks & Operations · Surat
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F4EFE6] max-w-4xl">
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

          <p className="mt-6 max-w-3xl text-base sm:text-lg text-[#F4EFE6]/80 leading-relaxed font-sans">
            Trivoxa Group is a founder-led export business in {COMPANY.headquarters}, building an international trading company on top of a manufacturing foundation that has been running for decades. Small team, real consequences, work that ships.
          </p>

          {/* FallingText Physics Keywords Canvas */}
          <div className="mt-10 rounded-2xl border border-[#A88B68]/25 bg-[#241C18]/60 p-4">
            <div className="flex items-center justify-between px-2 mb-2 font-mono text-xs text-[#A88B68]">
              <span>Interactive Skill Arena (Hover to interact)</span>
              <span>{ROLE_KEYWORDS.length} Core Capabilities</span>
            </div>
            <FallingText words={ROLE_KEYWORDS} />
          </div>

          {/* Email Copy CTA Bar */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#A88B68]/20 pt-6">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2 rounded-xl border border-[#A88B68]/40 bg-[#241C18] px-5 py-3 font-mono text-xs text-[#F4EFE6] hover:border-[#A88B68] transition-all"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">Copied {CAREERS_EMAIL} to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="size-4 text-[#A88B68] group-hover:scale-110 transition-transform" />
                  <span>Copy direct email: <strong className="text-[#A88B68]">{CAREERS_EMAIL}</strong></span>
                </>
              )}
            </button>

            <a
              href={`mailto:${CAREERS_EMAIL}?subject=Speculative%20application`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#A88B68] bg-[#A88B68] px-5 py-3 font-mono text-xs font-semibold text-[#171210] hover:bg-[#C4A47C] transition-colors"
            >
              <Mail className="size-4" />
              <span>Launch Mail Composer →</span>
            </a>
          </div>
        </Container>
      </section>

      {/* 2. Verbatim Empty-State / Capability Hiring Block */}
      <Section surface="light" className="py-16">
        <Container>
          <div className="border border-[#A88B68]/40 rounded-2xl bg-white p-8 sm:p-12 shadow-sm">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A88B68] block mb-2">
              Current Openings · 0
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 max-w-2xl">
              We are not hiring against a vacancy right now — we are hiring against capability.
            </h2>

            <div className="mt-6 flex flex-col gap-4 text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl">
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
        </Container>
      </Section>

      {/* 3. "How We Hire" as Stepper (Read-Only Walkthrough) */}
      <Section surface="dark" id="how-we-hire" className="py-20 bg-[#171210] text-[#F4EFE6]">
        <Container>
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-[#A88B68] block mb-2">
              Hiring Protocol
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F4EFE6]">
              How we hire: Four steps, and we tell you where you are in them.
            </h2>
            <p className="mt-3 text-sm text-[#F4EFE6]/70">
              Interactive process walkthrough. Every application receives an explicit reply.
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-2xl border border-[#A88B68]/30 bg-[#241C18] p-6 sm:p-10 shadow-2xl">
            <Stepper
              initialStep={1}
              contentClassName="py-4"
              nextButtonText="Next Stage →"
              backButtonText="← Previous Stage"
            >
              {HIRING_PROCESS.map((step) => (
                <div key={step.step} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-[#A88B68]/20 pb-3">
                    <span className="font-mono text-xs text-[#A88B68] uppercase">
                      Stage 0{step.step} of 04
                    </span>
                    <span className="font-mono text-xs text-[#F4EFE6]/60">
                      Founder Handled
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#F4EFE6]">
                    {step.title}
                  </h3>
                  <p className="text-base text-[#F4EFE6]/80 leading-relaxed">
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
                  <span className="font-mono text-xs text-[#A88B68] font-bold block mb-1">
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
