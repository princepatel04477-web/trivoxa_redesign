/**
 * Cloudflare Turnstile verification helper.
 * Validates token server-side via Cloudflare's siteverify endpoint.
 *
 * Fails open when no secret is configured (local dev, or before the site adds
 * a Turnstile widget) — the honeypot field still screens obvious bots. Once a
 * secret IS configured, a missing/invalid token is rejected: that only starts
 * mattering once `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is also set and the widget
 * renders, so the two keys are meant to be turned on together.
 *
 * Takes the secret explicitly rather than reading `process.env` itself —
 * this runs inside a Cloudflare Pages Function (Workers runtime), which has
 * no `process.env`; the caller reads it from `context.env`.
 */
export async function verifyTurnstileToken(
  token: string | undefined,
  secretKey: string | undefined,
  remoteIp?: string,
): Promise<boolean> {
  if (!secretKey) return true;
  if (!token) return false;

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) return false;
    const outcome = (await response.json()) as { success?: boolean };
    return Boolean(outcome.success);
  } catch {
    return false;
  }
}
