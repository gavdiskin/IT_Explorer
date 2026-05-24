'use client'

import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { PLACES } from '@/data'
import { PlaceCard } from '@/components/ui/PlaceCard'
import I from '@/components/ui/icons'

export default function SavedPage() {
  const signedIn = useUIStore(s => s.signedIn)
  const savedSet = useUIStore(s => s.savedSet)

  if (!signedIn) {
    return (
      <main className="route-mount">
        <section className="wrap" style={{ padding: '32px 0 24px' }}>
          <div className="mono">Your places</div>
          <h1 className="h1" style={{ marginTop: 10 }}>Saved</h1>
        </section>
        <section className="wrap" style={{ marginBottom: 56 }}>
          <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 540, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <I.bookmark size={28}/>
            </div>
            <h2 className="h3" style={{ margin: 0 }}>Sign in to save places</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8, marginBottom: 24 }}>Keep your saves across devices and sync them with the mobile app.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/signin" className="btn btn-primary btn-lg">Sign in</Link>
              <Link href="/map" className="btn btn-lg">Keep browsing</Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const places = PLACES.filter(p => savedSet.has(p.id))

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Your places</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Saved <span style={{ color: 'var(--muted)' }}>· {places.length}</span></h1>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        {places.length === 0 ? (
          <div className="card card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
            <div className="h4">Nothing saved yet</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Tap the bookmark on any place to keep it here.</div>
            <Link href="/map" className="btn btn-primary" style={{ marginTop: 14 }}>Browse the map</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {places.map(p => <PlaceCard key={p.id} place={p}/>)}
          </div>
        )}
      </section>
    </main>
  )
}
