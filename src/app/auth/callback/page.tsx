'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!supabase) { router.push('/'); return }
    const code = searchParams.get('code')
    const exchange = code ? supabase.auth.exchangeCodeForSession(code) : Promise.resolve(null)
    exchange
      .then(() => router.replace('/'))
      .catch(() => router.replace('/signin'))
  }, [router, searchParams])

  return null
}

export default function AuthCallbackPage() {
  return (
    <main style={{ display: 'grid', placeItems: 'center', height: '100dvh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="mono" style={{ color: 'var(--muted)', fontSize: 14 }}>Signing you in…</div>
      </div>
      <Suspense>
        <CallbackInner/>
      </Suspense>
    </main>
  )
}
