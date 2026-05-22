'use client'

import { useState } from 'react'
import { PRICE_DATA } from '@/data'
import { SectionHead } from '@/components/ui/SectionHead'
import I from '@/components/ui/icons'

export default function PriceCheckerPage() {
  const [item, setItem] = useState(PRICE_DATA[0].id)
  const [paid, setPaid] = useState('')

  const current = PRICE_DATA.find(p => p.id === item)!
  const numericPaid = parseFloat(paid.replace(/[^\d.]/g, '')) || 0
  const fairRange = current.fair.match(/\d+/g)?.map(Number) || []
  const fairLow = fairRange[0] || 0
  const fairHigh = fairRange[fairRange.length - 1] || fairLow
  const verdict = !paid ? null : numericPaid <= fairHigh * 1.1 ? 'fair' : numericPaid <= fairHigh * 2 ? 'overpaid' : 'scam'

  const verdictMap: Record<string, { bg: string; label: string; body: string }> = {
    fair:     { bg: 'var(--moss)',  label: 'Fair price', body: "That's about what locals pay. Nice work." },
    overpaid: { bg: 'var(--gold)',  label: 'Overpaid',   body: 'You paid a tourist premium — not robbery, but watch for it.' },
    scam:     { bg: 'var(--brand)', label: 'Scam-level', body: "More than 2× the local price. Walk away next time, or use the named alternative." },
  }
  const v = verdict ? verdictMap[verdict] : null

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Real prices · Bangkok 2026</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Price checker</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 10 }}>
          Type what you paid. Get the fair local price and where it should have been.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 20, display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', alignItems: 'end' }}>
          <div className="field">
            <label>What did you buy?</label>
            <select className="select" value={item} onChange={e => setItem(e.target.value)}>
              {PRICE_DATA.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label>What did you pay? (THB)</label>
            <input className="input" placeholder="e.g. 250" value={paid} onChange={e => setPaid(e.target.value)} inputMode="numeric"/>
          </div>
          <div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
              <I.tag size={16}/> Check
            </button>
          </div>
        </div>

        {v && (
          <div className="card" style={{ marginTop: 14, padding: 20, background: v.bg, color: '#fff', boxShadow: 'none' }}>
            <div className="mono" style={{ color: 'rgba(255,255,255,.7)', marginBottom: 4 }}>{current.label}</div>
            <div className="h3" style={{ color: 'inherit' }}>{v.label}</div>
            <p style={{ marginTop: 8, marginBottom: 0, opacity: .92 }}>{v.body}</p>
            <div style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13 }}>
              <div><strong>Fair:</strong> {current.fair}</div>
              <div><strong>Where:</strong> {current.where}</div>
            </div>
            {current.tip && <div style={{ marginTop: 10, fontSize: 13, opacity: .85 }}>↳ {current.tip}</div>}
          </div>
        )}
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Reference prices"/>
        <div className="card card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 18px', borderBottom: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            <span>Item</span><span>Fair</span><span className="only-tablet-up">Where</span>
          </div>
          {PRICE_DATA.map((p, i) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', padding: '14px 18px', borderBottom: i < PRICE_DATA.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 13.5 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{p.label}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>{p.tip}</div>
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--text)', textTransform: 'none', fontWeight: 700 }}>{p.fair}</div>
              <div className="only-tablet-up" style={{ fontSize: 12.5, color: 'var(--muted)' }}>{p.where}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
