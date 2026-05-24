'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminFetchGuides, adminDeleteGuide, type GuideRow } from '@/lib/db'
import I from '@/components/ui/icons'

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<GuideRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    adminFetchGuides().then(g => { setGuides(g); setLoading(false) })
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await adminDeleteGuide(id)
    setGuides(g => g.filter(x => x.id !== id))
    setDeleting(null)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <h1 className="h2">Guides</h1>
        <Link href="/admin/guides/new" className="btn btn-primary"><I.plus size={15}/> New guide</Link>
      </div>

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {guides.map(g => (
          <div key={g.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
            {g.cover_url && (
              <div style={{ width: 56, height: 40, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{g.title}</span>
                <span className="tag" style={{ background: g.status === 'published' ? '#2D6A4F20' : 'var(--bg-2)', color: g.status === 'published' ? '#2D6A4F' : 'var(--muted)' }}>
                  {g.status}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {g.area} · {g.mins} min · {g.steps?.length ?? 0} steps · {g.warnings?.length ?? 0} warnings
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <Link href={`/admin/guides/${g.id}`} className="btn" style={{ padding: '7px 12px', fontSize: 13 }}>
                <I.edit size={14}/> Edit
              </Link>
              <button
                className="btn"
                disabled={deleting === g.id}
                onClick={() => handleDelete(g.id, g.title)}
                style={{ padding: '7px 12px', fontSize: 13, color: 'var(--brand)' }}
              >
                <I.trash size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && guides.length === 0 && (
        <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          No guides yet. <Link href="/admin/guides/new" style={{ color: 'var(--brand)' }}>Create the first one →</Link>
        </div>
      )}
    </>
  )
}
