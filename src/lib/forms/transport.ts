/**
 * src/lib/forms/transport.ts — the shape of "what happened when a buyer hit
 * submit" (P21, closed).
 * ---------------------------------------------------------------------------
 * The RFQ, contact and newsletter forms POST to Cloudflare Pages Functions
 * under `/functions/api/*` (persisted to Supabase, notified via Resend), with
 * a `mailto:` composed as a client-side fallback if that request fails — see
 * each form's `onSubmit` for the actual fetch-with-fallback logic.
 *
 * `SubmissionResult` is the one thing kept here: the union both forms' `sent`
 * state is typed against, so a `mailto` result ("your mail client has this,
 * nothing was stored") and a `queued` result ("we accepted it, here is a
 * reference") stay two different sentences in the UI rather than collapsing
 * into one generic "thanks!".
 */

export type SubmissionResult =
  /** Composed locally; the buyer's mail client sends it. Nothing was stored. */
  | { kind: 'mailto'; href: string }
  /** Accepted by /functions/api/*. Persisted and notified. */
  | { kind: 'queued'; reference: string };
