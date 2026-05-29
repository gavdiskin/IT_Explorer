'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { supabase } from '@/lib/supabase'
import { fetchMySubmissions, type SubmissionRow } from '@/lib/db'
import { SectionHead } from '@/components/ui/SectionHead'
import { CITIES } from '@/data'
import I from '@/components/ui/icons'

const PRICE = ['', '฿', '฿฿', '฿฿฿', '฿฿฿฿']

const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  pending:  { bg: '#D9A23A18', fg: 'var(--gold)' },
  approved: { bg: '#2D6A4F18', fg: '#2D6A4F' },
  rejected: { bg: '#C13D2F14', fg: 'var(--brand)' },
}

export default function AccountPage() {
  const signedIn        = useUIStore(s => s.signedIn)
  const signOut         = useUIStore(s => s.signOut)
  const userEmail       = useUIStore(s => s.userEmail)
  const role            = useUIStore(s => s.role)
  const city            = useUIStore(s => s.city)
  const setCity         = useUIStore(s => s.setCity)
  const showCannabis    = useUIStore(s => s.showCannabis)
  const setShowCannabis = useUIStore(s => s.setShowCannabis)
  const savedSet        = useUIStore(s => s.savedSet)

  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [subsLoading, setSubsLoading] = useState(false)

  useEffect(() => {
    if (!signedIn || !userEmail) return
    setSubsLoading(true)
    fetchMySubmissions(userEmail).then(rows => {
      setSubmissions(rows)
      setSubsLoading(false)
    })
  }, [signedIn, userEmail])

  if (!signedIn) {
    return (
      <main className="wrap route-mount" style={{ padding: '60px var(--gutter)', maxWidth: 540, textAlign: 'center' }}>
        <h1 className="h2">Sign in to view your account</h1>
        <Link href="/signin" className="btn btn-primary btn-lg" style={{ marginTop: 18 }}>Sign in</Link>
      </main>
    )
  }

  const initials    = userEmail ? userEmail.slice(0, 2).toUpperCase() : '?'
  const displayName = userEmail ? userEmail.split('@')[0] : 'User'

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut()
    signOut()
  }

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--bg-deep)', color: 'var(--text-on-deep)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22,
          }}>
            {initials}
          </div>
          <div>
            <div className="mono" style={{ color: role === 'admin' ? 'var(--brand)' : undefined }}>
              {role === 'admin' ? 'Admin' : 'Member'}
            </div>
            <h1 className="h2" style={{ margin: '4px 0 2px' }}>{displayName}</h1>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{userEmail}</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button onClick={handleSignOut} className="btn">Sign out</button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="Quick links"/>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {role === 'admin' && (
            <Link href="/admin" className="btn btn-primary" style={{ gap: 8 }}>
              <I.sliders size={15}/> Admin panel
            </Link>
          )}
          <Link href="/saved" className="btn">
            <I.bookmark size={15}/> Saved places
            {savedSet.size > 0 && (
              <span style={{ marginLeft: 4, background: 'var(--brand)', color: '#fff', borderRadius: 999, fontSize: 11, padding: '1px 6px' }}>
                {savedSet.size}
              </span>
            )}
          </Link>
          <Link href="/recently-viewed" className="btn"><I.clock size={15}/> Recently viewed</Link>
          <Link href="/submit" className="btn"><I.plus size={15}/> Submit a place</Link>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <SectionHead title="Settings"/>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)', alignItems: 'center', fontSize: 14 }}>
            <span>Email</span>
            <span style={{ color: 'var(--muted)', fontSize: 13 }}>{userEmail}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--line)', alignItems: 'center', fontSize: 14 }}>
            <span>Default city</span>
            <select
              className="select"
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{ fontSize: 13, padding: '5px 10px', borderRadius: 8 }}
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', alignItems: 'center', fontSize: 14 }}>
            <div>
              <div>Show cannabis shops</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Verify local laws before visiting</div>
            </div>
            <button
              onClick={() => setShowCannabis(!showCannabis)}
              style={{
                width: 44, height: 24, borderRadius: 12, border: 0, cursor: 'pointer',
                background: showCannabis ? 'var(--brand)' : 'var(--line-2)',
                position: 'relative', transition: 'background .2s',
              }}
              aria-label={showCannabis ? 'Disable cannabis shops' : 'Enable cannabis shops'}
            >
              <span style={{
                position: 'absolute', top: 2, left: showCannabis ? 22 : 2,
                width: 20, height: 20, borderRadius: 10, background: '#fff',
                transition: 'left .2s', display: 'block',
              }}/>
            </button>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead
          title="My submissions"
          subtitle={submissions.length > 0 ? `${submissions.length} submitted` : undefined}
          action={<Link href="/submit" className="btn"><I.plus size={14}/> Submit a place</Link>}
        />

        {subsLoading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

        {!subsLoading && submissions.length === 0 && (
          <div className="card card-flat" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Know a spot that deserves to be on the map?{' '}
              <Link href="/submit" style={{ color: 'var(--brand)', fontWeight: 600 }}>Submit it</Link>{' '}
              — editors review within 48 hours.
            </div>
          </div>
        )}

        {submissions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map(row => {
              const sc = STATUS_COLOR[row.status] ?? STATUS_COLOR.pending
              return (
                <div key={row.id} className="card" style={{ padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                      <strong style={{ fontSize: 14 }}>{row.name}</strong>
                      {row.category && <span className="tag" style={{ fontSize: 11 }}>{row.category}</span>}
                      {row.city && <span className="tag" style={{ background: 'var(--bg-2)', fontSize: 11 }}>{row.city}</span>}
                      {row.price_level != null && (
                        <span className="tag" style={{ background: 'var(--bg-2)', fontSize: 11 }}>{PRICE[row.price_level]}</span>
                      )}
                    </div>
                    {row.area && <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 3 }}>{row.area}</div>}
                    {row.description && (
                      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text)', opacity: 0.85 }}>{row.description}</p>
                    )}
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>
                      {new Date(row.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className="tag" style={{ background: sc.bg, color: sc.fg, flexShrink: 0, textTransform: 'capitalize', fontSize: 11 }}>
                    {row.status}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
