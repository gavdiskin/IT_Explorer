import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const BUCKET = 'place-photos'
const MAX_BYTES = 5 * 1024 * 1024 // 5MB — matches the bucket's file_size_limit

// Build a Supabase client that acts as the caller (their JWT), so storage + table
// RLS see them as the admin. Mirrors src/app/api/admin/apps/route.ts.
function makeClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  )
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const form = await request.formData()
    const slug = form.get('slug')
    const file = form.get('file')

    if (typeof slug !== 'string' || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Image must be 5MB or smaller' }, { status: 400 })
    }

    const sb = makeClient(token)
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const path = `${slug}/${Date.now()}.${ext}`
    const bytes = await file.arrayBuffer()

    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: file.type, upsert: true })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 })

    const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(path)
    const url = pub.publicUrl

    const { error: updErr } = await sb
      .from('places')
      .update({ photos: [url], updated_at: new Date().toISOString() })
      .eq('slug', slug)
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 })

    return NextResponse.json({ url, error: null })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { slug } = await request.json()
    if (typeof slug !== 'string' || !/^[a-z0-9-]+$/i.test(slug)) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
    }
    const sb = makeClient(token)

    // Clear the reference on the place; also tidy up the stored files for this slug.
    const { error: updErr } = await sb
      .from('places')
      .update({ photos: [], updated_at: new Date().toISOString() })
      .eq('slug', slug)
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 })

    const { data: files } = await sb.storage.from(BUCKET).list(slug)
    if (files && files.length > 0) {
      await sb.storage.from(BUCKET).remove(files.map(f => `${slug}/${f.name}`))
    }

    return NextResponse.json({ error: null })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 })
  }
}
