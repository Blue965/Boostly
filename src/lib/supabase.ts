import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Keep the client module import-safe in previews where Vite may not expose project
// variables until the dev server has restarted. Requests still fail clearly until
// the real Supabase variables are available.
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'preview-only-anon-key';

export const supabase = createClient(
  supabaseUrl || fallbackUrl,
  supabaseAnonKey || fallbackKey,
);
