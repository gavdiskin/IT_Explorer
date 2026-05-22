import { useState, useMemo } from 'react';
import { Link } from '../router';
import Icon from '../icons';
import { SCAMS, PRICE_DATA, TOURIST_TOOLS } from '../data';
import { SectionHead } from '../shared';
import { ToolCard } from './home';

export function ToolsHubPage() {
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Built for everyday Thailand</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Tourist tools</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 560, marginTop: 10 }}>
          Small utilities for the stuff travel guides never quite cover — scams, prices, transit, emergencies, the local SIM.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {TOURIST_TOOLS.map(t => <ToolCard key={t.id} tool={t}/>)}
        </div>
      </section>
    </main>
  );
}

export function ScamDetectorPage() {
  const [query, setQuery] = useState('');

  const matches = useMemo(() => {
    if (!query.trim()) return SCAMS;
    const q = query.toLowerCase();
    return SCAMS.filter(s =>
      [s.title, s.where, s.how, ...(s.keywords || [])].join(' ').toLowerCase().includes(q)
    );
  }, [query]);

  const sevColors = {
    serious: { bg: '#C13D2F', label: 'Serious' },
    common:  { bg: '#D9883A', label: 'Common'  },
    minor:   { bg: '#D9A23A', label: 'Minor'   },
  };

  return (
    <main className="route-mount">
      <section style={{ background: 'var(--bg-deep)', color: 'var(--text-on-deep)', padding: '40px 0 56px' }}>
        <div className="wrap">
          <div className="mono" style={{ color: 'rgba(245,238,220,.55)', marginBottom: 12 }}>Streetwise · Thailand</div>
          <h1 className="h1" style={{ color: 'inherit' }}>Scam detector</h1>
          <p style={{ color: 'rgba(245,238,220,.75)', maxWidth: 560, marginTop: 12, marginBottom: 24 }}>
            Type what's happening — a place name, a phrase someone used, or the kind of situation. We'll match it to known scams and tell you what to do instead.
          </p>

          <div className="searchbar" style={{ background: 'rgba(255,255,255,.08)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)', maxWidth: '100%' }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder='"tuk-tuk said temple is closed"'
              style={{ color: '#fff' }}
            />
            <button className="btn btn-primary"><Icon.search size={16}/> <span className="inline-only-tablet-up">Check</span></button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 14, color: 'rgba(245,238,220,.7)', fontSize: 13, flexWrap: 'wrap' }}>
            <div><Icon.phone size={14} style={{ verticalAlign: 'middle', marginRight: 6 }}/> Tourist Police 1155 (24/7 English)</div>
            <div><Icon.warning size={14} style={{ verticalAlign: 'middle', marginRight: 6 }}/> General emergency 191</div>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginTop: 32, marginBottom: 56 }}>
        {query && (
          <div className="mono" style={{ marginBottom: 16 }}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} for "{query}"
          </div>
        )}
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {matches.map((s, i) => {
            const sev = sevColors[s.severity] || sevColors.minor;
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
            );
          })}
        </div>
        {matches.length === 0 && (
          <div className="card card-flat" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            <div className="h4">No matches in our database</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>That doesn't mean you're safe. Trust your gut. If it feels wrong, leave.</div>
          </div>
        )}
      </section>
    </main>
  );
}

export function PriceCheckerPage() {
  const [item, setItem] = useState(PRICE_DATA[0].id);
  const [paid, setPaid] = useState('');

  const current = PRICE_DATA.find(p => p.id === item);
  const numericPaid = parseFloat(paid.replace(/[^\d.]/g, '')) || 0;
  const fairRange = current.fair.match(/\d+/g)?.map(Number) || [];
  const fairLow = fairRange[0] || 0;
  const fairHigh = fairRange[fairRange.length - 1] || fairLow;
  const verdict = !paid ? null : numericPaid <= fairHigh * 1.1 ? 'fair' : numericPaid <= fairHigh * 2 ? 'overpaid' : 'scam';

  const verdictMap = {
    fair:     { bg: 'var(--moss)',  label: 'Fair price', body: "That's about what locals pay. Nice work." },
    overpaid: { bg: 'var(--gold)',  label: 'Overpaid',   body: 'You paid a tourist premium — not robbery, but watch for it.' },
    scam:     { bg: 'var(--brand)', label: 'Scam-level', body: "More than 2× the local price. Walk away next time, or use the named alternative." },
  };
  const v = verdict && verdictMap[verdict];

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
              <Icon.tag size={16}/> Check
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
          {PRICE_DATA.map((p, i, arr) => (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', padding: '14px 18px', borderBottom: i < arr.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 13.5 }}>
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
  );
}

export function PhrasebookPage() {
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
  ];
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
  );
}

export function EmergencyPage() {
  const numbers = [
    { id: 1, label: 'Tourist Police (24/7 English)', num: '1155', tone: 'brand' },
    { id: 2, label: 'General emergency',             num: '191',  tone: 'teal'  },
    { id: 3, label: 'Ambulance',                     num: '1669', tone: 'brand' },
    { id: 4, label: 'Fire',                          num: '199',  tone: 'gold'  },
    { id: 5, label: 'Marine police',                 num: '1196', tone: 'teal'  },
    { id: 6, label: 'Crime suppression',             num: '1195', tone: 'brand' },
  ];
  const tones = { brand: 'var(--brand)', teal: 'var(--teal)', gold: 'var(--gold)' };
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">When things go sideways</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Emergency numbers</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, maxWidth: 520 }}>Save these now, not later. Tourist police speak English. Most others don't — use Google Translate.</p>
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
  );
}

export function SimFinderPage() {
  const carriers = [
    { name: 'AIS',        strength: 'Strongest in cities', cost: '฿299 / 7d' },
    { name: 'dtac',       strength: 'Best on islands',     cost: '฿299 / 7d' },
    { name: 'TrueMove H', strength: 'Cheapest data',       cost: '฿199 / 8d' },
  ];
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
  );
}
