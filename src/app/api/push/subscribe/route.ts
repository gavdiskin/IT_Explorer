import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const { endpoint, p256dh, auth } = await request.json()
    if (!endpoint || !p256dh || !auth) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    const sb = makeClient(token)
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { error } = await sb.from('push_subscriptions').upsert(
      { user_id: user.id, endpoint, p256dh, auth_secret: auth },
      { onConflict: 'user_id,endpoint' }
    )
    if (error) { console.error('[push/subscribe] upsert:', error.message); return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 400 }) }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[push/subscribe] POST:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { endpoint } = await request.json()
    if (!endpoint) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    const sb = makeClient(token)
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { error } = await sb.from('push_subscriptions').delete().eq('user_id', user.id).eq('endpoint', endpoint)
    if (error) { console.error('[push/subscribe] delete:', error.message); return NextResponse.json({ error: 'Failed to remove subscription.' }, { status: 400 }) }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[push/subscribe] DELETE:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
