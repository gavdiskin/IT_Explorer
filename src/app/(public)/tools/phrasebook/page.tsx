import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thai Phrasebook — Inside Thailand',
  description: '50 Thai phrases that actually get you what you want — food, transport, taxis, bargaining, and emergencies.',
}

const phrases = [
  { th: 'Sawatdee khrap / kha',   en: 'Hello (M / F)',            use: 'Greeting' },
  { th: 'Khop khun khrap / kha',  en: 'Thank you (M / F)',        use: 'Always' },
  { th: 'Mai pen rai',            en: 'No worries, never mind',   use: 'After anything' },
  { th: 'Tao rai?',               en: 'How much?',                use: 'Markets, taxis' },
  { th: 'Phaeng pai',             en: 'Too expensive',            use: 'Negotiating' },
  { th: 'Lot noi, dai mai?',      en: 'Can you lower it a bit?',  use: 'Bargaining' },
  { th: 'Mai ao',                 en: "I don't want it",          use: 'Touts' },
  { th: 'Mai phet',               en: 'Not spicy',                use: 'Ordering food' },
  { th: 'Phet nit noi',           en: 'A little spicy',           use: 'Food, brave' },
  { th: 'Aroi mak',               en: 'Delicious',                use: 'Compliment cook' },
  { th: 'Hong nam yu nai?',       en: 'Where is the toilet?',     use: 'Universally useful' },
  { th: 'Chuay duay',             en: 'Help, please',             use: 'Emergency' },
  { th: 'Mai khao jai',           en: "I don't understand",       use: 'Most days' },
  { th: 'Chai / Mai chai',        en: 'Yes / No',                 use: 'Basic' },
  { th: 'Pai BTS Ari',            en: 'Go to BTS Ari',            use: 'Taxis' },
  { th: 'Bped meter',             en: 'Turn on the meter',        use: 'Taxis (politely insist)' },
]

export default function PhrasebookPage() {
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Survival Thai</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Phrasebook</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 540, marginTop: 10 }}>16 phrases that actually move things along. Add khrap (M) or kha (F) to soften sentences.</p>
      </section>
      <section className="wrap" style={{ marginBottom: 56 }}>
        <div className="card card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          {phrases.map((p, i) => (
            <div key={i} style={{ padding: '14px 18px', borderBottom: i < phrases.length - 1 ? '1px solid var(--line)' : 'none', display: 'grid', gap: 8, gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1.5fr) minmax(0,1fr)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15.5 }}>{p.th}</div>
              <div style={{ fontSize: 13.5 }}>{p.en}</div>
              <div className="mono">{p.use}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
