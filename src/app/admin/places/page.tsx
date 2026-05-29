'use client'

import { useEffect, useRef, useState } from 'react'
import {
  adminFetchPlaces,
  adminUploadPlacePhoto,
  adminRemovePlacePhoto,
  type AdminPlaceRow,
} from '@/lib/db'
import { CATEGORIES } from '@/data'
import I from '@/components/ui/icons'

const CITY_LABEL: Record<string, string> = { bangkok: 'Bangkok', phuket: 'Phuket' }

export default function AdminPlacesPage() {
  const [places, setPlaces]         = useState<AdminPlaceRow[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [busy, setBusy]             = useState<string | null>(null)
  const [error, setError]           = useState<Record<string, string>>({})
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    adminFetchPlaces().then(rows => { setPlaces(rows); setLoading(false) })
  }, [])

  const filtered = places.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.city ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.area ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const setErr = (slug: string, msg: string) =>
    setError(prev => ({ ...prev, [slug]: msg }))
  const clearErr = (slug: string) =>
    setError(prev => { const n = { ...prev }; delete n[slug]; return n })

  const handleUpload = async (slug: string, file: File) => {
    clearErr(slug)
    setBusy(slug)
    const { url, error: err } = await adminUploadPlacePhoto(slug, file)
    if (err) { setErr(slug, err); setBusy(null); return }
    setPlaces(prev => prev.map(p => p.slug === slug ? { ...p, photos: [url!] } : p))
    setBusy(null)
  }

  const handleRemove = async (slug: string) => {
    clearErr(slug)
    setBusy(slug)
    const { error: err } = await adminRemovePlacePhoto(slug)
    if (err) { setErr(slug, err); setBusy(null); return }
    setPlaces(prev => prev.map(p => p.slug === slug ? { ...p, photos: [] } : p))
    setBusy(null)
  }

  const catLabel = (slug: string | null) =>
    CATEGORIES.find(c => c.id === slug)?.label ?? slug ?? '—'

  const withPhoto    = places.filter(p => p.photos.length > 0).length
  const withoutPhoto = places.length - withPhoto

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
        <h1 className="h2">Place photos</h1>
        {!loading && (
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
            {withPhoto} with photo · {withoutPhoto} need one
          </span>
        )}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>
        Upload one hero photo per place (JPEG / PNG / WebP, max 5 MB). It replaces the placeholder everywhere on the site.
      </p>

      <input
        className="input"
        placeholder="Filter by name, city or area…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ maxWidth: 340, marginBottom: 20 }}
      />

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(place => {
          const hasPhoto  = place.photos.length > 0
          const photoUrl  = place.photos[0]
          const isBusy    = busy === place.slug
          const errMsg    = error[place.slug]

          return (
            <div key={place.slug} className="card" style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Thumbnail */}
              <div style={{
                width: 72, height: 52, borderRadius: 10, flexShrink: 0, overflow: 'hidden',
                background: 'var(--bg-2)', border: '1px solid var(--line)',
                display: 'grid', placeItems: 'center', position: 'relative',
              }}>
                {hasPhoto ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={photoUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                ) : (
                  <span style={{ color: 'var(--muted)', opacity: 0.5, display: 'flex' }}><I.image size={20} stroke={1.5}/></span>
                )}
              </div>

              {/* Meta */}
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{place.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {[CITY_LABEL[place.city ?? ''] ?? place.city, place.area, catLabel(place.category_slug)]
                    .filter(Boolean).join(' · ')}
                </div>
                {errMsg && <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 4 }}>{errMsg}</div>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <input
                  ref={el => { fileRefs.current[place.slug] = el }}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  style={{ display: 'none' }}
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) handleUpload(place.slug, f)
                    e.target.value = ''
                  }}
                />
                <button
                  className="btn btn-primary"
                  disabled={isBusy}
                  onClick={() => fileRefs.current[place.slug]?.click()}
                  style={{ gap: 6, fontSize: 13 }}
                >
                  {isBusy ? (
                    'Uploading…'
                  ) : hasPhoto ? (
                    <><I.camera size={14}/> Replace</>
                  ) : (
                    <><I.camera size={14}/> Upload</>
                  )}
                </button>
                {hasPhoto && (
                  <button
                    className="btn"
                    disabled={isBusy}
                    onClick={() => handleRemove(place.slug)}
                    style={{ gap: 6, fontSize: 13, color: 'var(--brand)' }}
                  >
                    <I.x size={14}/> Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          No places match &ldquo;{search}&rdquo;.
        </div>
      )}
    </>
  )
}
