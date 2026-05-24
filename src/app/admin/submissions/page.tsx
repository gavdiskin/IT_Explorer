'use client'

import { useEffect, useState } from 'react'
import { adminFetchSubmissions, adminUpdateSubmission, type SubmissionRow } from '@/lib/db'
import { CATEGORIES } from '@/data'
import I from '@/components/ui/icons'

const STATUS_TABS = ['pending', 'approved', 'rejected'] as const

const PRICE = ['', '฿', '฿฿', '฿฿฿', '฿฿฿฿']

export default function SubmissionsPage() {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [rows, setRows] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  const load = async (status: string) => {
    setLoading(true)
    const data = await adminFetchSubmissions(status)
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  const handle = async (id: number, status: 'approved' | 'rejected') => {
    setUpdating(id)
    await adminUpdateSubmission(id, status)
    setRows(r => r.filter(x => x.id !== id))
    setUpdating(null)
  }

  const catLabel = (id: string | null) =>
    CATEGORIES.find(c => c.id === id)?.label ?? id ?? '—'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <h1 className="h2">Submissions</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className="chip"
              style={{ background: tab === t ? 'var(--brand)' : undefined, color: tab === t ? '#fff' : undefined, textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

      {!loading && rows.length === 0 && (
        <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          No {tab} submissions.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(row => (
          <div key={row.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <strong style={{ fontSize: 15 }}>{row.name}</strong>
                  <span className="tag">{catLabel(row.category)}</span>
                  {row.city && <span className="tag" style={{ background: 'var(--bg-2)' }}>{row.city}</span>}
                  {row.price_level && <span className="tag" style={{ background: 'var(--bg-2)' }}>{PRICE[row.price_level]}</span>}
                </div>
                {row.area && <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>{row.area}</div>}
                {row.description && <p style={{ margin: '6px 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)' }}>{row.description}</p>}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
                  {row.address && <span><I.pin size={12}/> {row.address}</span>}
                  {row.hours && <span><I.clock size={12}/> {row.hours}</span>}
                  <span><I.user size={12}/> {row.submitted_by ?? 'anonymous'}</span>
                  <span>{new Date(row.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {tab === 'pending' && (
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-primary"
                    disabled={updating === row.id}
                    onClick={() => handle(row.id, 'approved')}
                    style={{ gap: 6, background: '#2D6A4F' }}
                  >
                    <I.check size={15}/> Approve
                  </button>
                  <button
                    className="btn"
                    disabled={updating === row.id}
                    onClick={() => handle(row.id, 'rejected')}
                    style={{ gap: 6, color: 'var(--brand)' }}
                  >
                    <I.x size={15}/> Reject
                  </button>
                </div>
              )}
              {tab !== 'pending' && (
                <span className="tag" style={{ background: tab === 'approved' ? '#2D6A4F20' : '#C13D2F15', color: tab === 'approved' ? '#2D6A4F' : 'var(--brand)', flexShrink: 0 }}>
                  {tab}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
