'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { Prose } from '@/components/ui/typography';
import { CONTACT } from '@/content/taxonomy';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [botField, setBotField] = useState('');

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (botField.trim()) {
      setIsSuccess(true);
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())) {
      setError('Please enter a valid business email address.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company_website_url: botField }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || 'Subscription failed. Please email us directly.');
      }
    } catch {
      setError('Connection error. Please write to hello@trivoxagroup.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div role="status" className="flex flex-col gap-xs py-sm">
        <p className="surface-fg text-body-md font-medium">You are on the list.</p>
        <p className="surface-muted text-body-sm">
          We will email you as soon as the first market intelligence piece is published. No spam, ever.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="flex flex-col gap-sm">
      <div className="flex flex-wrap items-start gap-md sm:flex-nowrap">
        <div className="w-full flex-1">
          <Input
            label="Email address"
            type="email"
            placeholder="buyer@example.com"
            value={email}
            error={error}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        <Button type="submit" size="md" arrow disabled={isSubmitting} className="mt-7">
          {isSubmitting ? 'Joining...' : 'Subscribe'}
        </Button>
      </div>

      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <input
          tabIndex={-1}
          autoComplete="off"
          value={botField}
          onChange={(e) => setBotField(e.target.value)}
        />
      </div>

      <Prose className="text-body-xs">
        <p className="surface-faint">
          Sent directly from Surat. We process your email under our{' '}
          <Link href="/legal/privacy" className="link-underline text-bronze-ink">
            Privacy Policy
          </Link>.
        </p>
      </Prose>
    </form>
  );
}
