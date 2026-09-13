import Image from 'next/image';
import { IMAGE_MANIFEST, resolveImageFile, type ImageManifestEntry } from '@/content/images';
import { PendingPhotograph } from '@/components/ui/pending-photograph';
import { cn } from '@/lib/utils';

export interface SmartImageProps {
  manifestId: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showCaption?: boolean;
}

/**
 * P11 — Zero-CLS SmartImage pipeline.
 *
 * Automatically checks whether the required photograph has been placed into `public/images/`.
 *  - If present: renders optimized `next/image` inside the exact aspect ratio container;
 *  - If absent: renders intentional, styled `PendingPhotograph` placeholder.
 *
 * Switching between states requires 0 component changes — simply dropping the file
 * into `public/images/...` activates the photograph on next build with zero layout shift.
 */
export function SmartImage({
  manifestId,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  showCaption = true,
}: SmartImageProps) {
  const { exists, entry, resolvedPath } = resolveImageFile(manifestId);

  if (!entry) {
    return null;
  }

  if (exists && resolvedPath) {
    return (
      <figure className="flex flex-col gap-xs w-full">
        <div
          className={cn(
            'surface-hairline relative w-full overflow-hidden border',
            entry.aspectRatioClass,
            className,
          )}
        >
          <Image
            src={resolvedPath}
            alt={entry.alt}
            fill
            sizes={sizes}
            priority={priority || entry.priority}
            className="object-cover transition-transform duration-slow ease-house hover:scale-[1.02]"
          />
        </div>
        {showCaption && entry.caption ? (
          <figcaption className="surface-muted text-body-xs mt-1">{entry.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <PendingPhotograph
      entry={entry}
      className={className}
      showCaption={showCaption}
    />
  );
}
