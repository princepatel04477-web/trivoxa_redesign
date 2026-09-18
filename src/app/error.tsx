'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/ui/brand-lockup';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <Section surface="deep" className="flex min-h-screen items-center">
      <Container>
        <div className="flex max-w-[42rem] flex-col gap-lg">
          <BrandMark size={56} className="text-accent" />
          <Eyebrow>System Notice</Eyebrow>
          <h1 className="text-display-lg">Something interrupted this view.</h1>
          <p className="surface-muted text-body-lg">
            We encountered a temporary display or connectivity issue while loading this page.
          </p>

          <div className="mt-md flex flex-wrap items-center gap-md">
            <Button variant="primary" onClick={() => reset()}>
              Try again
            </Button>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-ivory/20 rounded-md text-body-sm text-ivory hover:border-ivory/40 transition-colors"
            >
              Return home
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
