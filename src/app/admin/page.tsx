'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetchSubmissions, adminFetchGuides } from '@/lib/db'
import I from '@/components/ui/icons'

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [guideCount, setGuideCount] = useState<number | null>(null)

  useEffect(() => {
    adminFetchSubmissions('pending').then(s => setPendingCount(s.length))
    adminFetchGuides().then(g => setGuideCount(g.length))
  }, [])

  const card: React.CSSProperties = {
    display: 'block', padding: '24px 28px', borderRadius: 16,
    background: 'var(--bg-card)', border: '1px solid var(--line)',
    textDecoration: 'none', color: 'var(--text)',
  }

  return (
    <>
      <h1 className="h2" style={{ marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Inside Thailand admin panel</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <Link href="/admin/submissions" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#C13D2F15', color: 'var(--brand)', display: 'grid', placeItems: 'center' }}>
              <I.send size={18}/>
            </div>
            <span className="mono" style={{ fontSize: 12 }}>Pending review</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {pendingCount ?? '—'}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>User submissions</div>
        </Link>

        <Link href="/admin/guides" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1F8A5B15', color: 'var(--moss)', display: 'grid', placeItems: 'center' }}>
              <I.book size={18}/>
            </div>
            <span className="mono" style={{ fontSize: 12 }}>Total guides</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {guideCount ?? '—'}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Published + drafts</div>
        </Link>

        <Link href="/admin/users" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1F3A4515', color: '#1F6FB4', display: 'grid', placeItems: 'center' }}>
              <I.users size={18}/>
            </div>
            <span className="mono" style={{ fontSize: 12 }}>Users</span>
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>—</div>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Manage roles</div>
        </Link>
      </div>

      <div style={{ marginTop: 40, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/admin/submissions" className="btn btn-primary"><I.send size={15}/> Review submissions</Link>
        <Link href="/admin/guides/new" className="btn"><I.plus size={15}/> New guide</Link>
      </div>
    </>
  )
}
