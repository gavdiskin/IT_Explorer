import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { makeClient, verifyAdmin } from '../../admin/_lib'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY ?? ''
const VAPID_CONTACT = process.env.VAPID_CONTACT ?? 'mailto:admin@insidethailand.com'

export async function POST(request: NextRequest) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    console.warn('[push/notify] VAPID keys not configured')
    return NextResponse.json({ ok: true, skipped: true })
  }

  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!await verifyAdmin(token)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { email, title, body, url } = await request.json()
    if (!email || !title) return NextResponse.json({ error: 'Missing email or title' }, { status: 400 })

    webpush.setVapidDetails(VAPID_CONTACT, VAPID_PUBLIC, VAPID_PRIVATE)

    const sb = makeClient(token)
    const { data: subs, error } = await sb.rpc('get_push_subscriptions_for_email', { target_email: email })
    if (error) { console.error('[push/notify] rpc:', error.message); return NextResponse.json({ ok: true, skipped: true }) }
    if (!subs || subs.length === 0) return NextResponse.json({ ok: true, skipped: true })

    const payload = JSON.stringify({ title, body: body ?? '', url: url ?? '/' })
    const results = await Promise.allSettled(
      subs.map((s: { endpoint: string; p256dh: string; auth_secret: string }) =>
        webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_secret } }, payload)
      )
    )
    const failures = results.filter(r => r.status === 'rejected')
    if (failures.length) console.error('[push/notify] send failures:', failures.length)

    return NextResponse.json({ ok: true, sent: results.length - failures.length })
  } catch (err) {
    console.error('[push/notify] POST:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
