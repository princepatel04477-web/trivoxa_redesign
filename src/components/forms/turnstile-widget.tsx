'use client';

import { useEffect, useId, useRef } from 'react';

/**
 * Cloudflare Turnstile, explicit-render mode. Renders nothing when
 * `NEXT_PUBLIC_TURNSTILE_SITE_KEY` isn't set at build time — server-side
 * verification (`verifyTurnstileToken`) fails open in exactly that case, so
 * the two are meant to be turned on together (see src/lib/turnstile.ts).
 */

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function TurnstileWidget({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const reactId = useId();

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: (token: string) => onVerify(token),
          'expired-callback': () => onExpire?.(),
          theme: 'auto',
          size: 'flexible',
        });
      })
      .catch(() => {
        // No widget, no token — the server-side check fails closed only when
        // TURNSTILE_SECRET_KEY is set, which implies this script was expected
        // to load; a transient CDN failure degrades to "unverified", not a
        // crash.
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, [onVerify, onExpire]);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} id={`turnstile-${reactId}`} className="cf-turnstile" />;
}
