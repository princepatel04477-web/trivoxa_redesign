import { RfqSubmissionSchema, HONEYPOT_FIELD } from '../../src/lib/forms/schema';
import { sendRfqEmails } from '../../src/lib/email/resend';
import { persistRfqToSupabase } from '../../src/lib/supabase/server';
import { verifyTurnstileToken } from '../../src/lib/turnstile';
import type { Env, FunctionContext } from '../_lib/types';
import { generateReference } from '../_lib/reference';
import { json, isTimeTrapTripped, quietlyAccepted } from '../_lib/http';

export const onRequestPost = async (context: FunctionContext<Env>): Promise<Response> => {
  const { request, env } = context;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Malformed request body.' }, 400);
  }

  // Honeypot: say nothing, exactly as if it had worked.
  const honeypotValue = body[HONEYPOT_FIELD];
  if (typeof honeypotValue === 'string' && honeypotValue.trim().length > 0) {
    return quietlyAccepted(generateReference('RFQ'));
  }

  if (isTimeTrapTripped(body.submittedAt as number | undefined)) {
    return quietlyAccepted(generateReference('RFQ'));
  }

  const parsed = RfqSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
    }
    return json({ ok: false, error: 'Please check the highlighted fields.', errors }, 400);
  }
  const data = parsed.data;

  const turnstileOk = await verifyTurnstileToken(
    data.turnstileToken,
    env.TURNSTILE_SECRET_KEY,
    request.headers.get('CF-Connecting-IP') ?? undefined,
  );
  if (!turnstileOk) {
    return json(
      { ok: false, error: 'Verification failed — please retry the form; if it persists, email us directly.' },
      400,
    );
  }

  const reference = generateReference('RFQ');

  const [emailResult] = await Promise.all([
    sendRfqEmails(data, reference, env.RESEND_API_KEY),
    persistRfqToSupabase(
      {
        reference,
        full_name: data.fullName,
        company_name: data.companyName,
        email: data.email,
        phone: data.phone || undefined,
        destination: data.destination || undefined,
        industry: data.industry || undefined,
        category: data.category || undefined,
        product: data.product || undefined,
        requirement: data.requirement,
        referral: data.referral || undefined,
        path: data.path || undefined,
        division: data.division || undefined,
        payload: data,
      },
      { url: env.SUPABASE_URL, serviceKey: env.SUPABASE_SERVICE_ROLE_KEY },
    ),
  ]);

  if (!emailResult.success) {
    return json(
      {
        ok: false,
        error: 'The export desk could not be reached just now. Please use the email fallback below.',
      },
      502,
    );
  }

  return json({ ok: true, reference });
};
