import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Auth options are set explicitly (rather than relying on library defaults) so the
// session survives a page reload:
//  - persistSession      → store the session in localStorage
//  - autoRefreshToken    → refresh the access token in the background
//  - detectSessionInUrl  → pick up the session from the OAuth redirect
//  - flowType: 'pkce'    → required by the /auth/callback exchangeCodeForSession step
export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      })
    : null

if (!supabase && typeof window !== 'undefined') {
  console.warn('[supabase] env vars missing — falling back to static data')
}
