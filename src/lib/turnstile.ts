/**
 * Cloudflare Turnstile verification helper.
 * Validates token server-side via Cloudflare endpoint.
 * Fails open if secret key is not configured (e.g. local dev / test).
 */
export async function verifyTurnstileToken(token?: string, remoteIp?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // Graceful bypass in development / testing when secret is not configured
    return true;
  }
  if (!token) {
    return false;
  }

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
