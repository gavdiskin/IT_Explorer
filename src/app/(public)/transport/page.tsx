import Link from 'next/link'
import { STATIONS } from '@/data'
import { SectionHead } from '@/components/ui/SectionHead'
import I from '@/components/ui/icons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bangkok Transport Guide · BTS, MRT & More — Inside Thailand',
  description: 'BTS Skytrain, MRT Metro, Airport Rail Link — fares, stations, and what each area is actually known for.',
}

const modes = [
  { id: 'bts',  name: 'BTS Skytrain',      color: '#1F8A5B', icon: 'train',      cost: '฿17–62',    summary: 'Elevated train. Cleanest, most reliable.' },
  { id: 'mrt',  name: 'MRT Metro',         color: '#1F6FB4', icon: 'metro',      cost: '฿17–70',    summary: 'Underground. Connects to BTS at Asok/Sukhumvit.' },
  { id: 'arl',  name: 'Airport Rail Link', color: '#9C2A6E', icon: 'planeTrain', cost: '฿15–45',    summary: 'Cheapest airport-to-city route. 26 min Phaya Thai → Suvarnabhumi.' },
  { id: 'bus',  name: 'Local buses',       color: '#D9A23A', icon: 'bus',        cost: '฿8–25',     summary: 'Old red buses are free. Air-con white ones cost more.' },
  { id: 'moto', name: 'Motorbike taxis',   color: '#C13D2F', icon: 'moto',       cost: '฿20–80',    summary: 'Fastest way through Bangkok traffic.' },
  { id: 'tuk',  name: 'Tuk-tuks',          color: '#7B5E3A', icon: 'moto',       cost: 'Negotiate', summary: 'Touristy. Never on the meter. Bolt cheaper.' },
]

const costs = [
  ['BTS Skytrain', '฿17–62'],
  ['MRT Metro', '฿17–70'],
  ['Airport Rail Link', '฿15–45'],
  ['City taxi (start)', '฿35 + ฿2/100m'],
  ['Motorbike taxi short', '฿20–40'],
  ['Tuk-tuk (avoid)', '฿100+ negotiate'],
  ['Grab/Bolt 5km', '฿80–140'],
]

export default function TransportPage() {
  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Getting around</div>
        <h1 className="h1" style={{ marginTop: 10 }}>Transport · Bangkok</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 560, marginTop: 10 }}>
          Six ways across the city. Which one wins depends on the hour, the area, and how much you mind being stuck in traffic.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start', background: '#FCEFD3', boxShadow: 'inset 0 0 0 1px #D9A23A40' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gold)', color: '#1B1816', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <I.planeTrain size={22}/>
          </div>
          <div>
            <h3 className="h3" style={{ margin: 0 }}>Airport → Bangkok center</h3>
            <p style={{ marginTop: 6, marginBottom: 0, fontSize: 14, lineHeight: 1.55 }}>
              <strong>Suvarnabhumi:</strong> Airport Rail Link ฿45, 26 min. &nbsp;
              <strong>Don Mueang:</strong> A1 bus to Mo Chit BTS ฿30, 30 min. &nbsp;
              <strong>Taxi:</strong> ฿250–400 + ฿70 expressway.
            </p>
            <Link href="/guides/airport" className="btn btn-dark" style={{ marginTop: 12 }}>Read full guide →</Link>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 48 }}>
        <SectionHead title="Mode by mode"/>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {modes.map(m => {
            const Ic = I[m.icon] || I.dot
            return (
              <div key={m.id} className="card" style={{ display: 'flex', gap: 12, padding: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: m.color, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}><Ic size={22}/></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                    <div className="h4">{m.name}</div>
                    <div className="mono" style={{ color: m.color, textTransform: 'none', letterSpacing: '.02em', fontSize: 11.5, fontWeight: 700 }}>{m.cost}</div>
                  </div>
                  <div style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{m.summary}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Popular stations" subtitle="Each station has its own personality. Tap any to see what&apos;s around it."/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {STATIONS.map(s => (
            <Link key={s.id} href={`/stations/${s.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, padding: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, color: '#fff', display: 'grid', placeItems: 'center' }}><I.train size={20}/></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.knownFor}</div>
              </div>
              <I.chevR size={16}/>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead title="Quick costs (Bangkok · 2026)"/>
        <div className="card card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          {costs.map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < costs.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 14 }}>
              <span>{k}</span>
              <span className="mono" style={{ color: 'var(--text)', fontSize: 12, textTransform: 'none', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
