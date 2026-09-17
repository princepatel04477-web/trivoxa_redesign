import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Takes the URL/key explicitly rather than reading `process.env` itself —
 * this runs inside a Cloudflare Pages Function (Workers runtime), which has
 * no `process.env`; the caller reads it from `context.env`. Not cached
 * across calls: a Worker isolate has no reliable module-level singleton
 * lifetime to cache against, and creating the client is cheap (no network
 * call until a query runs).
 */
export function getSupabaseServiceClient(
  url: string | undefined,
  serviceKey: string | undefined,
): SupabaseClient | null {
  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export type RfqRecord = {
  reference: string;
  full_name: string;
  company_name: string;
  email: string;
  phone?: string;
  destination?: string;
  industry?: string;
  category?: string;
  product?: string;
  requirement: string;
  referral?: string;
  path?: string;
  division?: string;
  payload: Record<string, unknown>;
};

export type ContactRecord = {
  reference: string;
  inquiry_type: string;
  full_name: string;
  company_name?: string;
  email: string;
  callback_number?: string;
  message: string;
  payload: Record<string, unknown>;
};

export type NewsletterRecord = {
  email: string;
  source?: string;
};

type SupabaseCreds = { url: string | undefined; serviceKey: string | undefined };

export async function persistRfqToSupabase(record: RfqRecord, creds: SupabaseCreds): Promise<boolean> {
  const client = getSupabaseServiceClient(creds.url, creds.serviceKey);
  if (!client) {
    // Graceful no-op when credentials are not configured in current environment
    return true;
  }

  try {
    const { error } = await client.from('rfq_submissions').insert(record);
    if (error) {
      // In production route handlers, failure is noted without unhandled exception
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function persistContactToSupabase(record: ContactRecord, creds: SupabaseCreds): Promise<boolean> {
  const client = getSupabaseServiceClient(creds.url, creds.serviceKey);
  if (!client) {
    return true;
  }

  try {
    const { error } = await client.from('contact_submissions').insert(record);
    if (error) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Upserts on email so a repeat subscribe from the same address is a no-op
 * success rather than a duplicate-key failure.
 */
export async function persistNewsletterToSupabase(record: NewsletterRecord, creds: SupabaseCreds): Promise<boolean> {
  const client = getSupabaseServiceClient(creds.url, creds.serviceKey);
  if (!client) {
    return true;
  }

  try {
    const { error } = await client
      .from('newsletter_subscribers')
      .upsert({ email: record.email, source: record.source ?? null }, { onConflict: 'email', ignoreDuplicates: true });
    if (error) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
