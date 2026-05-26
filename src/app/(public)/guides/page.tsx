import Link from 'next/link'
import { GUIDES, ESSENTIAL_APPS } from '@/data'
import { fetchPublicGuides, fetchPublicApps } from '@/lib/db'
import { SectionHead } from '@/components/ui/SectionHead'
import I from '@/components/ui/icons'
import type { Guide, EssentialApp } from '@/types'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How-to Guides — Inside Thailand',
  description: 'Practical step-by-step guides for living and travelling in Thailand — SIM cards, visas, bank accounts, and transport apps.',
}

export default async function GuidesPage() {
  const [dbGuides, dbApps] = await Promise.all([fetchPublicGuides(), fetchPublicApps()])
  const guides: Guide[] = dbGuides.length > 0 ? dbGuides : GUIDES
  const apps: EssentialApp[] = dbApps.length > 0 ? dbApps : ESSENTIAL_APPS

  const groups: Record<string, Guide[]> = {}
  guides.forEach(g => { (groups[g.area] = groups[g.area] || []).push(g) })

  return (
    <main className="route-mount">
      <section className="wrap" style={{ padding: '32px 0 24px' }}>
        <div className="mono">Practical · step by step</div>
        <h1 className="h1" style={{ marginTop: 10 }}>How-to guides</h1>
        <p style={{ color: 'var(--muted)', maxWidth: 560, marginTop: 10, marginBottom: 0 }}>
          The annoying-but-necessary stuff. SIM cards, visas, banks, transport apps — all the things people end up googling at 11pm in a hostel.
        </p>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {Object.entries(groups).map(([area, items]) => (
            <div key={area} className="card" style={{ padding: 20 }}>
              <div className="mono" style={{ marginBottom: 12 }}>{area}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {items.map(g => (
                  <Link key={g.id} href={`/guides/${g.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderRadius: 10, color: 'var(--text)' }}>
                    {g.cover_url && (
                      <div style={{ width: 40, height: 30, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{g.title}</div>
                      <div className="mono" style={{ marginTop: 2 }}>{g.mins} min read</div>
                    </div>
                    <I.chevR size={16}/>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ marginBottom: 56 }}>
        <SectionHead kicker="Setup" title="Essential apps for Thailand"/>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {apps.map(app => (
            <div key={app.id} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: '#C13D2F18', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                {app.icon_char || app.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{app.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{app.use}</div>
                {(app.ios_url || app.android_url) && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {app.ios_url && (
                      <a href={app.ios_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#00000010', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                        App Store
                      </a>
                    )}
                    {app.android_url && (
                      <a href={app.android_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: '#00000010', color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
                        Google Play
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
