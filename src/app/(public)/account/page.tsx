'use client'

import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { PLACES } from '@/data'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { SectionHead } from '@/components/ui/SectionHead'
import { Slot } from '@/components/ui/Slot'
import I from '@/components/ui/icons'

export default function AccountPage() {
  const signedIn = useUIStore(s => s.signedIn)
  const signOut = useUIStore(s => s.signOut)

  if (!signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <h1 className="h2">Sign in to view your account</h1>
        <Link href="/signin" className="btn btn-primary btn-lg" style={{ marginTop: 18 }}>Sign in</Link>
      </main>
    )
  }

  const recent = PLACES.slice(0, 4)
  const contributions = PLACES.slice(4, 6)

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--bg-deep)', color: 'var(--text-on-deep)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>SK</div>
          <div>
            <div className="mono">Contributor</div>
            <h1 className="h2" style={{ margin: '4px 0 0' }}>Sai K.</h1>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>Joined March 2025 · {contributions.length} contributions</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={signOut} className="btn">Sign out</button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="Recently viewed"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {recent.map(p => <PlaceCard key={p.id} place={p} compact/>)}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="My contributions" action={<Link href="/submit" className="btn"><I.plus size={14}/> Submit another</Link>}/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {contributions.map(p => (
            <div key={p.id} className="card" style={{ display: 'flex', gap: 12 }}>
              <Slot tone={p.slot.tone} label={p.slot.label.split(' ')[0]} h={70} style={{ width: 92, flexShrink: 0, padding: 8 }}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)' }}>{p.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.area}</div>
                <div className="mono" style={{ marginTop: 6, color: 'var(--moss)' }}>● Published</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Account & settings"/>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {[
            { label: 'Email & password',    value: 'sai@example.com' },
            { label: 'Default city',        value: 'Bangkok' },
            { label: 'Show cannabis shops', value: 'Off' },
            { label: 'Language',            value: 'English' },
            { label: 'Notifications',       value: 'Editor replies only' },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', alignItems: 'center', fontSize: 14 }}>
              <span>{row.label}</span>
              <span style={{ color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>{row.value} <I.chevR size={14}/></span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
