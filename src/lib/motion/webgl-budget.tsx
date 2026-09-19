'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePerfTier } from '@/lib/perf-tier';

/**
 * WebGL budget — at most MAX_WEBGL_CANVASES live canvases across the page.
 *
 * The slot table lives in a ref-backed store, NOT in React state. Holding it in
 * state made `requestSlot` / `releaseSlot` change identity on every slot change;
 * every consumer's effect depends on them, so each grant re-ran every effect,
 * which released and re-requested every slot, which re-rendered the provider…
 * a permanent mount/unmount thrash of the WebGL canvases. The store below has
 * stable functions and only notifies the components whose answer can change.
 */
interface WebGLBudgetStore {
  requestSlot: (id: string) => boolean;
  releaseSlot: (id: string) => void;
  /** Called whenever a slot frees up, so waiting canvases can retry. */
  subscribe: (listener: () => void) => () => void;
}

const MAX_WEBGL_CANVASES = 2;

function createStore(): WebGLBudgetStore {
  const active = new Set<string>();
  const listeners = new Set<() => void>();

  return {
    requestSlot(id) {
      if (active.has(id)) return true;
      if (active.size < MAX_WEBGL_CANVASES) {
        active.add(id);
        return true;
      }
      return false;
    },
    releaseSlot(id) {
      if (!active.delete(id)) return;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

// Used when a component renders outside the provider (tests, isolated stories).
const fallbackStore = createStore();
const WebGLBudgetContext = createContext<WebGLBudgetStore>(fallbackStore);

export function WebGLBudgetProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<WebGLBudgetStore | null>(null);
  if (!storeRef.current) storeRef.current = createStore();
  return (
    <WebGLBudgetContext.Provider value={storeRef.current}>{children}</WebGLBudgetContext.Provider>
  );
}

/**
 * Hook to request one of the MAX 2 live WebGL slots.
 * With an element ref it claims a slot while the element is within 200px of the
 * viewport and releases it when scrolled away. If the budget is full it retries
 * as soon as another canvas releases.
 */
export function useWebGLSlot(
  customId?: string,
  elementRef?: React.RefObject<HTMLElement | null>
) {
  const autoId = useId();
  const id = customId || autoId;
  const store = useContext(WebGLBudgetContext);
  const canUseWebGL = usePerfTier() !== 'low';
  const [hasSlot, setHasSlot] = useState(false);

  useEffect(() => {
    // Low-tier devices (few cores, little memory, slow/saver network) never get
    // a canvas — they keep the designed CSS fallback.
    if (!canUseWebGL) {
      setHasSlot(false);
      return;
    }
    const el = elementRef?.current;

    // No element to observe (or no IntersectionObserver): claim while mounted.
    if (!el || typeof IntersectionObserver === 'undefined') {
      setHasSlot(store.requestSlot(id));
      const unsubscribe = store.subscribe(() => setHasSlot(store.requestSlot(id)));
      return () => {
        unsubscribe();
        store.releaseSlot(id);
      };
    }

    let wantsSlot = false;
    const sync = () => setHasSlot(wantsSlot ? store.requestSlot(id) : false);

    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1];
        if (!last) return;
        wantsSlot = last.isIntersecting;
        if (!wantsSlot) store.releaseSlot(id);
        sync();
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);

    // A slot freed elsewhere — retry if this canvas is on screen and was denied.
    const unsubscribe = store.subscribe(() => {
      if (wantsSlot) sync();
    });

    return () => {
      observer.disconnect();
      unsubscribe();
      store.releaseSlot(id);
    };
  }, [id, store, elementRef, canUseWebGL]);

  return useMemo(
    () => ({
      hasSlot,
      releaseSlot: () => store.releaseSlot(id),
    }),
    [hasSlot, store, id]
  );
}
