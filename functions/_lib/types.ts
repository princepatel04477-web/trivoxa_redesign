/**
 * Minimal Cloudflare Pages Functions context type — hand-rolled instead of
 * depending on `@cloudflare/workers-types` so `functions/` stays a
 * zero-dependency addition. Matches the shape Cloudflare actually invokes
 * (https://developers.cloudflare.com/pages/functions/api-reference/), and
 * mirrors the inline interface `functions/_middleware.ts` already used for
 * the same reason.
 */
export interface Env {
  RESEND_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export interface FunctionContext<E = Env> {
  request: Request;
  env: E;
  params: Record<string, string>;
  waitUntil(promise: Promise<unknown>): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
}
