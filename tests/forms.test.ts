/**
 * P21 acceptance: the enquiry transport seam and the analytics bus.
 *
 * These tests pin the two things that must not drift silently:
 *  · the fallback path when /functions/api/* can't be reached (compose a
 *    mailto locally — nothing stored, nothing lost), and the bot screens the
 *    Pages Functions apply before ever touching Supabase or Resend;
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
import { generateReference } from '../functions/_lib/reference';
import { isTimeTrapTripped } from '../functions/_lib/http';

const enquiry = {
  to: 'sales@trivoxagroup.com',
  subject: 'RFQ — Cotton Yarn — Acme Textiles',
  fields: [
    { label: 'Name', value: 'Jane Buyer' },
    { label: 'Company', value: 'Acme Textiles' },
    { label: 'Phone', value: '' },
  ],
};

describe('mailto fallback', () => {
  it('composeEnquiry is the single place a mailto is built, carrying only filled-in fields', () => {
    const href = composeEnquiry(enquiry);
    expect(href.startsWith('mailto:sales@trivoxagroup.com?subject=')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Jane Buyer');
    // An empty phone number must not appear as "Phone:" noise in the message.
    expect(decodeURIComponent(href)).not.toContain('Phone:');
  });

  it('a filled honeypot is detected and produces no message', () => {
    expect(isBot({ [HONEYPOT_FIELD]: '' })).toBe(false);
    expect(isBot({ [HONEYPOT_FIELD]: 'http://spam.example' })).toBe(true);
  });
});

describe('Pages Function bot screens (functions/_lib)', () => {
  it('flags a submission that arrives implausibly fast after the form mounted', () => {
    expect(isTimeTrapTripped(Date.now())).toBe(true);
    expect(isTimeTrapTripped(Date.now() - 5000)).toBe(false);
    expect(isTimeTrapTripped(undefined)).toBe(false);
  });

  it('generates a reference in the TRV-<PREFIX>-<ID> shape the desk quotes back', () => {
    expect(generateReference('RFQ')).toMatch(/^TRV-RFQ-[0-9A-F]{10}$/);
    expect(generateReference('CNT')).toMatch(/^TRV-CNT-[0-9A-F]{10}$/);
    // Not a constant — two calls must not collide.
    expect(generateReference('RFQ')).not.toBe(generateReference('RFQ'));
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
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const { join } = await import('node:path');

    const pattern = /window\.gtag|googletagmanager|google-analytics|plausible\.io|mixpanel|segment\.io|hotjar|clarity\.ms|fbq\(/i;
    const matches: string[] = [];

    function scan(dir: string): void {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          scan(full);
        } else if (/\.(tsx?|jsx?|mjs|cjs|html|css)$/.test(entry)) {
          const content = readFileSync(full, 'utf8');
          if (pattern.test(content)) {
            matches.push(full);
          }
        }
      }
    }

    scan('src');
    expect(matches, `analytics provider found in: ${matches.join(', ')}`).toEqual([]);
  });
});

describe('submission schemas', async () => {
  const { RfqSubmissionSchema, ContactSubmissionSchema } = await import('@/lib/forms/schema');

  it('validates a complete RFQ submission successfully', () => {
    const valid = {
      fullName: 'John Buyer',
      companyName: 'Acme Imports Ltd',
      email: 'john@acmeimports.com',
      phone: '+44 20 7946 0958',
      destination: 'Felixstowe (GBFXT)',
      industry: 'textile-apparel',
      category: 'textile-apparel',
      product: 'Cotton Yarn',
      requirement: 'Need 2x 40ft FCL of 30s combed cotton yarn for weaving, delivery CIF Felixstowe.',
      referral: 'trade-show',
      path: 'standard',
    };

    const result = RfqSubmissionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects an RFQ with too short requirement or missing company', () => {
    const invalid = {
      fullName: 'John',
      companyName: '',
      email: 'john@acme.com',
      requirement: 'Need price.',
    };

    const result = RfqSubmissionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('companyName');
      expect(paths).toContain('requirement');
    }
  });

  it('validates a Contact submission successfully', () => {
    const valid = {
      inquiryType: 'sample-request',
      fullName: 'Sarah Chen',
      companyName: 'Chen & Partners',
      email: 'schen@chenpartners.com',
      callback: '+65 6789 0123',
      message: 'Requesting swatches for reactive printed viscose fabric ahead of Q3 line launch.',
    };

    const result = ContactSubmissionSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email or too short message in Contact', () => {
    const invalid = {
      inquiryType: 'general',
      fullName: 'Sarah',
      email: 'not-an-email',
      message: 'Hi',
    };

    const result = ContactSubmissionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain('email');
      expect(paths).toContain('message');
    }
  });
});

