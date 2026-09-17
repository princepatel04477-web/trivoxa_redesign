import { NewsletterSubmissionSchema, HONEYPOT_FIELD } from '../../src/lib/forms/schema';
import { persistNewsletterToSupabase } from '../../src/lib/supabase/server';
import type { Env, FunctionContext } from '../_lib/types';
import { json, isTimeTrapTripped } from '../_lib/http';

export const onRequestPost = async (context: FunctionContext<Env>): Promise<Response> => {
  const { request, env } = context;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Malformed request body.' }, 400);
  }

  const honeypotValue = body[HONEYPOT_FIELD];
  const isBot =
    (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) ||
    isTimeTrapTripped(body.submittedAt as number | undefined);
  if (isBot) {
    // Same reasoning as /api/rfq and /api/contact: accept silently.
    return json({ ok: true });
  }

  const parsed = NewsletterSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return json({ ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid email address.' }, 400);
  }

  const persisted = await persistNewsletterToSupabase(
    { email: parsed.data.email, source: 'site-footer' },
    { url: env.SUPABASE_URL, serviceKey: env.SUPABASE_SERVICE_ROLE_KEY },
  );

  if (!persisted) {
    return json({ ok: false, error: 'Could not subscribe just now. Please try again shortly.' }, 502);
  }

  return json({ ok: true });
};
