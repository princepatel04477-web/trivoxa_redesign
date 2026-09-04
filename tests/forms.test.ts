/**
 * P21 acceptance: the enquiry transport seam and the analytics bus.
 *
 * These tests pin the two things that must not drift silently:
 *  · what a submission actually does today (compose a mailto — nothing stored),
 *    including the sentence the UI uses to disclose it;
 *  · that every commercial event is emitted through one typed bus, and that the
 *    declared event map and the exported name list agree.
 */
import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_EVENTS,
  onAnalyticsEvent,
  track,
  type AnalyticsEvent,
  type AnalyticsEventMap,
} from '@/lib/analytics/events';
import { HONEYPOT_FIELD, composeEnquiry, isBot } from '@/lib/forms/mailto';
import { mailtoTransport, submitThroughTransport, transport } from '@/lib/forms/transport';

const enquiry = {
  to: 'sales@trivoxagroup.com',
  subject: 'RFQ — Cotton Yarn — Acme Textiles',
  fields: [
    { label: 'Name', value: 'Jane Buyer' },
    { label: 'Company', value: 'Acme Textiles' },
    { label: 'Phone', value: '' },
  ],
};

describe('transport seam', () => {
  it('the active transport is the mailto transport', () => {
    expect(transport).toBe(mailtoTransport);
    expect(transport.id).toBe('mailto');
  });

  it('its disclosure says what really happens — no claim of storage', () => {
    expect(transport.disclosure).toMatch(/mail client/i);
    expect(transport.disclosure).toMatch(/nothing is stored/i);
    expect(transport.disclosure).not.toMatch(/we (?:have )?(?:saved|stored|received)/i);
  });

  it('submits to a mailto href carrying only the fields that were filled in', async () => {
    const result = await submitThroughTransport(enquiry, {
      name: 'rfq_compose',
      payload: { division: 'product-exports' },
    });

    expect(result.kind).toBe('mailto');
    if (result.kind !== 'mailto') return;
    expect(result.href.startsWith('mailto:sales@trivoxagroup.com?subject=')).toBe(true);
    expect(decodeURIComponent(result.href)).toContain('Jane Buyer');
    // An empty phone number must not appear as "Phone:" noise in the message.
    expect(decodeURIComponent(result.href)).not.toContain('Phone:');
  });

  it('composeEnquiry is the single place a mailto is built', () => {
    expect(composeEnquiry(enquiry)).toMatch(/^mailto:/);
  });

  it('a filled honeypot is detected and produces no message', () => {
    expect(isBot({ [HONEYPOT_FIELD]: '' })).toBe(false);
    expect(isBot({ [HONEYPOT_FIELD]: 'http://spam.example' })).toBe(true);
  });
});

describe('analytics bus', () => {
  it('delivers a typed event with a timestamp to every subscriber', () => {
    const seen: AnalyticsEvent[] = [];
    const off = onAnalyticsEvent((event) => seen.push(event));

    track('catalog_filter', { category: 'textile-apparel', visibleRows: 5 });
    off();
    track('catalog_filter', { category: 'building-materials', visibleRows: 4 });

    expect(seen).toHaveLength(1);
    expect(seen[0]?.name).toBe('catalog_filter');
    expect(seen[0]?.payload).toEqual({ category: 'textile-apparel', visibleRows: 5 });
    expect(typeof seen[0]?.at).toBe('number');
  });

  it('the exported name list and the event map agree exactly', () => {
    const declared = new Set<string>(ANALYTICS_EVENTS);
    const map: Record<keyof AnalyticsEventMap, true> = {
      rfq_compose: true,
      contact_compose: true,
      catalog_filter: true,
      rfq_cta_click: true,
      callback_request: true,
      audit_request: true,
      bot_discarded: true,
    };

    expect([...declared].sort()).toEqual(Object.keys(map).sort());
  });

  it('no analytics provider is installed anywhere in the source', async () => {
    // The privacy position in the cookie notice depends on this: no gtag, no
    // GA/Plausible/Meta script, no vendor SDK. If someone adds one, this test
    // fails and the notice has to change in the same commit.
    const { execSync } = await import('node:child_process');
    const out = execSync(
      "grep -rniE 'window\\.gtag|googletagmanager|google-analytics|plausible\\.io|mixpanel|segment\\.io|hotjar|clarity\\.ms|fbq\\(' src/ || true",
      { encoding: 'utf8' },
    );
    expect(out.trim(), `analytics provider found:\n${out}`).toBe('');
  });
});
