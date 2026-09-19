'use client';

import { BRAND } from '@/lib/tokens/colors';
import React, { useEffect, useState, useMemo } from 'react';
import GlassSurface from '@/components/reactbits/GlassSurface/GlassSurface';
import DecryptedText from '@/components/reactbits/DecryptedText/DecryptedText';
import ElectricBorder from '@/components/reactbits/ElectricBorder/ElectricBorder';
import { Eyebrow } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';
import { LEADERSHIP } from '@/content/company';

/**
 * Live "Desk open / closed" status computed in Asia/Kolkata (IST: UTC+5:30).
 * Operating hours: Monday–Saturday, 10:00 to 19:00 IST. Closed Sunday.
 */
function useDeskStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const evaluate = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          weekday: 'short',
          hour: 'numeric',
          minute: 'numeric',
        });
        const parts = formatter.formatToParts(now);
        const weekday = parts.find((p) => p.type === 'weekday')?.value;
        const hour = parseInt(parts.find((p) => p.type === 'hour')?.value ?? '0', 10);
        const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';

        setTimeStr(`${String(hour).padStart(2, '0')}:${minute} IST`);

        // Mon-Sat: days 1 through 6. 10:00 through 18:59
        const isWeekday = weekday !== 'Sun';
        const inHours = hour >= 10 && hour < 19;
        setIsOpen(isWeekday && inHours);
      } catch {
        setIsOpen(true);
      }
    };

    evaluate();
    const interval = setInterval(evaluate, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isOpen, timeStr };
}

export function ContactDetailsPanel() {
  const { isOpen, timeStr } = useDeskStatus();

  const aliases = useMemo(
    () => [
      { label: 'Everything else', value: CONTACT.general, note: 'Read by the founders.' },
      { label: 'Commercial & quotations', value: CONTACT.sales, note: 'The export desk.' },
      { label: 'Careers', value: CONTACT.careers, note: 'Speculative applications welcome.' },
      { label: 'Partnerships & distribution', value: CONTACT.partnerships, note: 'Market partnerships.' },
    ],
    [],
  );

  return (
    <GlassSurface
      width="100%"
      height="auto"
      borderRadius={24}
      borderWidth={0.06}
      backgroundOpacity={0.06}
      blur={16}
      saturation={1.3}
      className="w-full text-stone-900 shadow-xl border border-stone-200/80 bg-stone-50/70 p-6 sm:p-8"
    >
      <div className="w-full flex flex-col gap-8">
        {/* Live Desk Status Pill */}
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isOpen ? 'bg-emerald-500' : 'bg-stone-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isOpen ? 'bg-emerald-600' : 'bg-stone-500'
                }`}
              />
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide uppercase text-stone-700" suppressHydrationWarning>
              Desk {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
          {timeStr && (
            <span className="font-mono text-xs text-bronze font-medium" data-spec suppressHydrationWarning>
              {timeStr}
            </span>
          )}
        </div>

        {/* Mailboxes with DecryptedText on hover */}
        <div>
          <Eyebrow tick={false} className="surface-faint">
            Mailboxes
          </Eyebrow>
          <ul className="mt-3 flex flex-col">
            {aliases.map((alias) => (
              <li
                key={alias.value}
                className="surface-hairline flex flex-wrap items-baseline justify-between gap-x-md gap-y-1 border-b py-3 first:border-t"
              >
                <div className="flex flex-col">
                  <span className="surface-faint text-body-xs uppercase font-mono">{alias.label}</span>
                  <a
                    href={`mailto:${alias.value}`}
                    className="link-underline break-all text-stone-900 hover:text-bronze-ink text-body-sm font-semibold transition-colors mt-0.5"
                  >
                    <DecryptedText
                      text={alias.value}
                      animateOn="hover"
                      speed={35}
                      maxIterations={8}
                      className="font-mono"
                      encryptedClassName="font-mono text-stone-400"
                    />
                  </a>
                </div>
                <span className="surface-muted text-right text-body-xs max-w-[20ch]">{alias.note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The founders directly */}
        <div>
          <Eyebrow tick={false} className="surface-faint">
            The founders, directly
          </Eyebrow>
          <ul className="mt-3 flex flex-col">
            {LEADERSHIP.map((leader) => (
              <li
                key={leader.email}
                className="surface-hairline flex flex-wrap items-baseline justify-between gap-x-md gap-y-1 border-b py-2.5 first:border-t"
              >
                <span className="surface-fg text-body-sm font-medium">{leader.name}</span>
                <a
                  href={`mailto:${leader.email}`}
                  className="link-underline surface-muted hover:text-bronze-ink break-all text-body-xs font-mono"
                >
                  <DecryptedText
                    text={leader.email}
                    animateOn="hover"
                    speed={30}
                    maxIterations={6}
                    className="font-mono"
                    encryptedClassName="font-mono text-stone-400"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Office and Hours details */}
        <div className="surface-raised surface-hairline flex flex-col gap-4 border p-5 rounded-xl bg-white/70">
          <div>
            <p className="surface-faint spec-value uppercase text-xs" data-spec>
              Registered office
            </p>
            <p className="surface-fg mt-1 text-body-sm font-medium">{CONTACT.registeredOffice}</p>
          </div>

          <div>
            <p className="surface-faint spec-value uppercase text-xs" data-spec>
              Registered entity number
            </p>
            <p className="surface-muted mt-1 text-body-xs leading-relaxed">
              {CONTACT.registeredEntityNumber ??
                'Not yet published. We will print it here the moment the founders release it — we would rather show the gap than print a registration that belongs to a different company.'}
            </p>
          </div>

          {/* #callback highlighted with ElectricBorder */}
          <div id="callback" className="scroll-mt-24 pt-2">
            <ElectricBorder color={BRAND.bronze.hex} speed={0.8} chaos={0.08} borderRadius={12}>
              <div className="p-4 bg-espresso text-ivory rounded-xl">
                <p className="spec-value uppercase text-xs text-bronze" data-spec>
                  Telephone & Callback
                </p>
                {CONTACT.phoneNumbers.length > 0 ? (
                  <ul className="mt-2 flex flex-col">
                    {CONTACT.phoneNumbers.map((number) => (
                      <li key={number} className="spec-value text-body-sm text-ivory" data-spec>
                        {number}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-body-xs text-ivory/80 leading-relaxed">
                    No published public line — we will not print a number we cannot guarantee is answered
                    by someone who knows your enquiry. Select <strong className="text-bronze">Callback</strong> in the form and we call
                    you within the response window.
                  </p>
                )}
              </div>
            </ElectricBorder>
          </div>

          <div>
            <p className="surface-faint spec-value uppercase text-xs" data-spec>
              Hours
            </p>
            <p className="surface-fg spec-value mt-1 text-body-sm" data-spec>
              {CONTACT.hoursIst} · {CONTACT.timezoneLabel}
            </p>
          </div>
        </div>

        {/* Socials */}
        {CONTACT.socials.length > 0 && (
          <div>
            <Eyebrow tick={false} className="surface-faint">
              Elsewhere
            </Eyebrow>
            <ul className="mt-3 flex flex-wrap gap-4">
              {CONTACT.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline surface-muted hover:text-bronze-ink text-body-xs font-medium"
                  >
                    {social.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </GlassSurface>
  );
}
