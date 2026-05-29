'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  adminFetchPlaces,
  adminUploadPlacePhoto,
  adminRemovePlacePhoto,
  adminSavePlaceTags,
  type AdminPlaceRow,
} from '@/lib/db'
import { CATEGORIES } from '@/data'
import I from '@/components/ui/icons'

const CITY_LABEL: Record<string, string> = { bangkok: 'Bangkok', phuket: 'Phuket' }

const SUGGESTED_TAGS = [
  'buffet', 'all you can eat', 'rooftop', 'halal', 'vegetarian', 'vegan',
  'live music', 'cash only', 'BTS nearby', 'MRT nearby', 'late night',
  'family friendly', 'outdoor seating', 'sea view', 'river view', 'Michelin',
  'queue expected', 'reservation required', 'pet friendly', 'free wifi',
  'co-working', 'breakfast', 'brunch', 'street food', 'night market',
  'floating market', 'viewpoint', 'instagrammable', 'romantic', 'party',
  'backpacker', 'digital nomad', 'cheap eats', 'fine dining', 'set menu',
]

// ── Tag Editor ───────────────────────────────────────────────────────────────

function TagEditor({ place, onSaved }: { place: AdminPlaceRow; onSaved: (slug: string, tags: string[]) => void }) {
  const [tags, setTags]     = useState<string[]>(place.tags)
  const [input, setInput]   = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [err, setErr]       = useState<string | null>(null)
  const inputRef            = useRef<HTMLInputElement>(null)

  const dirty = JSON.stringify(tags) !== JSON.stringify(place.tags)

  const addTag = useCallback((raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/,+$/, '').trim()
    if (!tag || tags.includes(tag)) return
    setTags(prev => [...prev, tag])
    setInput('')
    setSaved(false)
  }, [tags])

  const removeTag = (t: string) => { setTags(prev => prev.filter(x => x !== t)); setSaved(false) }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input) }
    if (e.key === 'Backspace' && input === '' && tags.length > 0) removeTag(tags[tags.length - 1])
  }

  const handleSave = async () => {
    setSaving(true); setErr(null)
    const { error } = await adminSavePlaceTags(place.slug, tags)
    setSaving(false)
    if (error) { setErr(error); return }
    setSaved(true)
    onSaved(place.slug, tags)
  }

  const suggestions = SUGGESTED_TAGS.filter(s => !tags.includes(s) && (input === '' || s.includes(input.toLowerCase())))

  return (
    <div style={{ marginTop: 12, padding: 14, background: 'var(--bg-2)', borderRadius: 10 }}>
      <div className="mono" style={{ fontSize: 11, marginBottom: 8, color: 'var(--muted)' }}>SEARCH TAGS</div>

      {/* Chip row + input */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 10px',
          borderRadius: 8, border: '1px solid var(--line)', background: 'var(--bg)',
          cursor: 'text', minHeight: 42,
        }}
      >
        {tags.map(t => (
          <span key={t} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
            borderRadius: 999, background: 'var(--bg-deep)', color: 'var(--text-on-deep)',
            fontSize: 12, fontWeight: 500,
          }}>
            {t}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); removeTag(t) }}
              style={{ background: 'none', border: 0, cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, opacity: 0.7, display: 'flex' }}
              aria-label={`Remove ${t}`}
            >
              <I.x size={11}/>
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input) }}
          placeholder={tags.length === 0 ? 'Type a tag and press Enter…' : ''}
          style={{
            border: 0, outline: 'none', background: 'transparent', fontSize: 13,
            color: 'var(--text)', fontFamily: 'inherit', flex: 1, minWidth: 140,
          }}
        />
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 6 }}>
        Press <kbd style={{ padding: '1px 5px', borderRadius: 4, border: '1px solid var(--line)', fontSize: 11 }}>Enter</kbd> or comma to add · Backspace to remove last
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 5 }}>Suggested:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {suggestions.slice(0, 20).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="chip"
                style={{ fontSize: 11.5, padding: '3px 9px' }}
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {err && <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 8 }}>{err}</div>}

      {/* Save */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !dirty}
          style={{ fontSize: 13, gap: 6 }}
        >
          <I.check size={13}/> {saving ? 'Saving…' : 'Save tags'}
        </button>
        {saved && !dirty && (
          <span style={{ fontSize: 12, color: '#2D6A4F', display: 'flex', alignItems: 'center', gap: 4 }}>
            <I.check size={12}/> Saved
          </span>
        )}
        {tags.length > 0 && (
          <span style={{ fontSize: 11.5, color: 'var(--muted)', marginLeft: 'auto' }}>
            {tags.length} tag{tags.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function AdminPlacesPage() {
  const [places, setPlaces]           = useState<AdminPlaceRow[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [busy, setBusy]               = useState<string | null>(null)
  const [error, setError]             = useState<Record<string, string>>({})
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set())
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

  const handleTagsSaved = (slug: string, tags: string[]) => {
    setPlaces(prev => prev.map(p => p.slug === slug ? { ...p, tags } : p))
  }

  const toggleTags = (slug: string) =>
    setExpandedTags(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })

  const catLabel = (slug: string | null) =>
    CATEGORIES.find(c => c.id === slug)?.label ?? slug ?? '—'

  const withPhoto    = places.filter(p => p.photos.length > 0).length
  const withoutPhoto = places.length - withPhoto

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
        <h1 className="h2">Place photos &amp; tags</h1>
        {!loading && (
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
            {withPhoto} with photo · {withoutPhoto} need one
          </span>
        )}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>
        Upload a hero photo and add search tags per place. Tags let users find places using broad terms
        (e.g. &ldquo;buffet&rdquo;, &ldquo;halal&rdquo;, &ldquo;rooftop&rdquo;) even if those words don&apos;t appear in the name or description.
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
          const hasPhoto      = place.photos.length > 0
          const photoUrl      = place.photos[0]
          const isBusy        = busy === place.slug
          const errMsg        = error[place.slug]
          const tagsExpanded  = expandedTags.has(place.slug)

          return (
            <div key={place.slug} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
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
                  {place.tags.length > 0 && (
                    <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>
                      {place.tags.slice(0, 4).join(', ')}{place.tags.length > 4 ? ` +${place.tags.length - 4} more` : ''}
                    </div>
                  )}
                  {errMsg && <div style={{ fontSize: 12, color: 'var(--brand)', marginTop: 4 }}>{errMsg}</div>}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
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
                    {isBusy ? 'Uploading…' : hasPhoto ? <><I.camera size={14}/> Replace</> : <><I.camera size={14}/> Upload</>}
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
                  <button
                    className="btn"
                    onClick={() => toggleTags(place.slug)}
                    style={{ gap: 6, fontSize: 13, background: tagsExpanded ? 'var(--bg-deep)' : undefined, color: tagsExpanded ? 'var(--text-on-deep)' : undefined }}
                  >
                    <I.tag size={14}/> Tags {place.tags.length > 0 && `(${place.tags.length})`}
                  </button>
                </div>
              </div>

              {tagsExpanded && (
                <TagEditor place={place} onSaved={handleTagsSaved}/>
              )}
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
