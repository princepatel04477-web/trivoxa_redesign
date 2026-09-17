'use client';

import React, { createContext, useContext, useEffect, useState, useId, type ReactNode } from 'react';

interface WebGLBudgetContextType {
  requestSlot: (id: string) => boolean;
  releaseSlot: (id: string) => void;
  activeCount: number;
}

const WebGLBudgetContext = createContext<WebGLBudgetContextType>({
  requestSlot: () => true,
  releaseSlot: () => {},
  activeCount: 0,
});

const MAX_WEBGL_CANVASES = 2;

export function WebGLBudgetProvider({ children }: { children: ReactNode }) {
  const [activeSlots, setActiveSlots] = useState<Set<string>>(() => new Set());

  const requestSlot = (id: string): boolean => {
    if (activeSlots.has(id)) return true;
    if (activeSlots.size < MAX_WEBGL_CANVASES) {
      setActiveSlots((prev) => new Set(prev).add(id));
      return true;
    }
    return false;
  };

  const releaseSlot = (id: string): void => {
    setActiveSlots((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <WebGLBudgetContext.Provider
      value={{
        requestSlot,
        releaseSlot,
        activeCount: activeSlots.size,
      }}
    >
      {children}
    </WebGLBudgetContext.Provider>
  );
}

/**
 * Hook to request one of the MAX 2 live WebGL slots.
 * Coordinates with an element ref to automatically claim slot when in viewport (rootMargin 200px)
 * and release when scrolled out.
 */
export function useWebGLSlot(customId?: string) {
  const autoId = useId();
  const id = customId || autoId;
  const { requestSlot, releaseSlot } = useContext(WebGLBudgetContext);
  const [hasSlot, setHasSlot] = useState(false);

  useEffect(() => {
    return () => {
      releaseSlot(id);
    };
  }, [id, releaseSlot]);

  const observeElement = (el: HTMLElement | null) => {
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const granted = requestSlot(id);
            setHasSlot(granted);
          } else {
            releaseSlot(id);
            setHasSlot(false);
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  };

  return { hasSlot, observeElement, releaseSlot: () => releaseSlot(id) };
}
