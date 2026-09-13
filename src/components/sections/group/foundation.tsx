import { Parallax } from '@/components/motion/parallax';
import { SmartImage } from '@/components/ui/smart-image';
import { Container, Section } from '@/components/ui/layout';
import { Prose, SectionHeading } from '@/components/ui/typography';
import { FOUNDATION_PHOTOS } from '@/content/company';
import { resolveImageFile } from '@/content/images';

/**
 * P11 — The manufacturing foundation, photographed.
 *
 * Built on typed image manifest and SmartImage pipeline:
 *  - Renders designed PendingPhotograph placeholders with 4:5 aspect ratio boxes;
 *  - Automatically upgrades to next/image when files are dropped into `public/images/foundation/`;
 *  - Zero CLS on swap.
 */
export function GroupFoundation() {
  const photoStatuses = FOUNDATION_PHOTOS.map((photo) => ({
    ...photo,
    resolved: resolveImageFile(`foundation-${photo.slug}`),
  }));

  const available = photoStatuses.filter((p) => p.resolved.exists).length;

  return (
    <Section surface="deep" id="foundation" className="scroll-mt-24">
      <Container>
        <SectionHeading
          eyebrow="The Foundation"
          title="The mill behind every specification."
          lede="Woven textile production in Surat, decades deep. These are our own photographs — the mill, the weaving floor and the inspection table — not stock imagery."
        />

        <div className="mt-3xl grid grid-cols-12 gap-md">
          {photoStatuses.map((photo, index) => (
            <div
              key={photo.slug}
              className={`col-span-12 md:col-span-4 ${
                index === 0 ? 'md:mt-0' : index === 1 ? 'md:mt-xl' : 'md:mt-2xl'
              }`}
            >
              <Parallax travel={index === 1 ? 0.08 : 0.04}>
                <SmartImage
                  manifestId={`foundation-${photo.slug}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </Parallax>
            </div>
          ))}
        </div>

        {available < photoStatuses.length ? (
          <Prose className="surface-faint mt-2xl max-w-[70ch] text-body-sm">
            <p>
              {photoStatuses.length - available} of {photoStatuses.length} foundation photographs are still
              pending. We would rather show the gap than fill it with an image that is not ours.
            </p>
          </Prose>
        ) : null}
      </Container>
    </Section>
  );
}

