import { Eyebrow } from '@/components/ui/typography';
import type { ImageManifestEntry } from '@/content/images';
import { cn } from '@/lib/utils';

export interface PendingPhotographProps {
  entry: ImageManifestEntry;
  className?: string;
  showCaption?: boolean;
}

/**
 * P11 — The typed PendingPhotograph component.
 *
 * Renders an intentional, architectural placeholder in Trivoxa's brand language:
 *  - Fixed aspect ratio box (zero CLS when the real photograph is dropped in);
 *  - Hairline border with subtle bronze corner accents;
 *  - Geist Mono expected file path and shoot dimensions;
 *  - Labeled as a placeholder region for assistive tech (not a broken img tag).
 */
export function PendingPhotograph({
  entry,
  className,
  showCaption = true,
}: PendingPhotographProps) {
  return (
    <figure className="flex flex-col gap-xs w-full">
      <div
        role="region"
        aria-label={`Photograph placeholder for ${entry.subject}`}
        className={cn(
          'surface-raised surface-hairline relative flex w-full flex-col justify-between border p-lg overflow-hidden transition-colors duration-fast',
          entry.aspectRatioClass,
          className,
        )}
      >
        {/* Architectural corner tick marks */}
        <span
          aria-hidden
          className="absolute top-2 left-2 h-2 w-2 border-t border-l border-bronze/60 pointer-events-none"
        />
        <span
          aria-hidden
          className="absolute top-2 right-2 h-2 w-2 border-t border-r border-bronze/60 pointer-events-none"
        />
        <span
          aria-hidden
          className="absolute bottom-2 left-2 h-2 w-2 border-b border-l border-bronze/60 pointer-events-none"
        />
        <span
          aria-hidden
          className="absolute bottom-2 right-2 h-2 w-2 border-b border-r border-bronze/60 pointer-events-none"
        />

        {/* Top bar: Status indicator */}
        <div className="flex items-center justify-between gap-md z-10">
          <Eyebrow tick={false} className="surface-faint text-body-xs uppercase tracking-wider">
            Photograph pending
          </Eyebrow>
          <span className="surface-faint spec-value text-body-xs font-mono" data-spec>
            {entry.aspectRatio}
          </span>
        </div>

        {/* Center: Technical watermark / subtle crosshair icon */}
        <div className="flex flex-col items-center justify-center my-auto py-md text-center z-10">
          <div className="h-10 w-10 border border-bronze/30 rounded-full flex items-center justify-center mb-sm bg-espresso/5">
            <svg
              className="h-5 w-5 text-bronze/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="surface-fg text-body-sm font-medium">{entry.subject}</p>
          {entry.specHint ? (
            <p className="surface-faint spec-value text-body-xs mt-1" data-spec>
              {entry.specHint}
            </p>
          ) : null}
        </div>

        {/* Bottom bar: Expected path & attribution */}
        <div className="flex flex-col gap-xs z-10 border-t surface-hairline pt-sm">
          <p className="surface-faint spec-value text-body-xs font-mono truncate" data-spec>
            {entry.expectedPath}
          </p>
          <p className="surface-muted text-body-xs">
            {entry.credit
              ? `Awaiting original photography from ${entry.credit}.`
              : 'Awaiting original on-site photography.'}
          </p>
        </div>
      </div>

      {showCaption && entry.caption ? (
        <figcaption className="surface-muted text-body-xs mt-1">{entry.caption}</figcaption>
      ) : null}
    </figure>
  );
}
