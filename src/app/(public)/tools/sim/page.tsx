import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Best SIM Card in Thailand — Inside Thailand',
  description: 'AIS, dtac, and TrueMove H compared — which carrier wins in Bangkok, the islands, and rural areas.',
}

const carriers = [
  { name: 'AIS',        strength: 'Strongest in cities', cost: '฿299 / 7d' },
  { name: 'dtac',       strength: 'Best on islands',     cost: '฿299 / 7d' },
  { name: 'TrueMove H', strength: 'Cheapest data',       cost: '฿199 / 8d' },
]

export default function SimFinderPage() {
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Get connected fast</div>
        <h1 className="h1" style={{ marginTop: 10 }}>SIM finder</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, maxWidth: 540 }}>All three big carriers sell tourist SIMs at airport counters. Same price as official. Bring passport.</p>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {carriers.map(c => (
            <div key={c.name} className="card" style={{ padding: 18 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, letterSpacing: '-.02em' }}>{c.name}</div>
              <div className="mono" style={{ marginTop: 6 }}>{c.cost}</div>
              <div style={{ marginTop: 10, fontSize: 14 }}>{c.strength}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
