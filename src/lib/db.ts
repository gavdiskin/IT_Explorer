import { supabase } from './supabase'
import type { Place, Category, Guide, GuideStep } from '@/types'

// ── Public types ─────────────────────────────────────────────────────────────

export interface GuideRow {
  id: string
  title: string
  mins: number
  area: string
  body: string
  steps: GuideStep[]
  warnings: string[]
  cover_url: string | null
  status: 'published' | 'draft'
  sort_order: number
  created_at: string
  updated_at: string
}

export interface SubmissionRow {
  id: number
  name: string
  category: string | null
  city: string | null
  area: string | null
  description: string | null
  address: string | null
  hours: string | null
  price_level: number | null
  submitted_by: string | null
  status: string
  created_at: string
}

export interface UserRow {
  id: string
  email: string
  role: 'user' | 'admin'
}

function rowToGuide(r: GuideRow): Guide {
  return {
    id: r.id,
    title: r.title,
    mins: r.mins,
    area: r.area,
    body: r.body,
    steps: r.steps ?? [],
    warnings: r.warnings ?? [],
    cover_url: r.cover_url ?? undefined,
  } as Guide & { cover_url?: string }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPlace(r: Record<string, any>): Place {
  return {
    id: r.slug,
    name: r.name,
    category: r.category_slug ?? '',
    subcategory: r.subcategory ?? '',
    cuisine: r.cuisine ?? [],
    area: r.area ?? '',
    city: r.city ?? '',
    station: r.nearest_station ?? undefined,
    price: Math.min(4, Math.max(1, r.price_level ?? 2)),
    rating: Number(r.rating ?? 0),
    reviews: r.reviews_count ?? undefined,
    distance: r.distance ?? undefined,
    open: r.is_open ?? true,
    hours: r.hours ?? '',
    tags: r.tags_array ?? [],
    desc: r.description ?? '',
    tips: r.tips_array ?? [],
    slot: {
      tone: r.slot_tone ?? 'cream',
      label: r.slot_label ?? r.name,
      sub: r.slot_sub ?? '',
    },
    coords: [Number(r.lat), Number(r.lng)],
    priceRange: r.price_range_json ?? {},
    optional: r.is_optional ?? false,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(r: Record<string, any>): Category {
  return {
    id: r.slug,
    label: r.label,
    tone: r.tone ?? 'cream',
    accent: r.accent ?? '#C13D2F',
    icon: r.icon ?? 'dot',
    optional: r.optional ?? false,
  }
}

export async function fetchPlaces(city?: string): Promise<Place[]> {
  if (!supabase) return []
  let q = supabase.from('places').select('*').eq('status', 'approved')
  if (city) q = q.eq('city', city)

  const { data, error } = await q.order('rating', { ascending: false })
  if (error) { console.error('[db] fetchPlaces:', error.message); return [] }
  return (data ?? []).map(rowToPlace)
}

export async function fetchPlace(slug: string): Promise<Place | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('places').select('*').eq('slug', slug).eq('status', 'approved').single()
  if (error) { console.error('[db] fetchPlace:', error.message); return null }
  return data ? rowToPlace(data) : null
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories').select('*').order('sort_order')
  if (error) { console.error('[db] fetchCategories:', error.message); return [] }
  return (data ?? []).map(rowToCategory)
}

export async function fetchSavedSlugs(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('saved_places').select('place_slug').eq('user_id', userId)
  if (error) { console.error('[db] fetchSavedSlugs:', error.message); return [] }
  return (data ?? []).map(r => r.place_slug)
}

export async function upsertSaved(userId: string, placeSlug: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('saved_places').upsert({ user_id: userId, place_slug: placeSlug })
  if (error) console.error('[db] upsertSaved:', error.message)
}

export async function deleteSaved(userId: string, placeSlug: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('saved_places').delete().eq('user_id', userId).eq('place_slug', placeSlug)
  if (error) console.error('[db] deleteSaved:', error.message)
}

export interface SubmissionPayload {
  name: string
  category: string
  city: string
  area: string
  description: string
  address: string
  hours: string
  price_level: number | null
  submitted_by: string | null
}

export async function insertSubmission(payload: SubmissionPayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('user_submissions').insert({
    name: payload.name,
    category: payload.category,
    city: payload.city,
    area: payload.area || null,
    description: payload.description,
    address: payload.address || null,
    hours: payload.hours || null,
    price_level: payload.price_level,
    submitted_by: payload.submitted_by,
    status: 'pending',
  })
  if (error) { console.error('[db] insertSubmission:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function fetchUserRole(_userId: string): Promise<'user' | 'admin'> {
  if (!supabase) return 'user'
  const { data, error } = await supabase.rpc('get_my_role')
  if (error) { console.error('[fetchUserRole]', error.message, error.code); return 'user' }
  return data === 'admin' ? 'admin' : 'user'
}

// ── Public guides ─────────────────────────────────────────────────────────────

export async function fetchPublicGuides(): Promise<Guide[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('guides').select('*').eq('status', 'published').order('sort_order')
  if (error) { console.error('[db] fetchPublicGuides:', error.message); return [] }
  return (data as GuideRow[]).map(rowToGuide)
}

export async function fetchPublicGuide(id: string): Promise<Guide | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('guides').select('*').eq('id', id).eq('status', 'published').single()
  if (error) { console.error('[db] fetchPublicGuide:', error.message); return null }
  return data ? rowToGuide(data as GuideRow) : null
}

// ── Admin guides ──────────────────────────────────────────────────────────────

export async function adminFetchGuides(): Promise<GuideRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('guides').select('*').order('sort_order')
  if (error) { console.error('[db] adminFetchGuides:', error.message); return [] }
  return (data ?? []) as GuideRow[]
}

export interface GuideSavePayload {
  id: string
  title: string
  mins: number
  area: string
  body: string
  steps: GuideStep[]
  warnings: string[]
  cover_url: string | null
  status: 'published' | 'draft'
  sort_order: number
}

export async function adminSaveGuide(payload: GuideSavePayload): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('guides').upsert({
    ...payload,
    updated_at: new Date().toISOString(),
  })
  if (error) { console.error('[db] adminSaveGuide:', error.message); return { error: error.message } }
  return { error: null }
}

export async function adminDeleteGuide(id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('guides').delete().eq('id', id)
  if (error) { console.error('[db] adminDeleteGuide:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Admin submissions ─────────────────────────────────────────────────────────

export async function adminFetchSubmissions(status?: string): Promise<SubmissionRow[]> {
  if (!supabase) return []
  let q = supabase.from('user_submissions').select('*').order('created_at', { ascending: false })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) { console.error('[db] adminFetchSubmissions:', error.message); return [] }
  return (data ?? []) as SubmissionRow[]
}

export async function adminUpdateSubmission(id: number, status: 'approved' | 'rejected'): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('user_submissions').update({ status }).eq('id', id)
  if (error) { console.error('[db] adminUpdateSubmission:', error.message); return { error: error.message } }
  return { error: null }
}

// ── Admin users ───────────────────────────────────────────────────────────────

export async function adminFetchUsers(): Promise<UserRow[]> {
  if (!supabase) return []
  const { data, error } = await supabase.rpc('get_users_with_roles')
  if (error) { console.error('[db] adminFetchUsers:', error.message); return [] }
  return (data ?? []) as UserRow[]
}

export async function adminUpdateUserRole(userId: string, role: 'user' | 'admin'): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Not connected' }
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) { console.error('[db] adminUpdateUserRole:', error.message); return { error: error.message } }
  return { error: null }
}
