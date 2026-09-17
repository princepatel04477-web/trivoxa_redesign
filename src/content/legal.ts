/**
 * src/content/legal.ts — the four legal documents, as data.
 * ---------------------------------------------------------------------------
 * Written to describe what this site ACTUALLY does: no accounts, no
 * advertising/tracking cookies, no third-party analytics script. As of P21,
 * form submissions (RFQ, contact, newsletter) ARE persisted — Supabase
 * (AWS ap-south-1) for the record, Resend for desk notification and buyer
 * acknowledgement, Cloudflare Turnstile for bot verification when configured.
 * The policy body below already describes that infrastructure; this comment
 * previously said "no database, no newsletter list", which stopped being true
 * the moment /functions/api/* shipped — keep this comment in sync with
 * src/lib/supabase, src/lib/email and src/lib/turnstile, not the other way
 * around.
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

export const PRIVACY_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'privacy',
  title: 'Privacy Policy',
  summary:
    'Draft privacy notice under the Digital Personal Data Protection Act, 2023 (India), the EU GDPR, and UK GDPR governing international commercial trade.',
  updated: '2026-09-13',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'Legal status and review notice',
      paragraphs: [
        '[DRAFT REQUIRING FORMAL LEGAL REVIEW PRIOR TO PRODUCTION USE - NOT CURRENTLY COUNSEL APPROVED]',
        'This policy outlines how Trivoxa Group (Surat, Gujarat, India) collects, stores, and safeguards commercial contact information and technical telemetry. It is prepared in accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), Regulation (EU) 2016/679 (EU GDPR), and the UK Data Protection Act 2018 / UK GDPR.',
      ],
      list: [],
    },
    {
      heading: 'What we collect, and why',
      paragraphs: [
        'Trivoxa Group is a B2B international trade house. We collect and process personal data exclusively to respond to requests for quotation (RFQs), manage export shipments, coordinate factory audits, and distribute subscribed market intelligence.',
      ],
      list: [
        'Commercial contact data: name, corporate title, business email address, corporate telephone number, and company name.',
        'Shipment specifications: target product lines, technical grades, estimated order quantities (MOQ), destination ports, and selected Incoterms.',
        'Market intelligence subscribers: business email address and opt-in timestamp for category and trade lane updates.',
        'Automated security tokens: ephemeral telemetry processed via Cloudflare Turnstile to prevent bot submissions and DDoS attacks.',
      ],
    },
    {
      heading: 'Processing infrastructure and storage',
      paragraphs: [
        'Form submissions (/rfq, /contact, /api/subscribe) are processed server-side through encrypted transaction channels.',
        'Transactional data is securely persisted in our private database cluster (Supabase / AWS ap-south-1 Mumbai region) using AES-256 encryption at rest and TLS 1.3 in transit.',
        'Commercial notifications and quotations are delivered via Resend with authenticated SPF, DKIM, and DMARC enforcement.',
      ],
      list: [],
    },
    {
      heading: 'Cookies and client-side storage',
      paragraphs: [
        'trivoxagroup.com does not set advertising, retargeting, or persistent behavioural cookies. We do not run third-party tracking scripts.',
        'Cloudflare Turnstile executes ephemeral, privacy-preserving cryptographic challenges on form pages to distinguish human buyers from automated scrapers without tracking user browsing across third-party websites.',
      ],
      list: [],
    },
    {
      heading: 'Data sharing and logistics third parties',
      paragraphs: [
        'We never sell, rent, or trade buyer data to commercial data brokers.',
        'Where an export order is executed, strictly necessary shipment details are shared with validated execution partners: our parent mill (Shiveshwar Textiles), partner manufacturing facilities, licensed customs house agents (CHAs), ocean carriers, and destination customs authorities.',
      ],
      list: [],
    },
    {
      heading: 'Retention and statutory obligations',
      paragraphs: [
        'General commercial inquiries and unexecuted quotation requests are retained for three years from the date of last contact to facilitate re-quotes.',
        'Executed export records, customs manifests, and tax invoices are retained for eight financial years in compliance with Section 17 of the Indian Customs Act, 1962 and Section 36 of the Central Goods and Services Tax (CGST) Act, 2017.',
        'Newsletter subscribers remain on the registry until consent is withdrawn via the one-click unsubscribe mechanism.',
      ],
      list: [],
    },
    {
      heading: 'Your legal rights',
      paragraphs: [
        'Under the DPDP Act 2023, EU GDPR, and UK GDPR, international buyers and site visitors hold enforceable rights regarding their personal data:',
      ],
      list: [
        'Right to access: request a structured copy of all personal data held about you.',
        'Right to correction: request rectification of inaccurate commercial or contact records.',
        'Right to erasure: request deletion of records where statutory customs retention laws do not mandate preservation.',
        'Right to withdraw consent: withdraw consent for market intelligence updates at any time.',
        'Right to lodge a complaint: European and British buyers retain the right to complain to their national Data Protection Authority (e.g. the ICO in the UK).',
      ],
    },
    {
      heading: 'Data Controller and contact details',
      paragraphs: [
        'The Data Fiduciary / Controller is Trivoxa Group, Surat, Gujarat, India.',
        'For privacy questions, access requests, or grievance redressal, write directly to hello@trivoxagroup.com marked for the attention of the Managing Director. All verified requests receive a written response within 30 days.',
      ],
      list: [],
    },
  ],
});

export const TERMS_OF_USE: LegalDocument = LegalDocumentSchema.parse({
  slug: 'terms',
  title: 'Terms & Conditions',
  summary:
    'Commercial conditions governing site use, catalogue specifications, and export contract formation.',
  updated: '2026-09-13',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'Legal status and review notice',
      paragraphs: [
        '[DRAFT REQUIRING FORMAL LEGAL REVIEW PRIOR TO PRODUCTION USE - NOT CURRENTLY COUNSEL APPROVED]',
        'These terms govern the use of trivoxagroup.com. Transactions for physical export commodities or digital services are governed exclusively by executed commercial contracts, not by general browsing of this site.',
      ],
      list: [],
    },
    {
      heading: 'This site is an introduction, not a binding offer',
      paragraphs: [
        'All catalogue listings, HS code headings, technical grades, minimum order quantities (MOQs), lead times, and Incoterms are published as an invitation to treat (invitatio ad offerendum). None of the material on this site constitutes a unilateral binding commercial offer capable of immediate acceptance.',
      ],
      list: [],
    },
    {
      heading: 'How an export contract comes into existence',
      paragraphs: [
        'A legally binding commercial contract is established only when all of the following conditions are satisfied in writing:',
      ],
      list: [
        'Trivoxa Group issues a dated, numbered Proforma Invoice or Sales Contract specifying goods, exact grade, volume, unit pricing, Incoterms® 2020 delivery rule, designated loading port, and payment milestones.',
        'The buyer accepts and countersigns the formal document, or issues an authorized Purchase Order confirming the exact contract terms.',
        'Required preliminary financial instruments (e.g. irrevocable Letter of Credit or advance deposit) are received and confirmed by our designated banking partners in India.',
      ],
    },
    {
      heading: 'Specifications, tolerances and sample primacy',
      paragraphs: [
        'Where counter-samples or laboratory test lots are approved in writing prior to production, the physical specifications and tolerances of the approved reference lot supersede indicative catalogue descriptions.',
        'HS codes published on this site are indicative classifications. Importers must confirm exact classification, duty tariffs, and import licenses with their local customs broker prior to consignment dispatch.',
      ],
      list: [],
    },
    {
      heading: 'Trade compliance and sanctions warranty',
      paragraphs: [
        'Both parties warrant that the transaction complies with applicable international trade sanctions, export controls, and anti-money laundering regulations. Trivoxa Group does not ship to sanctioned entities or blocked destination ports.',
      ],
      list: [],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'The Trivoxa trademark, brand assets, site typography, and original compilation data are the exclusive property of Trivoxa Group. Buyer specifications, proprietary formulations, and trademarked packaging designs remain the exclusive property of the buyer.',
      ],
      list: [],
    },
    {
      heading: 'Governing law and dispute resolution',
      paragraphs: [
        'These terms and any non-contractual obligations arising out of them are governed by the substantive laws of India.',
        'Disputes arising out of site usage or commercial negotiations shall be subject to the exclusive jurisdiction of the competent courts in Surat, Gujarat, India, without prejudice to arbitral dispute resolution clauses agreed in specific bilateral contracts.',
      ],
      list: [],
    },
  ],
});

export const COOKIE_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'cookies',
  title: 'Cookie Policy',
  summary:
    'Transparency notice detailing our zero-tracking policy and strictly necessary bot-deterrence security tokens.',
  updated: '2026-09-13',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'Legal status and review notice',
      paragraphs: [
        '[DRAFT REQUIRING FORMAL LEGAL REVIEW PRIOR TO PRODUCTION USE - NOT CURRENTLY COUNSEL APPROVED]',
        'This notice explains our cookie and client-side storage architecture under European ePrivacy directives, GDPR, and Indian DPDP Act 2023 principles.',
      ],
      list: [],
    },
    {
      heading: 'Zero advertising or tracking cookies',
      paragraphs: [
        'trivoxagroup.com does not set advertising cookies, marketing pixels, cross-site tracking scripts, or behavioural profiling identifiers. We do not monetise visitor telemetry.',
        'Because we do not set non-essential cookies, we do not present intrusive cookie consent banners that obstruct navigation.',
      ],
      list: [],
    },
    {
      heading: 'Strictly necessary security tokens (Cloudflare Turnstile)',
      paragraphs: [
        'To protect our quotation and contact endpoints from automated vulnerability scans, spam engines, and DDoS attacks, we deploy Cloudflare Turnstile.',
        'Turnstile operates ephemeral cryptographic verification challenges during form interactions. It does not set persistent tracking cookies and does not collect browsing history across third-party websites.',
      ],
      list: [],
    },
    {
      heading: 'Device preferences and local storage',
      paragraphs: [
        'User interface adaptations (such as reduced-motion preferences) are evaluated dynamically in the browser via CSS media queries (prefers-reduced-motion) and are not stored in persistent cookies.',
      ],
      list: [],
    },
    {
      heading: 'Independent verification',
      paragraphs: [
        'Compliance officers and procurement teams can verify this posture at any time using browser developer inspection tools:',
      ],
      list: [
        'Developer Tools → Application → Cookies: confirms zero advertising or analytics cookies set on trivoxagroup.com.',
        'Developer Tools → Network: confirms all primary page assets, styles, and fonts load from verified group origins.',
      ],
    },
  ],
});

export const ANTI_CORRUPTION_POLICY: LegalDocument = LegalDocumentSchema.parse({
  slug: 'anti-corruption',
  title: 'Anti-corruption Policy',
  summary:
    'Standards governing bribery prohibition, facilitation payment bans, and documentation integrity across our export operations.',
  updated: '2026-09-13',
  reviewStatus: 'internal-review',
  sections: [
    {
      heading: 'Legal status and review notice',
      paragraphs: [
        '[DRAFT REQUIRING FORMAL LEGAL REVIEW PRIOR TO PRODUCTION USE - NOT CURRENTLY COUNSEL APPROVED]',
        'This policy establishes mandatory anti-bribery and fair-trade standards for Trivoxa Group, its founders, employees, and logistics intermediaries across all origin and destination markets.',
      ],
      list: [],
    },
    {
      heading: 'Core position and statutory framework',
      paragraphs: [
        'Trivoxa Group maintains zero tolerance for bribery, extortion, kickbacks, or corrupt practices in any commercial transaction. We comply strictly with the Prevention of Corruption Act, 1988 (India), the UK Bribery Act 2010, and the US Foreign Corrupt Practices Act (FCPA).',
        'This prohibition applies universally, regardless of local customary practices, commercial pressure, or informal port traditions.',
      ],
      list: [],
    },
    {
      heading: 'Prohibited conduct',
      paragraphs: [
        'The following activities are strictly prohibited across all operations:',
      ],
      list: [
        'Facilitation payments: offering, paying, or soliciting speed fees to port personnel, customs officials, or inspection agencies to expedite lawful clearances.',
        'Kickbacks and secret commissions: paying or receiving undisclosed financial rebates to influence procurement decisions.',
        'Documentation misrepresentation: falsifying commercial invoices, manipulating declared cargo valuations, misstating Country of Origin, or applying fraudulent HS headings to evade duties.',
        'Improper corporate gifts: providing lavish hospitality, cash equivalents, or personal travel to commercial buyers or government authorities.',
      ],
    },
    {
      heading: 'Intermediaries, forwarders and customs brokers',
      paragraphs: [
        'Third parties representing Trivoxa Group — including customs house agents (CHAs), ocean freight forwarders, and logistics partners — must adhere to our anti-corruption commitments.',
        'All intermediary appointments require written contracts containing audit rights and explicit anti-bribery covenants. Compensation is paid exclusively via formal banking channels against verified invoices for legitimate services rendered.',
      ],
      list: [],
    },
    {
      heading: 'Confidential reporting and non-retaliation',
      paragraphs: [
        'Employees, suppliers, buyers, and partners who observe potential violations are encouraged to submit confidential reports directly to hello@trivoxagroup.com marked for the attention of the Managing Director.',
        'Trivoxa Group enforces strict non-retaliation policies protecting any whistleblower reporting concerns in good faith.',
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
