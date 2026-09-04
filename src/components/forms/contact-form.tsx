'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/field';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';
import { INQUIRY_TYPES } from '@/content/faqs';
import { HONEYPOT_FIELD, composeEnquiry, isBot, isEmail } from '@/lib/forms/mailto';

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
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  const set = (key: keyof FormState, value: string): void => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const selected = INQUIRY_TYPES.find((type) => type.slug === values.inquiryType) ?? INQUIRY_TYPES[0];
  const mailbox = selected ? CONTACT[selected.routesTo] : CONTACT.general;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isBot(values as Record<string, string | undefined>)) {
      setSent('nothing');
      return;
    }

    const next: Record<string, string> = {};
    if (!values.fullName.trim()) next.fullName = 'Tell us who to reply to.';
    if (!isEmail(values.email)) next.email = 'A working email address is required.';
    if (values.message.trim().length < 20) next.message = 'A sentence or two about what you need.';
    if (values.callback.trim() && values.callback.trim().length < 7) {
      next.callback = 'That does not look like a reachable number.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const href = composeEnquiry({
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
    });

    window.location.href = href;
    setSent(href);
  };

  if (sent === 'nothing') return <SentPanel href="" mailbox={mailbox} />;
  if (sent) return <SentPanel href={sent} mailbox={mailbox} />;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-lg">
      <Select
        label="What is this about?"
        required
        options={INQUIRY_TYPES.map((type) => ({ value: type.slug, label: type.label }))}
        value={values.inquiryType}
        onChange={(event) => set('inquiryType', event.target.value)}
        hint={selected?.hint}
      />

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
          autoComplete="organization"
          value={values.companyName}
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
          label="Callback number"
          type="tel"
          hint="Optional. We publish no line of our own — give us a number and we call you."
          autoComplete="tel"
          value={values.callback}
          error={errors.callback}
          onChange={(event) => set('callback', event.target.value)}
        />
      </div>

      <Textarea
        label="Message"
        required
        rows={6}
        hint="What you need, and by when. If it concerns a shipment, an order reference or a specification helps."
        value={values.message}
        error={errors.message}
        onChange={(event) => set('message', event.target.value)}
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

      <div className="mt-md flex flex-wrap items-center gap-lg">
        <Button type="submit" size="lg" arrow>
          Send to {mailbox}
        </Button>
        <Prose className="text-body-sm">
          <p className="surface-muted max-w-[44ch]">
            The inquiry type decides which mailbox this reaches. Nothing is stored on this site.
          </p>
        </Prose>
      </div>
    </form>
  );
}

function SentPanel({ href, mailbox }: { href: string; mailbox: string }) {
  return (
    <div className="border-bronze/50 surface-raised flex flex-col gap-md border p-xl">
      <Eyebrow tick={false} className="surface-faint">
        Message composed
      </Eyebrow>
      <h2 className="text-heading-lg max-w-[30ch]">
        Your mail client has the message — send it and we reply {CONTACT.responseWindow}.
      </h2>
      <Prose className="text-body-md">
        <p className="surface-muted max-w-[62ch]">
          If nothing opened, write to {mailbox} directly. It is read by the same three people who
          read this form.
        </p>
      </Prose>
      <div className="mt-sm flex flex-wrap gap-md">
        {href ? (
          <a href={href} className="link-underline text-bronze text-body-md font-medium">
            Open the message again →
          </a>
        ) : null}
        <a href={`mailto:${mailbox}`} className="link-underline text-bronze text-body-md font-medium">
          {mailbox}
        </a>
      </div>
    </div>
  );
}
