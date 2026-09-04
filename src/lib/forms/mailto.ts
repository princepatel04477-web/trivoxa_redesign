/**
 * src/lib/forms/mailto.ts — how an enquiry leaves this site today.
 * ---------------------------------------------------------------------------
 * There is no backend in this repository, and a form that posts nowhere is a
 * lie with a button on it (the same reasoning that kept the newsletter form off
 * /insights). So submission composes a structured `mailto:` message: the buyer
 * sees exactly what will be sent, nothing is silently dropped, and the export
 * desk receives a message it can act on without a CRM.
 *
 * P21 replaces `submitEnquiry` with a real endpoint (server action + storage +
 * analytics event) behind this same signature, and no form component changes.
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

export function submitEnquiry(enquiry: Enquiry): string {
  const href = composeEnquiry(enquiry);
  if (typeof window !== 'undefined') window.location.href = href;
  return href;
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
