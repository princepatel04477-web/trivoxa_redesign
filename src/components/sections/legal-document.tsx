import { PageHero } from '@/components/sections/page-hero';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose } from '@/components/ui/typography';
import { ArrowLink } from '@/components/ui/link';
import { CONTACT } from '@/content/taxonomy';
import type { LegalDocument } from '@/content/legal';

/**
 * P17 — one renderer for all four legal documents.
 *
 * Two things a legal page usually gets wrong and this one does not:
 *  · the review status is ON the page, not in a changelog. A privacy policy
 *    that has not been read by counsel says so, in bronze, above the fold;
 *  · there is a contents rail, because a buyer's legal reviewer is scanning for
 *    three headings, not reading nine sections in order.
 */
export function LegalDocumentView({ document }: { document: LegalDocument }) {
  const anchors = document.sections.map((section, index) => ({
    id: `section-${index + 1}`,
    heading: section.heading,
  }));

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={document.title}
        lede={document.summary}
        trail={[
          { href: '/', label: 'Home' },
          { href: `/legal/${document.slug}`, label: document.title },
        ]}
        meta={[
          { label: 'Last updated', value: document.updated },
          {
            label: 'Review status',
            value: document.reviewStatus === 'counsel-approved' ? 'Counsel approved' : 'Internal review',
          },
          { label: 'Questions to', value: CONTACT.general },
        ]}
      />

      <Section surface="light" className="pt-0">
        <Container>
          <div className="grid grid-cols-12 gap-2xl">
            <nav aria-label="Contents" className="col-span-12 lg:col-span-3">
              <div className="lg:sticky lg:top-[120px]">
                <Eyebrow tick={false} className="surface-faint">
                  On this page
                </Eyebrow>
                <ol className="surface-hairline mt-md flex flex-col border-t">
                  {anchors.map((anchor, index) => (
                    <li key={anchor.id} className="surface-hairline border-b">
                      <a
                        href={`#${anchor.id}`}
                        className="surface-muted hover:text-bronze-ink flex items-baseline gap-md py-md text-body-sm transition-colors duration-fast ease-house"
                      >
                        <span className="surface-faint spec-value" data-spec>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {anchor.heading}
                      </a>
                    </li>
                  ))}
                </ol>

                {document.reviewStatus === 'internal-review' ? (
                  <p className="border-bronze/40 surface-muted mt-xl border-l-2 pl-md text-body-sm">
                    Under internal review — not yet read by counsel. It states what this site
                    actually does today.
                  </p>
                ) : null}
              </div>
            </nav>

            <div className="col-span-12 lg:col-span-9">
              {document.sections.map((section, index) => (
                <section
                  key={section.heading}
                  id={anchors[index]?.id}
                  className="surface-hairline scroll-mt-[120px] border-t py-2xl first:border-t-0 first:pt-0"
                >
                  <h2 className="text-heading-lg max-w-[30ch]">{section.heading}</h2>

                  {section.paragraphs.length > 0 ? (
                    <Prose className="mt-lg max-w-[74ch] text-body-md">
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="surface-muted">
                          {paragraph}
                        </p>
                      ))}
                    </Prose>
                  ) : null}

                  {section.list.length > 0 ? (
                    <ul className="mt-lg flex max-w-[74ch] flex-col gap-sm">
                      {section.list.map((item) => (
                        <li key={item.slice(0, 40)} className="surface-muted text-body-md flex items-start gap-md">
                          <span aria-hidden className="bg-bronze mt-2.5 size-1 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              <div className="surface-raised surface-hairline mt-2xl flex flex-wrap items-center justify-between gap-lg border p-lg">
                <p className="surface-muted text-body-sm max-w-[54ch]">
                  Questions about this document go to {CONTACT.general}, marked for the attention of
                  the Managing Director.
                </p>
                <ArrowLink href="/contact">Contact the group</ArrowLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
