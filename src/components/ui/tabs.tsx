'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TabItem = {
  id: string;
  label: string;
  panel: ReactNode;
};

/**
 * Tabs with a proper roving tabindex and Home/End/arrow support — the audit's
 * P20 list calls tabs out for keyboard verification, so the pattern is
 * implemented once, correctly, here.
 *
 * Visual: a 1px hairline rail with a bronze indicator under the active tab.
 */
export function Tabs({ items, defaultId, className }: { items: TabItem[]; defaultId?: string; className?: string }) {
  const [active, setActive] = useState<string>(defaultId ?? items[0]?.id ?? '');
  const listRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const ids = items.map((item) => item.id);
    const index = ids.indexOf(active);
    let next = -1;

    if (event.key === 'ArrowRight') next = (index + 1) % ids.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + ids.length) % ids.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = ids.length - 1;
    if (next === -1) return;

    event.preventDefault();
    const id = ids[next];
    if (!id) return;
    setActive(id);
    listRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${id}"]`)?.focus();
  };

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="surface-hairline flex gap-lg overflow-x-auto border-b"
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-tab={item.id}
              id={`tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`tabpanel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              className={cn(
                'relative shrink-0 px-1 py-3 text-body-md font-medium whitespace-nowrap',
                'transition-colors duration-fast ease-house',
                selected ? 'surface-fg' : 'surface-muted hover:surface-fg',
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  'bg-bronze absolute inset-x-0 -bottom-px h-0.5 transition-transform duration-fast ease-house',
                  selected ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`tabpanel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={item.id !== active}
          className="pt-lg"
        >
          {item.panel}
        </div>
      ))}
    </div>
  );
}
