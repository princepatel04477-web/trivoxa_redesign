export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * A submission arriving implausibly fast after the form mounted is almost
 * certainly a script, not a buyer reading fields. `submittedAt` is the
 * client's `Date.now()` at mount, sent back unchanged; comparing it against
 * server time needs no storage and no extra request.
 */
export function isTimeTrapTripped(submittedAt: number | undefined): boolean {
  if (typeof submittedAt !== 'number' || !Number.isFinite(submittedAt)) return false;
  const elapsed = Date.now() - submittedAt;
  return elapsed >= 0 && elapsed < 1200;
}

/**
 * A bot that clears the trap either submits an honest-looking request (in
 * which case the honeypot/Turnstile checks upstream already caught it) or
 * gets silently accepted here with the same `ok: true` shape a real
 * submission gets — same reasoning as the honeypot: never give a scraper a
 * signal to correct against.
 */
export function quietlyAccepted(reference: string) {
  return json({ ok: true, reference }, 200);
}
