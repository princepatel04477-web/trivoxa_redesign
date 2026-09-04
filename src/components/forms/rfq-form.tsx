'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { CATEGORIES, CONTACT, INDUSTRIES, PRODUCTS } from '@/content/taxonomy';
import { track } from '@/lib/analytics/events';
import { focusFirstInvalid } from '@/lib/forms/focus-first-invalid';
import { HONEYPOT_FIELD, isBot, isEmail, type Enquiry } from '@/lib/forms/mailto';
import { submitThroughTransport, type SubmissionResult } from '@/lib/forms/transport';

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

export function RfqForm({ prefill }: { prefill: RfqPrefill }) {
  const [values, setValues] = useState<FormState>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    destination: '',
    industry: '',
    category: prefill.category && CATEGORIES.some((c) => c.slug === prefill.category) ? prefill.category : '',
    product: resolveProductName(prefill.product),
    requirement: '',
    referral: '',
    [HONEYPOT_FIELD]: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement | null>(null);
  const [sent, setSent] = useState<SubmissionResult | 'nothing' | null>(null);

  const set = (key: keyof FormState, value: string): void => {
    setValues((current) => {
      // choosing an industry that does not own the category clears the category
      const next = { ...current, [key]: value };
      if (key === 'industry') {
        const owned = CATEGORIES.filter((category) => category.industrySlug === value).map(
          (category) => category.slug,
        );
        if (next.category && !owned.includes(next.category)) next.category = '';
      }
      return next;
    });
    setErrors((current) => ({ ...current, [key]: '' }));
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

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!values.fullName.trim()) next.fullName = 'Tell us who to reply to.';
    if (!values.companyName.trim()) next.companyName = 'A company name lets us check the market.';
    if (!isEmail(values.email)) next.email = 'A working email address is required.';
    if (values.phone.trim() && values.phone.trim().length < 7) {
      next.phone = 'That does not look like a reachable number.';
    }
    if (values.requirement.trim().length < 30) {
      next.requirement =
        'A little more detail, please — grade, quantity, destination and target Incoterm.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isBot(values as Record<string, string | undefined>)) {
      track('bot_discarded', { form: 'rfq' });
      setSent('nothing'); // say nothing, exactly as if it had worked
      return;
    }
    if (!validate()) {
      focusFirstInvalid(formRef.current);
      return;
    }

    const industry = INDUSTRIES.find((entry) => entry.slug === values.industry);
    const category = CATEGORIES.find((entry) => entry.slug === values.category);
    const serviceSide = prefill.division === 'service-exports' || values.industry === 'technology';

    // The subject line the desk sees: what it is about, then who it is from.
    const about =
      values.product.trim() || category?.name || industry?.name || (serviceSide ? 'Service enquiry' : 'Enquiry');
    const subject = values.companyName.trim()
      ? `RFQ — ${about} — ${values.companyName.trim()}`
      : `RFQ — ${about}`;

    const enquiry: Enquiry = {
      to: serviceSide ? CONTACT.general : CONTACT.sales,
      subject,
      fields: [
        { label: 'Name', value: values.fullName },
        { label: 'Company', value: values.companyName },
        { label: 'Email', value: values.email },
        { label: 'Phone', value: values.phone },
        { label: 'Destination (country / port)', value: values.destination },
        { label: 'Industry', value: industry?.name ?? '' },
        { label: 'Category', value: category?.name ?? '' },
        { label: 'Product or service of interest', value: values.product },
        { label: 'Requirement', value: values.requirement },
        { label: 'How they heard about us', value: referralLabel(values.referral) },
        { label: 'Requested path', value: pathLabel(prefill.path) },
      ],
      footer: `Sent from trivoxagroup.com/rfq · ${new Date().toISOString().slice(0, 10)}`,
    };

    // One seam, one event. Today the transport composes a mailto and the buyer's
    // mail client opens; when a backend exists it returns a reference instead and
    // this component does not change (P21, ADR 037).
    void submitThroughTransport(enquiry, {
      name: 'rfq_compose',
      payload: {
        division: serviceSide ? 'service-exports' : 'product-exports',
        industry: industry?.slug,
        category: category?.slug,
        path: prefill.path ?? undefined,
        destination: values.destination.trim() || undefined,
      },
    }).then((result) => {
      if (result.kind === 'mailto') window.location.href = result.href;
      setSent(result);
    });
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
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-lg">
      <div className="grid grid-cols-12 gap-md">
        <Input
          className="col-span-12 sm:col-span-6"
          label="Full name"
          required
          autoComplete="name"
          value={values.fullName}
          error={errors.fullName}
          onChange={(event) => set('fullName', event.target.value)}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Company"
          required
          autoComplete="organization"
          value={values.companyName}
          error={errors.companyName}
          onChange={(event) => set('companyName', event.target.value)}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => set('email', event.target.value)}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Phone"
          type="tel"
          hint="Optional — include the country code."
          autoComplete="tel"
          value={values.phone}
          error={errors.phone}
          onChange={(event) => set('phone', event.target.value)}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Destination"
          hint="Country, and the port if you know it."
          value={values.destination}
          onChange={(event) => set('destination', event.target.value)}
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
        />
        <Select
          className="col-span-12 sm:col-span-6"
          label="Category"
          options={categoryOptions}
          value={values.category}
          onChange={(event) => set('category', event.target.value)}
        />
        <Input
          className="col-span-12 sm:col-span-6"
          label="Product or service of interest"
          list="rfq-products"
          value={values.product}
          onChange={(event) => set('product', event.target.value)}
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
        error={errors.requirement}
        onChange={(event) => set('requirement', event.target.value)}
      />

      <Select
        label="How did you hear about us?"
        options={REFERRAL_OPTIONS}
        value={values.referral}
        onChange={(event) => set('referral', event.target.value)}
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
        <Button type="submit" size="lg" arrow>
          Send the enquiry
        </Button>
        <Prose className="text-body-sm">
          <p className="surface-muted max-w-[46ch]">
            Opens your mail client with the enquiry formatted for our export desk. Nothing is stored
            on this site.
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
        Enquiry composed
      </Eyebrow>
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-lg max-w-[28ch] rounded-sm">
        {reference
          ? `Enquiry received — reference ${reference}. The desk replies ${CONTACT.responseWindow}.`
          : `Your mail client has the enquiry — send it and the desk replies ${CONTACT.responseWindow}.`}
      </h2>
      <Prose className="text-body-md">
        <p className="surface-muted max-w-[62ch]">
          If nothing opened, use the link below or write to us directly. Either route reaches the
          same three people.
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

function resolveProductName(slug?: string): string {
  if (!slug) return '';
  const product = PRODUCTS.find((entry) => entry.slug === slug);
  return product?.name ?? slug;
}

function referralLabel(value: string): string {
  return REFERRAL_OPTIONS.find((option) => option.value === value)?.label ?? '';
}

function pathLabel(path?: string): string {
  if (path === 'audit') return 'Factory audit';
  if (path === 'sample') return 'Sample request';
  return '';
}
