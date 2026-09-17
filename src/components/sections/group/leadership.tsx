'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { Container, Section } from '@/components/ui/layout';
import { SectionHeading } from '@/components/ui/typography';
import { LEADERSHIP } from '@/content/company';
import ProfileCard from '@/components/reactbits/ProfileCard/ProfileCard';

/**
 * P11 — Leadership section featuring interactive ProfileCards with 3D tilt.
 */
export function GroupLeadership() {
  return (
    <Section surface="light" id="leadership" className="scroll-mt-24 py-24">
      <Container>
        <SectionHeading
          eyebrow="Leadership"
          title="Three founders, one operating discipline."
          lede="Reachable directly on group-domain addresses — because a supplier you cannot email is a supplier you cannot audit."
        />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {LEADERSHIP.map((leader) => (
            <div key={leader.email} className="w-full max-w-[360px] flex flex-col items-center">
              <ProfileCard
                name={leader.name}
                title={leader.role}
                handle={leader.email}
                status="Active Partner"
                enableTilt={true}
                behindGlowEnabled={true}
                behindGlowColor="rgba(168, 139, 104, 0.4)"
                innerGradient="linear-gradient(145deg, rgba(168,139,104,0.18) 0%, rgba(36,28,24,0.95) 100%)"
                contactText="Send Direct Mail"
                onContactClick={() => {
                  window.location.href = `mailto:${leader.email}`;
                }}
                className="w-full"
              />

              {/* Founder quote message */}
              <div className="mt-4 p-4 rounded-xl bg-stone-100/80 border border-stone-200 text-stone-700 text-xs leading-relaxed text-center w-full">
                &ldquo;{leader.message}&rdquo;
              </div>

              <a
                href={`mailto:${leader.email}`}
                className="text-bronze-ink mt-3 inline-flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-espresso"
              >
                <Mail size={13} />
                <span>{leader.email}</span>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
