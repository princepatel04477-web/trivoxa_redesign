import fs from 'node:fs';
import path from 'node:path';
import Image from 'next/image';
import { Parallax } from '@/components/motion/parallax';
import { Container, Section } from '@/components/ui/layout';
import { Eyebrow, Prose, SectionHeading } from '@/components/ui/typography';
import { FOUNDATION_PHOTOS } from '@/content/company';

/**
 * P11 — the manufacturing foundation, photographed.
 *
 * This is the section that makes the parent-company claim tangible, so it is
 * gated on the photographs actually existing. `fs.existsSync` runs at build
 * time: if a file is missing the slot renders a designed pending card naming
 * exactly what is expected and where to drop it. Stock imagery of "a textile
 * mill" would be the single fastest way to destroy the credibility this page
 * exists to build.
 *
 * Drop path: `public/images/foundation/{exterior,weaving,inspection}.jpg`
 */
const DIR = path.join(process.cwd(), 'public', 'images', 'foundation');
const EXTENSIONS = ['.jpg', '.jpeg', '.webp'] as const;

function resolve(slug: string): string | null {
  for (const extension of EXTENSIONS) {
    if (fs.existsSync(path.join(DIR, `${slug}${extension}`))) return `${slug}${extension}`;
  }
  return null;
}

export function GroupFoundation() {
  const photos = FOUNDATION_PHOTOS.map((photo) => ({ ...photo, file: resolve(photo.slug) }));
  const available = photos.filter((photo) => photo.file !== null).length;

  return (
    <Section surface="deep" id="foundation">
      <Container>
        <SectionHeading
          eyebrow="The Foundation"
          title="The mill behind every specification."
          lede="Woven textile production in Surat, decades deep. These are our own photographs — the mill, the weaving floor and the inspection table — not stock imagery."
        />

        <div className="mt-3xl grid grid-cols-12 gap-md">
          {photos.map((photo, index) => (
            <figure
              key={photo.slug}
              className={`col-span-12 flex flex-col gap-sm md:col-span-4 ${
                index === 0 ? 'md:mt-0' : index === 1 ? 'md:mt-xl' : 'md:mt-2xl'
              }`}
            >
              {photo.file ? (
                <Parallax travel={index === 1 ? 0.1 : 0.06}>
                  <div className="relative aspect-4/5 w-full overflow-hidden">
                    <Image
                      src={`/images/foundation/${photo.file}`}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Parallax>
              ) : (
                <div className="surface-raised surface-hairline relative flex aspect-4/5 w-full flex-col justify-between border p-lg">
                  <Eyebrow tick={false} className="surface-faint">
                    Photograph pending
                  </Eyebrow>
                  <div className="flex flex-col gap-xs">
                    <p className="surface-faint spec-value text-body-sm" data-spec>
                      /images/foundation/{photo.slug}.jpg
                    </p>
                    <p className="surface-muted text-body-sm">
                      Awaiting original photography from Shiveshwar Textiles.
                    </p>
                  </div>
                </div>
              )}

              <figcaption className="surface-muted text-body-sm">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>

        {available < photos.length ? (
          <Prose className="surface-faint mt-2xl max-w-[70ch] text-body-sm">
            <p>
              {photos.length - available} of {photos.length} foundation photographs are still
              pending. We would rather show the gap than fill it with an image that is not ours.
            </p>
          </Prose>
        ) : null}
      </Container>
    </Section>
  );
}
