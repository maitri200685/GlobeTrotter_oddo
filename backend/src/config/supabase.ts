import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

// Service role client - bypassing RLS
// Use strictly for backend-only administrative tasks
export const getAdminSupabaseClient = (): SupabaseClient => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Authenticated client - respects RLS
// Use for all user-scoped requests
export const getAuthSupabaseClient = (jwt: string): SupabaseClient => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
