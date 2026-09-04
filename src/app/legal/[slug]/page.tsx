import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocumentView } from '@/components/sections/legal-document';
import { LEGAL_DOCUMENTS } from '@/content/legal';

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCUMENTS).map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const document = LEGAL_DOCUMENTS[slug];
  if (!document) return {};

  return {
    title: document.title,
    description: document.summary,
    alternates: { canonical: `/legal/${document.slug}` },
  };
}

/**
 * P17 — /legal/[slug]: privacy, terms, cookies and anti-corruption.
 *
 * One route, four documents, all of them data (src/content/legal.ts) rather
 * than four hand-written pages that would drift from each other the first time
 * an address or a retention period changed.
 */
export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const document = LEGAL_DOCUMENTS[slug];
  if (!document) notFound();

  return <LegalDocumentView document={document} />;
}
