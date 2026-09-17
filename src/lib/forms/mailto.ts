/**
 * src/lib/forms/mailto.ts — the fallback when the real endpoint can't be
 * reached.
 * ---------------------------------------------------------------------------
 * P21 added `/functions/api/rfq`, `/functions/api/contact` and
 * `/functions/api/subscribe` (Cloudflare Pages Functions — this site is a
 * static export, so that's the backend): each form POSTs there first,
 * persisting to Supabase and notifying the desk via Resend. `composeEnquiry`
 * stays as what renders when that request fails — a structured `mailto:` the
 * buyer can send themselves, so a network hiccup never strands their
 * specification with no way out.
 */

export type EnquiryField = { label: string; value: string };

export type Enquiry = {
  to: string;
  subject: string;
  fields: EnquiryField[];
  /** Trailing note, e.g. where the enquiry came from. */
  footer?: string;
};

/** Only the fields a person actually filled in are included — no empty noise. */
export function composeEnquiry({ to, subject, fields, footer }: Enquiry): string {
  const body = fields
    .filter((field) => field.value.trim().length > 0)
    .map((field) => `${field.label}: ${field.value.trim()}`)
    .join('\n');

  const composed = [`${subject}`, '', body, footer ? `\n${footer}` : '']
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`;
}

/** One shared email shape check — forms and the taxonomy gate agree. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

/**
 * The honeypot. A field no human fills in; if it has a value the submission is
 * a bot and we say nothing, exactly as if it had succeeded.
 */
export const HONEYPOT_FIELD = 'company_website_url';

export function isBot(values: Record<string, string | undefined>): boolean {
  return (values[HONEYPOT_FIELD] ?? '').trim().length > 0;
}
