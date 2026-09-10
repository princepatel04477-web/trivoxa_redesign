'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export type AccordionItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

/**
 * Accordion — used by the Contact FAQ and the compliance detail lists.
 *
 * Full keyboard support: each trigger is a real <button> with aria-expanded
 * and aria-controls; the panel is a region labelled by its trigger. Height
 * animates on the house curve; under prefers-reduced-motion Motion collapses
 * the animation to an instant show/hide.
 */
export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}) {
  const uid = useId();
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string): void => {
    setOpen((current) => {
      const isOpen = current.includes(id);
      if (allowMultiple) {
        return isOpen ? current.filter((x) => x !== id) : [...current, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const isOpen = open.includes(item.id);
        const panelId = `${uid}-panel-${item.id}`;
        const triggerId = `${uid}-trigger-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn('surface-hairline border-b', index === 0 && 'border-t')}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  'surface-fg group flex w-full items-center justify-between gap-lg py-lg text-left',
                  'text-heading-md font-display transition-colors duration-fast ease-house',
                  'hover:text-accent',
                )}
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    'relative size-4 shrink-0 transition-transform duration-fast ease-house',
                    isOpen && 'rotate-45',
                  )}
                >
                  <span className="bg-current absolute top-1/2 left-0 h-px w-full -translate-y-1/2" />
                  <span className="bg-current absolute top-0 left-1/2 h-full w-px -translate-x-1/2" />
                </span>
              </button>
            </h3>

            {/* Height animation without a library (P20): grid-template-rows
                0fr -> 1fr transitions to auto height, and `inert` keeps a
                closed panel out of the tab order and the a11y tree. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              inert={!isOpen}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-base ease-[var(--ease-house)] ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div>
                <div className="surface-muted pb-lg text-body-md [&_p+p]:mt-md">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
