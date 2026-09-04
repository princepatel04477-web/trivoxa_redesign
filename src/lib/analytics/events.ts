/**
 * src/lib/analytics/events.ts — analytics-READY, not analytics-installed (P21).
 * ---------------------------------------------------------------------------
 * There is no analytics provider in this repository and no third-party script on
 * any page: that is a deliberate privacy position, stated in the cookie notice,
 * and it is also why the events live behind a typed bus rather than being
 * `gtag(...)` calls sprinkled through components.
 *
 * What exists:
 *  · `track()` — one typed call per commercial event, with a payload shape the
 *    compiler checks. Components never touch a vendor API.
 *  · a `window` CustomEvent (`trivoxa:analytics`) — so whatever is adopted next
 *    (GA4, Plausible, a server action writing to a database, first-party logs)
 *    subscribes in exactly one place and cannot drift from the event names;
 *  · an opt-in debug sink (`NEXT_PUBLIC_ANALYTICS_DEBUG=1`) that logs to the
 *    console in development.
 *
 * Nothing leaves the browser today. When a provider is added, the honest
 * sentence in the cookie notice has to change with it — see docs/DECISIONS.md.
 */

export type AnalyticsEventMap = {
  /** An RFQ was composed and handed to the buyer's mail client. */
  rfq_compose: {
    division?: string;
    industry?: string;
    category?: string;
    path?: string;
    destination?: string;
  };
  /** A contact enquiry was composed. */
  contact_compose: { inquiryType?: string; mailbox?: string };
  /** A catalogue category filter was applied. */
  catalog_filter: { category: string; visibleRows: number };
  /** An RFQ call-to-action was followed, with the route it was on. */
  rfq_cta_click: { from: string; placement?: string };
  /** A buyer asked for a callback instead of an email exchange. */
  callback_request: { from: string };
  /** A factory-audit request was started from the compliance register. */
  audit_request: { from: string };
  /** A honeypot was filled. Counted, never submitted, never surfaced. */
  bot_discarded: { form: 'rfq' | 'contact' };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;

export type AnalyticsEvent<N extends AnalyticsEventName = AnalyticsEventName> = {
  name: N;
  payload: AnalyticsEventMap[N];
  /** Milliseconds since navigation start, so timing analysis needs no vendor. */
  at: number;
};

type Listener = (event: AnalyticsEvent) => void;

const listeners = new Set<Listener>();

/** Subscribe a sink. Returns its own unsubscribe — used by the window bridge. */
export function onAnalyticsEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function track<N extends AnalyticsEventName>(name: N, payload: AnalyticsEventMap[N]): void {
  const event: AnalyticsEvent<N> = {
    name,
    payload,
    at: typeof performance === 'undefined' ? 0 : Math.round(performance.now()),
  };

  for (const listener of listeners) listener(event as AnalyticsEvent);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trivoxa:analytics', { detail: event }));
  }

  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === '1') {
    console.debug('[analytics]', name, payload);
  }
}

/** Every event name, for tests and for whoever wires the first real sink. */
export const ANALYTICS_EVENTS = [
  'rfq_compose',
  'contact_compose',
  'catalog_filter',
  'rfq_cta_click',
  'callback_request',
  'audit_request',
  'bot_discarded',
] as const satisfies readonly AnalyticsEventName[];
