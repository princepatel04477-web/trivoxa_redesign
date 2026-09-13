import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseServiceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient | null {
  if (supabaseServiceClient) return supabaseServiceClient;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  supabaseServiceClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseServiceClient;
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

export async function persistRfqToSupabase(record: RfqRecord): Promise<boolean> {
  const client = getSupabaseServiceClient();
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

export async function persistContactToSupabase(record: ContactRecord): Promise<boolean> {
  const client = getSupabaseServiceClient();
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
