import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL ?? ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

const PLACEHOLDER_URL = 'https://your_project_id.supabase.co'
const PLACEHOLDER_KEY = 'your_supabase_anon_key'

/** True when URL and anon key are set and not left as template placeholders. */
export function isSupabaseConfigured(): boolean {
  const u = url.trim().toLowerCase()
  const k = anonKey.trim().toLowerCase()
  if (!u || !k) return false
  if (u === PLACEHOLDER_URL || k === PLACEHOLDER_KEY) return false
  if (u.includes('your_project_id') || k === 'your_supabase_anon_key') return false
  return true
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(url.trim(), anonKey.trim())
  }
  return client
}
