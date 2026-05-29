'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetchReports, adminUpdateReport, type ReportRow } from '@/lib/db'
import I from '@/components/ui/icons'

const STATUS_TABS = ['open', 'resolved', 'dismissed'] as const
type Tab = typeof STATUS_TABS[number]

const KIND_STYLE = {
  correction: { bg: '#1F6FB420', fg: '#1F6FB4', label: 'CORRECTION' },
  report:     { bg: '#C13D2F15', fg: 'var(--brand)', label: 'REPORT' },
}

export default function ReportsPage() {
  const [tab, setTab] = useState<Tab>('open')
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<number | null>(null)

  const load = async (status: string) => {
    setLoading(true)
    const data = await adminFetchReports(status)
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load(tab) }, [tab])

  const handle = async (id: number, status: 'resolved' | 'dismissed') => {
    setActing(id)
    await adminUpdateReport(id, status)
    setRows(r => r.filter(x => x.id !== id))
    setActing(null)
  }

  const ks = (k: string) => KIND_STYLE[k as keyof typeof KIND_STYLE] ?? KIND_STYLE.report

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <h1 className="h2">Reports &amp; Corrections</h1>
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
          No {tab} reports.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(row => {
          const k = ks(row.kind)
          return (
            <div key={row.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="tag" style={{ background: k.bg, color: k.fg, fontSize: 10, fontWeight: 700 }}>{k.label}</span>
                    <Link
                      href={`/places/${row.place_slug}`}
                      style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)' }}
                    >
                      {row.place_name ?? row.place_slug}
                    </Link>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{row.place_slug}</span>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: 13.5, lineHeight: 1.55, color: 'var(--text)' }}>{row.message}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)' }}>
                    {row.contact && <span><I.mail size={12}/> {row.contact}</span>}
                    {row.submitted_by && <span><I.user size={12}/> {row.submitted_by}</span>}
                    <span>{new Date(row.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {tab === 'open' && (
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      className="btn btn-primary"
                      disabled={acting === row.id}
                      onClick={() => handle(row.id, 'resolved')}
                      style={{ gap: 6, background: '#2D6A4F' }}
                    >
                      <I.check size={15}/> Resolve
                    </button>
                    <button
                      className="btn"
                      disabled={acting === row.id}
                      onClick={() => handle(row.id, 'dismissed')}
                      style={{ gap: 6, color: 'var(--muted)' }}
                    >
                      <I.x size={15}/> Dismiss
                    </button>
                  </div>
                )}
                {tab !== 'open' && (
                  <span className="tag" style={{
                    background: tab === 'resolved' ? '#2D6A4F20' : '#00000010',
                    color: tab === 'resolved' ? '#2D6A4F' : 'var(--muted)',
                    flexShrink: 0, textTransform: 'capitalize',
                  }}>
                    {tab}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
