'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';
import { INQUIRY_TYPES } from '@/content/faqs';
import { track } from '@/lib/analytics/events';
import { focusFirstInvalid } from '@/lib/forms/focus-first-invalid';
import { composeEnquiry, HONEYPOT_FIELD, type Enquiry } from '@/lib/forms/mailto';
import { ContactSubmissionSchema } from '@/lib/forms/schema';
import type { SubmissionResult } from '@/lib/forms/transport';
import { TurnstileWidget } from '@/components/forms/turnstile-widget';

/**
 * P16 — the contact form.
 *
 * This is NOT the RFQ: /rfq is the single commercial conversion and asks for a
 * specification; this one is "how do I reach the right person", and its whole
 * job is routing. The inquiry type selects the mailbox (sales@ for anything
 * with a product in it, careers@ for people, partnerships@ for distributors,
 * hello@ for everything else), so an enquiry does not spend a day being
 * forwarded internally.
 *
 * A phone number is asked for only as a callback number, because we publish no
 * telephone line of our own — see CONTACT.phoneNumbers and ADR 010. Asking for
 * a number we will never call would be the same dishonesty in reverse.
 */

type FormState = {
  inquiryType: string;
  fullName: string;
  companyName: string;
  email: string;
  callback: string;
  message: string;
} & { [K in typeof HONEYPOT_FIELD]: string };

const EMPTY: FormState = {
  inquiryType: INQUIRY_TYPES[0]?.slug ?? '',
  fullName: '',
  companyName: '',
  email: '',
  callback: '',
  message: '',
  [HONEYPOT_FIELD]: '',
};

export function ContactForm() {
  const [mountTime] = useState<number>(() => Date.now());
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const [sent, setSent] = useState<SubmissionResult | 'nothing' | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const set = (key: keyof FormState, value: string): void => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }));
    }
  };

  const selected = INQUIRY_TYPES.find((type) => type.slug === values.inquiryType) ?? INQUIRY_TYPES[0];
  const mailbox = selected ? CONTACT[selected.routesTo] : CONTACT.general;

  const validateField = (field: keyof FormState): void => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const singleParse = ContactSubmissionSchema.shape[field as keyof typeof ContactSubmissionSchema.shape]?.safeParse(
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

  const validateAll = (): boolean => {
    const result = ContactSubmissionSchema.safeParse(values);
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
      track('bot_discarded', { form: 'contact' });
      setSent('nothing');
      return;
    }

    if (!validateAll()) {
      focusFirstInvalid(formRef.current);
      return;
    }

    setIsSubmitting(true);

    const enquiry: Enquiry = {
      to: mailbox,
      subject: `Enquiry — ${selected?.label ?? 'General'}${
        values.companyName.trim() ? ` — ${values.companyName.trim()}` : ''
      }`,
      fields: [
        { label: 'Inquiry type', value: selected?.label ?? '' },
        { label: 'Name', value: values.fullName },
        { label: 'Company', value: values.companyName },
        { label: 'Email', value: values.email },
        { label: 'Callback number', value: values.callback },
        { label: 'Message', value: values.message },
      ],
      footer: `Sent from trivoxagroup.com/contact · ${new Date().toISOString().slice(0, 10)}`,
    };

    const mailtoHref = composeEnquiry(enquiry);
    setFallbackMailto(mailtoHref);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          submittedAt: mountTime,
          turnstileToken,
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

      const reference = outcome.reference || 'TRV-CNT-OK';
      setSent({ kind: 'queued', reference });
      setIsSubmitting(false);

      track('contact_compose', {
        inquiryType: values.inquiryType,
        mailbox,
      });
    } catch {
      setSubmissionError(
        'Network error connecting to the assigned desk. Your typed message has been preserved.',
      );
      setIsSubmitting(false);
    }
  };

  if (sent === 'nothing') return <SentPanel href="" mailbox={mailbox} />;
  if (sent) {
    return (
      <SentPanel
        href={sent.kind === 'mailto' ? sent.href : ''}
        mailbox={mailbox}
        reference={sent.kind === 'queued' ? sent.reference : undefined}
      />
    );
  }

  return (
    <form ref={formRef} onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-lg">
      {submissionError ? (
        <div role="alert" className="border-accent/60 bg-accent/10 flex flex-col gap-sm border p-md text-body-sm">
          <p className="font-medium text-accent">{submissionError}</p>
          {fallbackMailto ? (
            <p className="surface-fg text-body-xs">
              You can send this exact message directly via your email client:{' '}
              <a href={fallbackMailto} className="link-underline font-semibold text-bronze-ink">
                Open formatted email fallback →
              </a>
            </p>
          ) : null}
        </div>
      ) : null}

      <Select
        label="What is this about?"
        required
        options={INQUIRY_TYPES.map((type) => ({ value: type.slug, label: type.label }))}
        value={values.inquiryType}
        onChange={(event) => set('inquiryType', event.target.value)}
        hint={selected?.hint}
        disabled={isSubmitting}
      />

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
          autoComplete="organization"
          value={values.companyName}
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
          label="Callback number"
          type="tel"
          hint="Optional. We publish no line of our own — give us a number and we call you."
          autoComplete="tel"
          value={values.callback}
          error={touched.callback ? errors.callback : undefined}
          onBlur={() => validateField('callback')}
          onChange={(event) => set('callback', event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Textarea
        label="Message"
        required
        rows={6}
        hint="What you need, and by when. If it concerns a shipment, an order reference or a specification helps."
        value={values.message}
        error={touched.message ? errors.message : undefined}
        onBlur={() => validateField('message')}
        onChange={(event) => set('message', event.target.value)}
        disabled={isSubmitting}
      />

      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <Input
          label="Company website URL"
          tabIndex={-1}
          autoComplete="off"
          value={values[HONEYPOT_FIELD]}
          onChange={(event) => set(HONEYPOT_FIELD, event.target.value)}
        />
      </div>

      <TurnstileWidget onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />

      <div className="mt-md flex flex-wrap items-center gap-lg">
        <Button type="submit" size="lg" arrow disabled={isSubmitting} className="max-w-full whitespace-normal break-all sm:break-normal">
          {isSubmitting ? 'Sending to assigned desk...' : `Send to ${mailbox}`}
        </Button>
        <Prose className="text-body-sm">
          <p className="surface-muted max-w-[44ch]">
            The inquiry type routes directly to the assigned desk under our{' '}
            <Link href="/legal/privacy" className="link-underline text-bronze-ink">
              Privacy Policy
            </Link>.
          </p>
        </Prose>
      </div>
    </form>
  );
}

function SentPanel({
  href,
  mailbox,
  reference,
}: {
  href: string;
  mailbox: string;
  reference?: string;
}) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div role="status" className="border-bronze/50 surface-raised flex flex-col gap-md border p-xl">
      <Eyebrow tick={false} className="surface-faint">
        Message received
      </Eyebrow>
      <h2 ref={headingRef} tabIndex={-1} className="text-heading-lg max-w-[30ch] rounded-sm">
        {reference
          ? `Message received — reference ${reference}. We reply ${CONTACT.responseWindow}.`
          : `Your mail client has the message — send it and we reply ${CONTACT.responseWindow}.`}
      </h2>
      <Prose className="text-body-md">
        <p className="surface-muted max-w-[62ch]">
          {reference
            ? `Your enquiry has been delivered to ${mailbox}. A confirmation email has been dispatched to your address. Our team replies within 24 business hours IST.`
            : `If nothing opened, write to ${mailbox} directly. It is read by the same three people who read this form.`}
        </p>
      </Prose>
      <div className="mt-sm flex flex-wrap gap-md">
        {href ? (
          <a href={href} className="link-underline text-bronze-ink text-body-md font-medium">
            Open the message again →
          </a>
        ) : null}
        <a href={`mailto:${mailbox}`} className="link-underline text-bronze-ink text-body-md font-medium">
          {mailbox}
        </a>
      </div>
    </div>
  );
}
