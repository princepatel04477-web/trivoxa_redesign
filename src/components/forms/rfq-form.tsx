'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { CATEGORIES, CONTACT, INDUSTRIES, PRODUCTS } from '@/content/taxonomy';
import { track } from '@/lib/analytics/events';
import { focusFirstInvalid } from '@/lib/forms/focus-first-invalid';
import { composeEnquiry, type Enquiry } from '@/lib/forms/mailto';
import { HONEYPOT_FIELD, RfqSubmissionSchema } from '@/lib/forms/schema';
import type { SubmissionResult } from '@/lib/forms/transport';

/**
 * P16 — the RFQ form. The single commercial conversion on the site.
 *
 * Three design decisions worth defending:
 *
 *  1. It asks for the four things that make a quotation real — grade, quantity,
 *     destination and target Incoterm — and says so in the hint text, because
 *     the alternative is a vague enquiry and a week of email tennis.
 *  2. Industry and category are ONE taxonomy, and the category list narrows to
 *     the chosen industry. A buyer cannot select a combination that does not
 *     exist, which is the form-level version of the drift the audit found.
 *  3. Submission composes a structured mailto (src/lib/forms/mailto.ts) and
 *     SHOWS the buyer what was composed. There is no backend in this repo, and
 *     a form that posts nowhere is a lie with a button on it. P21 swaps the
 *     transport behind the same handler.
 *
 * `?product=`, `?category=` and `?path=` arrive pre-filled from catalogue rows,
 * industry pages and the compliance audit CTA — the context travels with the
 * buyer instead of being retyped.
 */

const REFERRAL_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'search', label: 'Search engine' },
  { value: 'referral', label: 'Referral from a buyer or partner' },
  { value: 'trade-show', label: 'Trade show or exhibition' },
  { value: 'existing-client', label: 'We have shipped together before' },
  { value: 'shiveshwar', label: 'Shiveshwar Textiles' },
  { value: 'other', label: 'Other' },
];

/** Concrete field shape — a `Record<string, string>` would make every read
 *  `string | undefined` under `noUncheckedIndexedAccess`. */
type FormState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  destination: string;
  industry: string;
  category: string;
  product: string;
  requirement: string;
  referral: string;
} & { [K in typeof HONEYPOT_FIELD]: string };

export type RfqPrefill = {
  product?: string;
  category?: string;
  division?: string;
  path?: string;
};

export function PathNote({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-bronze/40 surface-raised mb-2xl flex flex-col gap-xs border p-lg">
      <Eyebrow tick={false} className="surface-faint">
        {title}
      </Eyebrow>
      <p className="surface-muted text-body-md max-w-[74ch]">{body}</p>
    </div>
  );
}

export function RfqPathNote() {
  const searchParams = useSearchParams();
  const path = searchParams.get('path');
  if (path === 'audit') {
    return (
      <PathNote
        title="Factory audit request"
        body="Marked for the audit route: tell us the protocol, the dates and who is attending. We arrange access at our parent company's mill in Surat or at the partner factory, and send the documentation set in advance."
      />
    );
  }
  if (path === 'sample') {
    return (
      <PathNote
        title="Sample request"
        body="Marked for sampling: give us the specification and the courier account or address. Textile samples typically ship within 20 days of specification lock, and your approval is recorded against the sample reference."
      />
    );
  }
  return null;
}

export function RfqForm({ prefill }: { prefill?: RfqPrefill } = {}) {
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get('category') ?? prefill?.category ?? '';
  const paramProduct = searchParams.get('product') ?? prefill?.product ?? '';
  const paramDivision = searchParams.get('division') ?? prefill?.division ?? '';
  const paramPath = searchParams.get('path') ?? prefill?.path ?? '';

  const [mountTime] = useState<number>(() => Date.now());
  const [prefillChip, setPrefillChip] = useState<string | null>(null);

  const [values, setValues] = useState<FormState>(() => {
    let initialCategory = '';
    let initialIndustry = '';
    let initialProduct = '';
    let initialRequirement = '';

    if (paramProduct) {
      const match = PRODUCTS.find((p) => p.slug === paramProduct);
      if (match) {
        initialProduct = match.name;
        initialCategory = match.categorySlug;
        const catObj = CATEGORIES.find((c) => c.slug === match.categorySlug);
        if (catObj) initialIndustry = catObj.industrySlug;
        initialRequirement = `Sourcing inquiry for ${match.name} (HS Code: ${match.hsCode || 'TBD'}). Target grade, quantity, destination port, and delivery Incoterms:`;
      } else {
        initialProduct = paramProduct;
      }
    } else if (paramCategory) {
      const catObj = CATEGORIES.find((c) => c.slug === paramCategory);
      if (catObj) {
        initialCategory = catObj.slug;
        initialIndustry = catObj.industrySlug;
      } else {
        const indObj = INDUSTRIES.find((i) => i.slug === paramCategory);
        if (indObj) {
          initialIndustry = indObj.slug;
          const firstCat = CATEGORIES.find((c) => c.industrySlug === indObj.slug);
          if (firstCat) initialCategory = firstCat.slug;
        }
      }
    }

    if (!initialRequirement) {
      if (paramPath === 'sample') {
        initialRequirement =
          'Sample request: please specify sample grade, delivery address or courier account, and required testing metrics.';
      } else if (paramPath === 'audit') {
        initialRequirement =
          'Factory audit inquiry: please specify proposed dates, audit standards (e.g. ISO/SMETA), attendee details, and target facility.';
      }
    }

    return {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      destination: '',
      industry: initialIndustry,
      category: initialCategory,
      product: initialProduct,
      requirement: initialRequirement,
      referral: '',
      [HONEYPOT_FIELD]: '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const [sent, setSent] = useState<SubmissionResult | 'nothing' | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    const pProd = searchParams.get('product');
    const pCat = searchParams.get('category');
    const pPath = searchParams.get('path');

    if (pProd) {
      const match = PRODUCTS.find((p) => p.slug === pProd);
      if (match) {
        setPrefillChip(`Prefilled from catalogue: ${match.name}`);
      }
    } else if (pCat) {
      const match = CATEGORIES.find((c) => c.slug === pCat) || INDUSTRIES.find((i) => i.slug === pCat);
      if (match) {
        setPrefillChip(`Prefilled from industry: ${match.name}`);
      }
    } else if (pPath === 'sample') {
      setPrefillChip('Prefilled: Sample Request route');
    } else if (pPath === 'audit') {
      setPrefillChip('Prefilled: Factory Audit route');
    }
  }, [searchParams]);

  const set = (key: keyof FormState, value: string): void => {
    setValues((current) => {
      const next = { ...current, [key]: value };
      if (key === 'industry') {
        const owned = CATEGORIES.filter((category) => category.industrySlug === value).map(
          (category) => category.slug,
        );
        if (next.category && !owned.includes(next.category)) next.category = '';
      }
      return next;
    });
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }));
    }
  };

  const validateField = (field: keyof FormState): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const singleParse = RfqSubmissionSchema.shape[field as keyof typeof RfqSubmissionSchema.shape]?.safeParse(
      values[field],
    );
    if (singleParse && !singleParse.success) {
      setErrors((prev) => ({
        ...prev,
        [field]: singleParse.error.issues[0]?.message || 'Invalid field',
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = useMemo(() => {
    const pool = values.industry
      ? CATEGORIES.filter((category) => category.industrySlug === values.industry)
      : CATEGORIES;
    return [
      { value: '', label: values.industry ? 'Select a category' : 'Select a category (optional)' },
      ...pool.map((category) => ({ value: category.slug, label: category.name })),
    ];
  }, [values.industry]);

  const validateAll = (): boolean => {
    const result = RfqSubmissionSchema.safeParse({
      ...values,
      path: paramPath === 'sample' || paramPath === 'audit' ? paramPath : '',
      division: paramDivision,
    });

    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const p = issue.path[0]?.toString();
        if (p && !nextErrors[p]) {
          nextErrors[p] = issue.message;
        }
      }
      setErrors(nextErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmissionError(null);

    // Honeypot check
    if (values[HONEYPOT_FIELD]?.trim().length > 0) {
      track('bot_discarded', { form: 'rfq' });
      setSent('nothing');
      return;
    }

    if (!validateAll()) {
      focusFirstInvalid(formRef.current);
      return;
    }

    setIsSubmitting(true);

    const industryObj = INDUSTRIES.find((entry) => entry.slug === values.industry);
    const categoryObj = CATEGORIES.find((entry) => entry.slug === values.category);
    const serviceSide = paramDivision === 'service-exports' || values.industry === 'technology';
    const deskMailbox = serviceSide ? CONTACT.general : CONTACT.sales;

    const about =
      values.product.trim() || categoryObj?.name || industryObj?.name || (serviceSide ? 'Service enquiry' : 'Enquiry');
    const subject = values.companyName.trim()
      ? `RFQ — ${about} — ${values.companyName.trim()}`
      : `RFQ — ${about}`;

    const mailtoEnquiry: Enquiry = {
      to: deskMailbox,
      subject,
      fields: [
        { label: 'Name', value: values.fullName },
        { label: 'Company', value: values.companyName },
        { label: 'Email', value: values.email },
        { label: 'Phone', value: values.phone },
        { label: 'Destination', value: values.destination },
        { label: 'Industry', value: industryObj?.name ?? '' },
        { label: 'Category', value: categoryObj?.name ?? '' },
        { label: 'Product of interest', value: values.product },
        { label: 'Requirement', value: values.requirement },
        { label: 'Referral', value: referralLabel(values.referral) },
        { label: 'Path', value: pathLabel(paramPath) },
      ],
      footer: `Sent from trivoxagroup.com/rfq · ${new Date().toISOString().slice(0, 10)}`,
    };

    const mailtoHref = composeEnquiry(mailtoEnquiry);
    setFallbackMailto(mailtoHref);

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          path: paramPath === 'sample' || paramPath === 'audit' ? paramPath : '',
          division: paramDivision,
          submittedAt: mountTime,
          referringUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      const outcome = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !outcome.ok) {
        if (outcome.errors) {
          setErrors(outcome.errors);
          focusFirstInvalid(formRef.current);
        }
        setSubmissionError(
          outcome.error || 'The server could not accept your enquiry. Please verify details or use email fallback.',
        );
        setIsSubmitting(false);
        return;
      }

      const reference = outcome.reference || 'TRV-RFQ-OK';
      setSent({ kind: 'queued', reference });
      setIsSubmitting(false);

      track('rfq_compose', {
        division: serviceSide ? 'service-exports' : 'product-exports',
        industry: industryObj?.slug,
        category: categoryObj?.slug,
        path: paramPath || undefined,
        destination: values.destination.trim() || undefined,
      });

      if (paramPath === 'audit') {
        track('audit_request', { from: 'rfq' });
      }
    } catch {
      setSubmissionError(
        'Network error connecting to the export desk. Your typed information has been saved.',
      );
      setIsSubmitting(false);
    }
  };

  if (sent === 'nothing') {
    return <SentPanel href="" />;
  }
  if (sent) {
    return (
      <SentPanel
        href={sent.kind === 'mailto' ? sent.href : ''}
        reference={sent.kind === 'queued' ? sent.reference : undefined}
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-lg">
      {prefillChip ? (
        <div className="border-bronze/50 surface-raised flex items-center justify-between gap-md border px-md py-sm text-body-sm">
          <span className="surface-fg font-medium">{prefillChip}</span>
          <button
            type="button"
            onClick={() => setPrefillChip(null)}
            className="surface-muted hover:surface-fg text-body-sm font-semibold focus-visible:outline-none"
            aria-label="Dismiss prefilled context"
          >
            ✕
          </button>
        </div>
      ) : null}

      {submissionError ? (
        <div role="alert" className="border-accent/60 bg-accent/10 flex flex-col gap-sm border p-md text-body-sm">
          <p className="font-medium text-accent">{submissionError}</p>
          {fallbackMailto ? (
            <p className="surface-fg text-body-xs">
              You can send this exact specification directly via your email client:{' '}
              <a href={fallbackMailto} className="link-underline font-semibold text-bronze-ink">
                Open formatted email fallback →
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-md">
        <Input
          className="col-span-12 sm:col-span-6"
          label="Full name"
          required
          autoComplete="name"
          value={values.fullName}
          error={touched.fullName ? errors.fullName : undefined}
          onBlur={() => validateField('fullName')}
          onChange={(event) => set('fullName', event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Company"
          required
          autoComplete="organization"
          value={values.companyName}
          error={touched.companyName ? errors.companyName : undefined}
          onBlur={() => validateField('companyName')}
          onChange={(event) => set('companyName', event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onBlur={() => validateField('email')}
          onChange={(event) => set('email', event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Phone"
          type="tel"
          hint="Optional — include the country code."
          autoComplete="tel"
          value={values.phone}
          error={touched.phone ? errors.phone : undefined}
          onBlur={() => validateField('phone')}
          onChange={(event) => set('phone', event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Destination"
          hint="Country, and the port if you know it."
          value={values.destination}
          onChange={(event) => set('destination', event.target.value)}
          disabled={isSubmitting}
        />
        <Select
          className="col-span-12 sm:col-span-6"
          label="Industry"
          options={[
            { value: '', label: 'Select an industry (optional)' },
            ...INDUSTRIES.map((industry) => ({ value: industry.slug, label: industry.name })),
          ]}
          value={values.industry}
          onChange={(event) => set('industry', event.target.value)}
          disabled={isSubmitting}
        />
        <Select
          className="col-span-12 sm:col-span-6"
          label="Category"
          options={categoryOptions}
          value={values.category}
          onChange={(event) => set('category', event.target.value)}
          disabled={isSubmitting}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Product or service of interest"
          list="rfq-products"
          value={values.product}
          onChange={(event) => set('product', event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <datalist id="rfq-products">
        {PRODUCTS.map((product) => (
          <option key={product.slug} value={product.name} />
        ))}
      </datalist>

      <Textarea
        label="Requirement"
        required
        rows={6}
        hint="Grade or specification, quantity, destination port, target Incoterm (EXW / FOB / CIF / DDP) and any certification your market requires."
        value={values.requirement}
        error={touched.requirement ? errors.requirement : undefined}
        onBlur={() => validateField('requirement')}
        onChange={(event) => set('requirement', event.target.value)}
        disabled={isSubmitting}
      />

      <Select
        label="How did you hear about us?"
        options={REFERRAL_OPTIONS}
        value={values.referral}
        onChange={(event) => set('referral', event.target.value)}
        disabled={isSubmitting}
      />

      {/* honeypot — off-screen, not display:none, and never labelled */}
      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <Input
          label="Company website URL"
          tabIndex={-1}
          autoComplete="off"
          value={values[HONEYPOT_FIELD] ?? ''}
          onChange={(event) => set(HONEYPOT_FIELD, event.target.value)}
        />
      </div>

      <div className="mt-md flex flex-wrap items-center gap-lg">
        <Button type="submit" size="lg" arrow disabled={isSubmitting}>
          {isSubmitting ? 'Sending to export desk...' : 'Send the enquiry'}
        </Button>
        <Prose className="text-body-sm">
          <p className="surface-muted max-w-[46ch]">
            Enquiries are received securely by our export desk and processed in accordance with our{' '}
            <Link href="/legal/privacy" className="link-underline text-bronze-ink">
              Privacy Policy
            </Link>.
          </p>
        </Prose>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------------ */

function SentPanel({ href, reference }: { href: string; reference?: string }) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // The form has been replaced by this panel, so nothing persists that a live
    // region could have been attached to — and a region inserted together with
    // the change is not reliably announced. Focus is: the heading is read out
    // the moment the buyer submits (P20).
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status" className="border-bronze/50 surface-raised flex flex-col gap-md border p-xl">
      <Eyebrow tick={false} className="surface-faint">
        Enquiry received
      </Eyebrow>
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-lg max-w-[28ch] rounded-sm">
        {reference
          ? `Enquiry received — reference ${reference}. The desk replies ${CONTACT.responseWindow}.`
          : `Your mail client has the enquiry — send it and the desk replies ${CONTACT.responseWindow}.`}
      </h2>
      <Prose className="text-body-md">
        <p className="surface-muted max-w-[62ch]">
          {reference
            ? 'A confirmation email with your specification details has been sent to your address. Our export desk in Surat reviews specifications Monday to Saturday, 10:00–19:00 IST.'
            : 'If nothing opened, use the link below or write to us directly. Either route reaches the same three people.'}
        </p>
      </Prose>
      <div className="mt-sm flex flex-wrap gap-md">
        {href ? (
          <a href={href} className="link-underline text-bronze-ink text-body-md font-medium">
            Open the enquiry again →
          </a>
        ) : null}
        <a href={`mailto:${CONTACT.sales}`} className="link-underline text-bronze-ink text-body-md font-medium">
          {CONTACT.sales}
        </a>
      </div>
    </div>
  );
}

function referralLabel(value: string): string {
  return REFERRAL_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

function pathLabel(path?: string): string {
  if (path === 'audit') return 'Factory audit';
  if (path === 'sample') return 'Sample request';
  return '';
}
