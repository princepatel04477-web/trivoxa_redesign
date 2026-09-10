/**
 * src/content/legal.ts — the four legal documents, as data.
 * ---------------------------------------------------------------------------
 * Written to describe what this site ACTUALLY does, which is unusually simple
 * and is the reason these pages can be short: no accounts, no database, no
 * cookies, no analytics, no newsletter list. Enquiries are composed in the
 * visitor's own mail client (src/lib/forms/mailto.ts) and sent by them.
 *
 * Every claim here is checkable against the codebase — that is deliberate,
 * because a privacy policy describing infrastructure we do not have is the kind
 * of document a procurement team's legal reviewer enjoys finding fault with.
 *
 * STATUS: internal review only. These must be read by counsel qualified in
 * India (and, for EU/UK buyers, against GDPR/UK GDPR) before launch. Tracked in
 * docs/DECISIONS.md.
 */
import { z } from 'zod';

export const LegalSectionSchema = z.object({
  heading: z.string().min(3),
  paragraphs: z.array(z.string().min(20)).default([]),
  list: z.array(z.string().min(10)).default([]),
});

export const LegalDocumentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(4),
  /** What this document is for, in one sentence a buyer can parse. */
  summary: z.string().min(40),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reviewStatus: z.enum(['internal-review', 'counsel-approved']),
  sections: LegalSectionSchema.array().min(3),
});

export type LegalSection = z.infer<typeof LegalSectionSchema>;
export type LegalDocument = z.infer<typeof LegalDocumentSchema>;

const NO_BACKEND =
  'This website has no user accounts, no database and no server-side storage. When you use the enquiry form, your browser composes an email in your own mail client and you send it — the site never receives a copy, and there is nothing on our servers to lose.';

export const PRIVACY_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'privacy',
  title: 'Privacy Policy',
  summary:
    'What this site collects (nothing, on its own), what reaches us when you write to us, and who is responsible for it.',
  updated: '2026-09-04',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'The short version',
      paragraphs: [
        NO_BACKEND,
        'We therefore hold personal data only where you have chosen to send it to us by email: typically a name, a company, an email address, sometimes a telephone number and the commercial details of an enquiry.',
      ],
      list: [],
    },
    {
      heading: 'What we collect, and why',
      paragraphs: ['The only personal data we process is what you put in an email to us. We use it for one purpose: answering your enquiry and, if it becomes an order, administering that order.'],
      list: [
        'Name and company — so we know who we are quoting and can check the destination market\u2019s requirements.',
        'Email address and telephone number — to reply, and to call you back if you asked us to.',
        'Enquiry details (product, grade, quantity, destination, Incoterm) — to price and document a shipment.',
        'Nothing else. We do not ask for, and you should not send us, identification documents, bank details or payment card numbers by email.',
      ],
    },
    {
      heading: 'Cookies, storage and analytics',
      paragraphs: [
        'This site sets no cookies and writes nothing to your browser\u2019s local or session storage. There is no analytics, no advertising pixel and no third-party tracker on any page.',
        'That is a statement about the site as it stands today. If analytics are added, this page will be updated first and will name the provider, the data sent and how to opt out — not afterwards.',
      ],
      list: [],
    },
    {
      heading: 'Third parties',
      paragraphs: [
        'Fonts are self-hosted from this domain; no font or CDN service sees your request. Images and 3D assets are served from this domain.',
        'Where an order requires it, we share the minimum necessary detail with the parties who physically move and clear the cargo — the mill or factory, the freight forwarder, the customs house agent and the carrier — plus the authorities who require documentation. We do not sell, rent or trade personal data, ever.',
        'Our service division operates a separate property, digital.trivoxagroup.com, which is linked from this site and has its own privacy notice.',
      ],
      list: [],
    },
    {
      heading: 'Retention',
      paragraphs: [
        'Enquiry correspondence is kept in our mailboxes for as long as the commercial relationship is live, and export documentation is retained for the period Indian export and tax law requires — currently eight financial years for GST and shipping-bill records.',
        'Ask us to delete an enquiry that never became an order and we will, except where the law obliges us to keep the record; in that case we will tell you which record and why.',
      ],
      list: [],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'You can ask what we hold about you, ask for it to be corrected, ask for it to be deleted, object to processing, or ask for a copy in a portable format. Write to hello@trivoxagroup.com and we will answer within 30 days.',
        'Buyers in the EU, UK, Switzerland or Brazil also have the right to complain to their own supervisory authority. We would rather you wrote to us first, but the right is yours either way.',
      ],
      list: [],
    },
    {
      heading: 'International transfers',
      paragraphs: [
        'We are in Surat, India, and we correspond with buyers worldwide, so personal data does cross borders — usually as an email you sent us. Where a buyer requires transfer safeguards (standard contractual clauses or an addendum to that effect), we will sign them; ask via the partnerships alias.',
      ],
      list: [],
    },
    {
      heading: 'Controller, and how to reach us',
      paragraphs: [
        'The data controller is Trivoxa Group, Surat, Gujarat, India, built on our parent company Shiveshwar Textiles. Our registered entity number is published on the contact page as soon as the founders release it.',
        'Privacy questions go to hello@trivoxagroup.com, marked for the attention of the Managing Director. There is no separate data protection officer, because there is no data infrastructure to officer — the three founders read every message.',
      ],
      list: [],
    },
    {
      heading: 'Changes and review status',
      paragraphs: [
        'This policy was last updated on 4 September 2026 and is under internal review; it has not yet been reviewed by counsel qualified in India. When it is, the review status on this page changes and the date moves.',
      ],
      list: [],
    },
  ],
});

export const TERMS_OF_USE: LegalDocument = LegalDocumentSchema.parse({
  slug: 'terms',
  title: 'Terms & Conditions',
  summary:
    'What this website is, what it is not, and where a contract between us actually comes into existence.',
  updated: '2026-09-04',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'This site is an introduction, not a shop',
      paragraphs: [
        'Everything published here — catalogue rows, HS codes, grades, minimum order quantities, lead times, Incoterms, loading ports and region pages — is information about what we can supply. None of it is an offer capable of acceptance, and no contract is formed by using this website.',
      ],
      list: [],
    },
    {
      heading: 'How a contract comes into existence',
      paragraphs: ['A contract is formed only when both of these have happened in writing:'],
      list: [
        'We issue a dated quotation stating product, specification, quantity, unit price, MOQ, lead time, Incoterm, loading port, payment terms and validity; and',
        'You accept it in writing — a signed quotation, a purchase order referencing our quotation number, or a proforma invoice confirmation.',
        'Anything said before that point, including by email, is negotiation. Verbal indications of price or availability are not commitments.',
      ],
    },
    {
      heading: 'Specifications, HS codes and the catalogue',
      paragraphs: [
        'The governing specification is the one recorded against your approved sample reference, not a catalogue row. Catalogue grades, MOQs and lead times are indicative of the line and are confirmed on the quotation.',
        'HS codes published here are the headings we classify these products under. Classification is ultimately determined by the customs authority of the importing country and can depend on composition, form and use; verify the code with your broker before you rely on it for duty or licensing. We will support a classification query with the documentation we hold.',
      ],
      list: [],
    },
    {
      heading: 'Certifications and compliance status',
      paragraphs: [
        'The compliance register on this site states which credentials we hold and which are in progress, with a target quarter for each. Where a destination market requires a credential we do not yet hold — for example WHO-GMP for pharmaceutical lines or FSSAI for food lines — we say so at quotation stage rather than at customs, and we will not quote a line we cannot document.',
      ],
      list: [],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The Trivoxa name, the eagle mark, this website\u2019s design and its written content are ours. Specifications, artwork and samples you send us remain yours; we use them to quote and produce your order and for nothing else.',
        'Catalogue content may be quoted internally by a buyer evaluating us, with attribution. It may not be republished, resold, scraped into a competing catalogue or used to imply an endorsement.',
      ],
      list: [],
    },
    {
      heading: 'Third-party links',
      paragraphs: [
        'We link to digital.trivoxagroup.com (our own service property), to social profiles and, from the compliance register, to government authorities. We are not responsible for the content or practices of sites we do not operate.',
      ],
      list: [],
    },
    {
      heading: 'Liability',
      paragraphs: [
        'This website is provided as published. We take reasonable care that it is accurate, but we do not warrant that reliance on any figure here — as distinct from a written quotation — will produce a particular result.',
        'Liability arising from an actual order is governed by the contract for that order, not by this page. Nothing in these terms limits liability for fraud, death or personal injury caused by negligence, or any liability that cannot lawfully be limited.',
      ],
      list: [],
    },
    {
      heading: 'Law and jurisdiction',
      paragraphs: [
        'These terms are governed by the law of India. Subject to any mandatory consumer or commercial protection in your own jurisdiction, disputes arising from the use of this website fall under the exclusive jurisdiction of the courts at Surat, Gujarat.',
      ],
      list: [],
    },
    {
      heading: 'Review status',
      paragraphs: [
        'Last updated 4 September 2026. Under internal review; not yet reviewed by counsel. Commercial terms for a specific order always prevail over anything on this page.',
      ],
      list: [],
    },
  ],
});

export const COOKIE_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'cookies',
  title: 'Cookie Policy',
  summary: 'This site sets no cookies, uses no local storage and runs no analytics. Here is how to verify that.',
  updated: '2026-09-04',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'What we set: nothing',
      paragraphs: [
        'trivoxagroup.com sets no cookies of any kind — not session, not preference, not analytics, not advertising. It writes nothing to your browser\u2019s local or session storage, and it loads no third-party script that would do so on our behalf.',
        'There is consequently no cookie banner on this site. A banner that asks you to accept something we never set would be noise, and noise on a compliance-heavy website is its own kind of red flag.',
      ],
      list: [],
    },
    {
      heading: 'How to check for yourself',
      paragraphs: ['Open your browser\u2019s developer tools on any page of this site:'],
      list: [
        'Application → Cookies → trivoxagroup.com: empty.',
        'Application → Local Storage and Session Storage: empty.',
        'Network: every request goes to this domain. Fonts, images and the 3D assets are self-hosted; there is no CDN, no font service and no analytics endpoint.',
      ],
    },
    {
      heading: 'Preferences you might expect us to remember',
      paragraphs: [
        'Some sites store a language or motion preference in a cookie. We do not: language is part of the URL, and reduced-motion is read from your operating system setting at runtime, which means it follows your device rather than our storage.',
      ],
      list: [],
    },
    {
      heading: 'If that changes',
      paragraphs: [
        'Adding analytics or a newsletter would change this page, and it would change before the code ships: we would name the provider, the data sent, the retention period and how to opt out. Until then, the honest answer to "what do you track?" is nothing.',
      ],
      list: [],
    },
    {
      heading: 'Questions',
      paragraphs: ['Write to hello@trivoxagroup.com. A founder reads it, and we will answer plainly.'],
      list: [],
    },
  ],
});

export const ANTI_CORRUPTION_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'anti-corruption',
  title: 'Anti-corruption Policy',
  summary:
    'How we handle bribery, gifts, customs facilitation and third parties — and what we expect from anyone acting for us.',
  updated: '2026-09-04',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'Position',
      paragraphs: [
        'Trivoxa Group does not pay bribes, does not accept them, and does not use agents, forwarders or customs house agents to do what we would not do ourselves. This applies to every market we ship into and every market we buy from.',
        'Where a buyer\u2019s own anti-bribery regime applies to the transaction — the UK Bribery Act 2010, the US Foreign Corrupt Practices Act, or an equivalent — we will cooperate with their due diligence and sign their supplier code of conduct.',
      ],
      list: [],
    },
    {
      heading: 'What is prohibited',
      paragraphs: ['The following are prohibited absolutely, in every jurisdiction and whatever the local practice is said to be:'],
      list: [
        'Payments, gifts or hospitality offered to a public official to obtain or expedite a licence, clearance, inspection result or shipment release — including so-called facilitation or "speed" payments at a port.',
        'Kickbacks, commissions or undisclosed referral fees to a buyer\u2019s employees or agents.',
        'False or understated invoicing, split invoicing, mis-declared HS codes, mis-declared values or mis-declared country of origin — a documentation falsification is treated as a corruption offence, not an administrative shortcut.',
        'Charitable or political donations made as a way of routing a benefit to a decision-maker.',
      ],
    },
    {
      heading: 'Gifts and hospitality',
      paragraphs: [
        'Modest business hospitality is normal and permitted: a working lunch during a factory visit, product samples, branded items of nominal value. Anything that could influence a decision — cash or cash equivalents, travel unrelated to a factory visit, personal gifts above nominal value, or hospitality for a family member — requires the Managing Director\u2019s written approval before it is offered or accepted.',
        'Every gift or hospitality item offered to or received from a public official is recorded, whatever its value.',
      ],
      list: [],
    },
    {
      heading: 'Third parties acting for us',
      paragraphs: [
        'Freight forwarders, customs house agents, inspection bodies, sourcing agents and distributors act on our behalf and their conduct is our exposure. They are engaged in writing, with an anti-bribery clause, a right to audit, and payment against a documented service — never in cash, never to a third country unrelated to the service, and never as a percentage of a customs valuation.',
        'We will not appoint an intermediary because they claim to be able to "fix" a clearance. If a third party cannot explain how a problem was solved, we treat it as a red flag and stop.',
      ],
      list: [],
    },
    {
      heading: 'Documentation integrity',
      paragraphs: [
        'Commercial invoices, packing lists, certificates of origin, inspection reports and declarations must match the goods and the transaction. A document we would not show to a customs authority is a document we do not issue. Where a buyer asks for documentation that misstates value, origin or description, we decline the request and record that we declined it.',
      ],
      list: [],
    },
    {
      heading: 'Raising a concern',
      paragraphs: [
        'Anyone — employee, supplier, agent, forwarder or buyer — can raise a concern with the Managing Director at hello@trivoxagroup.com, marked confidential. We will acknowledge within two working days and investigate.',
        'There is no retaliation for raising a concern in good faith, including where the concern turns out to be mistaken. Raising a false allegation deliberately is a different matter and is handled as misconduct.',
      ],
      list: [],
    },
    {
      heading: 'Consequences and review status',
      paragraphs: [
        'Breaching this policy is grounds for termination of employment or of a third-party engagement, and where the conduct is criminal we will report it to the relevant authority.',
        'Last updated 4 September 2026. This policy is under internal review and requires founder sign-off and review by counsel before launch; it is published now because a supplier-code question from a buyer should not have to wait for our paperwork.',
      ],
      list: [],
    },
  ],
});

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
  cookies: COOKIE_POLICY,
  'anti-corruption': ANTI_CORRUPTION_POLICY,
};
