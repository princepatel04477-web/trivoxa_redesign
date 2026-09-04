/**
 * src/content/faqs.ts — the questions that arrive before an order does.
 * ---------------------------------------------------------------------------
 * Two sets: the RFQ page (commercial, answered with numbers and routes) and
 * the Contact page (logistical, answered with addresses and hours).
 *
 * Every answer has to survive a procurement reader who is comparing us with
 * three other suppliers: no answer may be a restatement of the question, and
 * none may promise a credential, a lead time or a price the taxonomy does not
 * support. `zod` enforces the length floor; review enforces the rest.
 */
import { z } from 'zod';

export const FaqEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(10),
  answer: z.string().min(60).max(420),
});

export type FaqEntry = z.infer<typeof FaqEntrySchema>;

export const RFQ_FAQ: FaqEntry[] = FaqEntrySchema.array().parse([
  {
    id: 'how-fast',
    question: 'How quickly will I get a quotation?',
    answer:
      'The export desk answers within 24 business hours (IST), Monday to Saturday. A priced quotation — unit price, MOQ, lead time, Incoterm and loading port — follows once the specification is complete; if a field is missing, our first reply asks for it rather than guessing.',
  },
  {
    id: 'outside-catalogue',
    question: 'Do you supply products that are not in the catalogue?',
    answer:
      'Yes. The published catalogue is what we can quote without a conversation — 25 rows with HS codes, grades and MOQs. Outside it we source against a written specification through our parent company\u2019s mill and our validated partner factories, and we tell you before quoting whether a line can be produced to your grade.',
  },
  {
    id: 'incoterms',
    question: 'Which Incoterms do you quote?',
    answer:
      'EXW, FOB, CIF and DDP, ex Mundra (INMUN), Kandla (INIXY) or Nhava Sheva (INNSA). Every quotation names the loading port and the Incoterm, so your landed-cost comparison across suppliers is like for like.',
  },
  {
    id: 'samples',
    question: 'Can I get a sample before committing?',
    answer:
      'Yes — samples are produced against the written specification and shipped by international courier, typically within 20 days for textile lines. Your approval is recorded against a sample reference, and that reference governs production.',
  },
  {
    id: 'audits',
    question: 'Can we audit the factory, or send a third party?',
    answer:
      'Both are welcome, at our parent company\u2019s mill in Surat and at partner factories. Tell us the protocol and the date; we arrange access and send the documentation set in advance. Use the audit route on this page and the enquiry reaches the desk marked for it.',
  },
]);

export const CONTACT_FAQ: FaqEntry[] = FaqEntrySchema.array().parse([
  {
    id: 'which-email',
    question: 'Which address should I write to?',
    answer:
      'Commercial enquiries go to sales@trivoxagroup.com and everything else to hello@trivoxagroup.com. Careers is careers@trivoxagroup.com and partnerships is partnerships@trivoxagroup.com. The three founders are reachable directly too — their addresses are listed on this page. If you are not sure, use hello@: it is read by the same people.',
  },
  {
    id: 'phone',
    question: 'Can I call instead of emailing?',
    answer:
      'We do not publish a telephone number we cannot guarantee will be answered by someone who knows your enquiry. Ask for a callback in the form and we will call the number you give us within the published response window — that is a commitment we can actually keep.',
  },
  {
    id: 'hours',
    question: 'What are your working hours?',
    answer:
      'Monday to Saturday, 10:00\u201319:00 IST (UTC+05:30), from Surat, Gujarat. Enquiries that arrive outside those hours are answered the next working morning, within the 24-business-hour response window.',
  },
  {
    id: 'entity',
    question: 'What entity will I be contracting with?',
    answer:
      'Trivoxa Group, headquartered in Surat, Gujarat, India, built on our parent company Shiveshwar Textiles. The registered entity number is published on this page as soon as the founders release it — we would rather show the gap than print a number that belongs to somebody else.',
  },
]);

/**
 * Inquiry types for the contact form. Each one routes to the alias that
 * actually handles it, so an enquiry does not spend a day being forwarded.
 */
export const InquiryTypeSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  label: z.string().min(4),
  /** Which mailbox handles it — must be one of the canonical aliases. */
  routesTo: z.enum(['general', 'sales', 'careers', 'partnerships']),
  hint: z.string().min(20).max(160),
});

export type InquiryType = z.infer<typeof InquiryTypeSchema>;

export const INQUIRY_TYPES: InquiryType[] = InquiryTypeSchema.array().parse([
  {
    slug: 'product-enquiry',
    label: 'Product enquiry',
    routesTo: 'sales',
    hint: 'A product, a grade and a quantity — the export desk replies with a priced quotation.',
  },
  {
    slug: 'service-enquiry',
    label: 'Service enquiry',
    routesTo: 'general',
    hint: 'Technology, design, marketing or consulting work through Trivoxa Digital.',
  },
  {
    slug: 'sample-request',
    label: 'Sample request',
    routesTo: 'sales',
    hint: 'Samples are produced to specification and couriered, typically within 20 days.',
  },
  {
    slug: 'factory-audit',
    label: 'Factory audit',
    routesTo: 'sales',
    hint: 'Buyer-nominated or third-party audits at our parent company\u2019s mill or partner factories.',
  },
  {
    slug: 'partnership',
    label: 'Partnership or distribution',
    routesTo: 'partnerships',
    hint: 'Distribution, co-sourcing and manufacturing partnerships in your market.',
  },
  {
    slug: 'careers',
    label: 'Careers',
    routesTo: 'careers',
    hint: 'Open roles and speculative applications, read by a founder rather than a keyword scan.',
  },
]);
