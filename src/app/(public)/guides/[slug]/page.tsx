import { notFound } from 'next/navigation'
import Link from 'next/link'
import { GUIDES } from '@/data'
import { fetchPublicGuide } from '@/lib/db'
import I from '@/components/ui/icons'
import { AdminEditLink } from '@/components/ui/AdminEditLink'
import type { Guide } from '@/types'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.id }))
}

async function getGuide(slug: string): Promise<Guide | null> {
  const db = await fetchPublicGuide(slug)
  if (db) return db
  return GUIDES.find(x => x.id === slug) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const g = await getGuide(slug)
  if (!g) return {}
  return {
    title: `${g.title} — Inside Thailand`,
    description: g.body.slice(0, 155),
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await getGuide(slug)
  if (!g) notFound()

  return (
    <main className="wrap route-mount" style={{ padding: '24px var(--gutter) 64px', maxWidth: 860 }}>
      <div className="mono" style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/guides" style={{ color: 'var(--muted)' }}>← All guides</Link>
        <AdminEditLink href={`/admin/guides/${g.id}`}/>
      </div>

      <div className="tag" style={{ background: '#C13D2F20', color: 'var(--brand)' }}>{g.area} · {g.mins} min</div>
      <h1 className="h1" style={{ marginTop: 12 }}>{g.title}</h1>

      {g.cover_url && (
        <div style={{ marginTop: 20, borderRadius: 16, overflow: 'hidden', maxHeight: 320 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={g.cover_url} alt={g.title} style={{ width: '100%', height: 320, objectFit: 'cover' }}/>
        </div>
      )}

      <p style={{ marginTop: 18, fontSize: 17, lineHeight: 1.6 }}>{g.body}</p>

      {g.steps && g.steps.length > 0 && (
        <>
          <h3 className="h3" style={{ marginTop: 32 }}>Step by step</h3>
          <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
            {g.steps.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div className="h4">{s.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, lineHeight: 1.55 }}>{s.detail}</div>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}

      {g.warnings && g.warnings.length > 0 && (
        <div className="card" style={{ marginTop: 32, padding: 18, background: '#FFF4E5', boxShadow: 'inset 0 0 0 1px #D9A23A40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9A6E15', marginBottom: 8 }}>
            <I.warning size={20}/>
            <span className="h4" style={{ color: '#9A6E15' }}>Watch out for</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6, color: '#5C4615' }}>
            {g.warnings.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      )}
    </main>
  )
}
