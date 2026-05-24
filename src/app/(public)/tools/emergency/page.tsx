import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emergency Numbers in Thailand — Inside Thailand',
  description: 'Tourist police 1155, ambulance 1669, fire, marine police, and embassy direct lines for Bangkok and Phuket.',
}

const numbers = [
  { id: 1, label: 'Tourist Police (24/7 English)', num: '1155', tone: 'brand' },
  { id: 2, label: 'General emergency',             num: '191',  tone: 'teal'  },
  { id: 3, label: 'Ambulance',                     num: '1669', tone: 'brand' },
  { id: 4, label: 'Fire',                          num: '199',  tone: 'gold'  },
  { id: 5, label: 'Marine police',                 num: '1196', tone: 'teal'  },
  { id: 6, label: 'Crime suppression',             num: '1195', tone: 'brand' },
]

const tones: Record<string, string> = {
  brand: 'var(--brand)',
  teal: 'var(--teal)',
  gold: 'var(--gold)',
}

export default function EmergencyPage() {
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">When things go sideways</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Emergency numbers</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, maxWidth: 520 }}>Save these now, not later. Tourist police speak English. Most others don&apos;t — use Google Translate.</p>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {numbers.map(n => (
            <a key={n.id} href={`tel:${n.num}`} className="card card-hov" style={{ padding: 18, color: 'var(--text)' }}>
              <div className="mono">{n.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, letterSpacing: '-.02em', fontWeight: 700, color: tones[n.tone], marginTop: 4 }}>{n.num}</div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
