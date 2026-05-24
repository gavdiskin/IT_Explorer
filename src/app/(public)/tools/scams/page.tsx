'use client'

import { useState, useMemo } from 'react'
import { SCAMS } from '@/data'
import I from '@/components/ui/icons'

const sevColors: Record<string, { bg: string; label: string }> = {
  serious: { bg: '#C13D2F', label: 'Serious' },
  common:  { bg: '#D9883A', label: 'Common'  },
  minor:   { bg: '#D9A23A', label: 'Minor'   },
}

export default function ScamDetectorPage() {
  const [query, setQuery] = useState('')

  const matches = useMemo(() => {
    if (!query.trim()) return SCAMS
    const q = query.toLowerCase()
    return SCAMS.filter(s =>
      [s.title, s.where, s.how, ...(s.keywords || [])].join(' ').toLowerCase().includes(q)
    )
  }, [query])

  return (
    <main className="route-mount">
      <section style={{ background: 'var(--bg-deep)', color: 'var(--text-on-deep)', padding: '40px 0 56px' }}>
        <div className="wrap">
          <div className="mono" style={{ color: 'rgba(245,238,220,.55)', marginBottom: 12 }}>Streetwise · Thailand</div>
          <h1 className="h1" style={{ color: 'inherit' }}>Scam detector</h1>
          <p style={{ color: 'rgba(245,238,220,.75)', maxWidth: 560, marginTop: 12, marginBottom: 24 }}>
            Type what&apos;s happening — a place name, a phrase someone used, or the kind of situation. We&apos;ll match it to known scams and tell you what to do instead.
          </p>
          <div className="searchbar" style={{ background: 'rgba(255,255,255,.08)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)', maxWidth: '100%' }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder='"tuk-tuk said temple is closed"' style={{ color: '#fff' }}/>
            <button className="btn btn-primary"><I.search size={16}/> <span className="inline-only-tablet-up">Check</span></button>
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 14, color: 'rgba(245,238,220,.7)', fontSize: 13, flexWrap: 'wrap' }}>
            <div><I.phone size={14} style={{ verticalAlign: 'middle', marginRight: 6 }}/>Tourist Police 1155 (24/7 English)</div>
            <div><I.warning size={14} style={{ verticalAlign: 'middle', marginRight: 6 }}/>General emergency 191</div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 32, marginBottom: 56 }}>
        {query && (
          <div className="mono" style={{ marginBottom: 16 }}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} for &ldquo;{query}&rdquo;
          </div>
        )}
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {matches.map((s, i) => {
            const sev = sevColors[s.severity] || sevColors.minor
            return (
              <article key={s.id} className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div>
                    <div className="mono" style={{ marginBottom: 4 }}>№{String(i + 1).padStart(2, '0')} · {s.where}</div>
                    <h3 className="h3" style={{ margin: 0 }}>{s.title}</h3>
                  </div>
                  <span className="tag" style={{ background: sev.bg, color: '#fff', flexShrink: 0, fontWeight: 700 }}>{sev.label}</span>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div className="mono" style={{ marginBottom: 4 }}>How it works</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55 }}>{s.how}</div>
                </div>
                <div className="card" style={{ marginTop: 12, padding: 12, background: '#5E7A3A14', boxShadow: 'inset 0 0 0 1px #5E7A3A40' }}>
                  <div className="mono" style={{ color: 'var(--moss)', marginBottom: 4, fontWeight: 700 }}>Do this instead</div>
                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>{s.instead}</div>
                </div>
              </article>
            )
          })}
        </div>
        {matches.length === 0 && (
          <div className="card card-flat" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div className="h4">No matches in our database</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>That doesn&apos;t mean you&apos;re safe. Trust your gut. If it feels wrong, leave.</div>
          </div>
        )}
      </section>
    </main>
  )
}
