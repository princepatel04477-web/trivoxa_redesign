import { composeEnquiry, type Enquiry } from '@/lib/forms/mailto';
import { track } from '@/lib/analytics/events';

/**
 * src/lib/forms/transport.ts — the seam between "a buyer filled this in" and
 * "the enquiry is on its way" (P21).
 * ---------------------------------------------------------------------------
 * Today the only honest transport is `mailto:` — see mailto.ts for why. What
 * this module adds is the boundary: a form component asks a transport to submit
 * an enquiry and renders whatever comes back. When a server action, a CRM
 * webhook or an email API exists, it is implemented as another `EnquiryTransport`
 * and exported from `transport` below. No form component changes, and the
 * analytics event keeps firing from the same place either way.
 *
 * The result is deliberately a union rather than a bare href so the UI cannot
 * pretend a mechanism did something it did not: a `mailto` result means "your
 * mail client now has this", a `queued` result means "we accepted it, here is a
 * reference". Those are different sentences and the panels say them differently.
 */

export type SubmissionResult =
  /** Composed locally; the buyer's mail client sends it. Nothing was stored. */
  | { kind: 'mailto'; href: string }
  /** Accepted by a backend. Not produced by any transport in this repo yet. */
  | { kind: 'queued'; reference: string };

export type EnquiryTransport = {
  /** Mechanism name, used in the UI's disclosure line. */
  readonly id: 'mailto' | 'endpoint';
  /** One line a buyer can read, stating what will actually happen. */
  readonly disclosure: string;
  submit(enquiry: Enquiry): SubmissionResult | Promise<SubmissionResult>;
};

export const mailtoTransport: EnquiryTransport = {
  id: 'mailto',
  disclosure:
    'Submitting opens your mail client with the enquiry already written out. Nothing is stored on this site.',
  submit(enquiry) {
    return { kind: 'mailto', href: composeEnquiry(enquiry) };
  },
};

/**
 * The transport in use. Swapping it is a one-line change here, and it is the
 * only place in the codebase that decides how an enquiry leaves the browser.
 */
export const transport: EnquiryTransport = mailtoTransport;

/**
 * Submit through the active transport and record the commercial event.
 *
 * Bot submissions are counted separately and never reach a transport: the form
 * says nothing either way, exactly as if it had worked, so a scraper gets no
 * signal to correct against.
 */
export async function submitThroughTransport(
  enquiry: Enquiry,
  event: { name: 'rfq_compose' | 'contact_compose'; payload: Record<string, string | number | undefined> },
): Promise<SubmissionResult> {
  const result = await transport.submit(enquiry);
  track(event.name, event.payload as never);
  return result;
}
