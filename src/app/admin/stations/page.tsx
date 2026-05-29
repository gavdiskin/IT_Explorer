'use client'

import { useEffect, useState, useRef } from 'react'
import {
  adminFetchStations, adminSaveStation, adminDeleteStation, adminSetPlaceStation,
  adminFetchPlaces, type StationRow, type StationSavePayload, type AdminPlaceRow,
} from '@/lib/db'
import I from '@/components/ui/icons'

const BLANK: StationRow = {
  id: '', name: '', line: 'BTS Sukhumvit', color: '#1F8A5B',
  known_for: '', city: 'bangkok', sort_order: 0, active: true,
}

const LINE_PRESETS = ['BTS Sukhumvit', 'BTS Silom', 'MRT Blue', 'MRT Purple', 'Airport Rail Link', 'BTS Gold', 'Other']
const COLOR_PRESETS = ['#1F8A5B', '#9C2A6E', '#1F6FB4', '#D9A23A', '#C13D2F', '#7B5E3A']

export default function AdminStationsPage() {
  const [stations, setStations] = useState<StationRow[]>([])
  const [places, setPlaces] = useState<AdminPlaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<StationRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState<string | null>(null)
  const [placeFilter, setPlaceFilter] = useState('')
  // slug → 'saving' | 'saved' | error string
  const [assignState, setAssignState] = useState<Record<string, string>>({})
  const assignTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const reload = async () => {
    setLoading(true)
    const [s, p] = await Promise.all([adminFetchStations(), adminFetchPlaces()])
    setStations(s)
    setPlaces(p)
    setLoading(false)
  }

  useEffect(() => { reload() }, [])

  async function save() {
    if (!editing) return
    if (!editing.id.trim() || !editing.name.trim()) { setFormErr('ID and Name are required'); return }
    if (!/^[a-z0-9-]+$/.test(editing.id.trim())) { setFormErr('ID must be lowercase letters, numbers and hyphens only'); return }
    setSaving(true); setFormErr(null)
    const payload: StationSavePayload = {
      id: editing.id.trim(),
      name: editing.name.trim(),
      line: editing.line.trim(),
      color: editing.color,
      known_for: editing.known_for.trim(),
      city: editing.city,
      sort_order: Number(editing.sort_order) || 0,
      active: editing.active,
    }
    const { error } = await adminSaveStation(payload)
    setSaving(false)
    if (error) { setFormErr(error); return }
    setEditing(null)
    reload()
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete station "${name}"? Places assigned to it will lose their station link.`)) return
    await adminDeleteStation(id)
    reload()
  }

  async function assignStation(placeSlug: string, stationId: string) {
    const val = stationId === '' ? null : stationId
    setPlaces(prev => prev.map(p => p.slug === placeSlug ? { ...p, nearest_station: val } : p))
    setAssignState(s => ({ ...s, [placeSlug]: 'saving' }))
    clearTimeout(assignTimers.current[placeSlug])

    const { error } = await adminSetPlaceStation(placeSlug, val)
    setAssignState(s => ({ ...s, [placeSlug]: error ?? 'saved' }))
    assignTimers.current[placeSlug] = setTimeout(() => {
      setAssignState(s => { const n = { ...s }; delete n[placeSlug]; return n })
    }, 2000)
  }

  const field = (label: string, node: React.ReactNode) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="mono" style={{ fontSize: 11 }}>{label}</label>
      {node}
    </div>
  )

  const inp = (key: keyof StationRow, placeholder = '') => (
    <input
      className="input"
      value={(editing?.[key] ?? '') as string}
      placeholder={placeholder}
      onChange={e => setEditing(prev => prev ? { ...prev, [key]: e.target.value } : prev)}
    />
  )

  const filteredPlaces = places.filter(p =>
    !placeFilter || p.name.toLowerCase().includes(placeFilter.toLowerCase()) || (p.area ?? '').toLowerCase().includes(placeFilter.toLowerCase())
  )

  return (
    <div>
      {/* ── Header ─────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 className="h2" style={{ margin: 0 }}>Stations</h1>
          {!loading && (
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              {stations.filter(s => s.active).length} active · {stations.length} total
            </div>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...BLANK }); setIsNew(true); setFormErr(null) }}>
          <I.plus size={16}/> New station
        </button>
      </div>

      {/* ── Edit / create form ─────────────── */}
      {editing && (
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 className="h3" style={{ margin: '0 0 20px' }}>{isNew ? 'New station' : `Edit: ${editing.name}`}</h3>
          {formErr && <p style={{ color: 'var(--brand)', fontSize: 13, marginBottom: 12 }}>{formErr}</p>}
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: '1fr 1fr' }}>
            {field(
              'ID (slug, permanent) *',
              <input
                className="input"
                value={editing.id}
                placeholder="e.g. bts-phrom-phong"
                disabled={!isNew}
                onChange={e => setEditing(prev => prev ? { ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') } : prev)}
                style={{ opacity: isNew ? 1 : 0.6 }}
              />
            )}
            {field('Name *', inp('name', 'e.g. BTS Phrom Phong'))}
            {field(
              'Line',
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  className="input"
                  value={editing.line}
                  placeholder="e.g. BTS Sukhumvit"
                  onChange={e => setEditing(prev => prev ? { ...prev, line: e.target.value } : prev)}
                  style={{ flex: 1 }}
                />
                <select
                  className="select"
                  value=""
                  onChange={e => { if (e.target.value) setEditing(prev => prev ? { ...prev, line: e.target.value } : prev) }}
                  style={{ fontSize: 12, padding: '7px 8px', borderRadius: 8 }}
                >
                  <option value="">Preset…</option>
                  {LINE_PRESETS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
            {field(
              'Color',
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="color"
                  value={editing.color}
                  onChange={e => setEditing(prev => prev ? { ...prev, color: e.target.value } : prev)}
                  style={{ width: 40, height: 36, borderRadius: 8, border: '1px solid var(--line)', cursor: 'pointer', padding: 2 }}
                />
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c}
                    onClick={() => setEditing(prev => prev ? { ...prev, color: c } : prev)}
                    style={{ width: 24, height: 24, borderRadius: 6, background: c, border: editing.color === c ? '2px solid var(--text)' : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }}
                  />
                ))}
                <span className="mono" style={{ fontSize: 11 }}>{editing.color}</span>
              </div>
            )}
            {field('Known for', inp('known_for', 'e.g. EmQuartier, Benjasiri Park'))}
            {field(
              'City',
              <select
                className="select"
                value={editing.city}
                onChange={e => setEditing(prev => prev ? { ...prev, city: e.target.value } : prev)}
                style={{ fontSize: 13, padding: '8px 10px', borderRadius: 8 }}
              >
                <option value="bangkok">Bangkok</option>
                <option value="phuket">Phuket</option>
              </select>
            )}
            {field('Sort order', inp('sort_order', '0'))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18, alignItems: 'center' }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={editing.active}
                onChange={e => setEditing(prev => prev ? { ...prev, active: e.target.checked } : prev)}/>
              Active (visible on transport page)
            </label>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-ghost" onClick={() => { setEditing(null); setFormErr(null) }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save station'}</button>
          </div>
        </div>
      )}

      {/* ── Station list ───────────────────── */}
      {loading && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48 }}>
        {stations.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color, color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <I.train size={18}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</span>
                <span className="tag" style={{ fontSize: 10, background: s.color + '18', color: s.color }}>{s.line}</span>
                {!s.active && <span className="tag" style={{ fontSize: 10, background: '#00000010', color: 'var(--muted)' }}>hidden</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.known_for}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', minWidth: 28, textAlign: 'center' }}>#{s.sort_order}</div>
            <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => { setEditing({ ...s }); setIsNew(false); setFormErr(null) }}>
              <I.edit size={13}/> Edit
            </button>
            <button className="btn btn-sq" style={{ background: 'transparent', color: 'var(--brand)' }} onClick={() => del(s.id, s.name)}>
              <I.trash size={14}/>
            </button>
          </div>
        ))}
        {!loading && stations.length === 0 && <p style={{ color: 'var(--muted)', fontSize: 14 }}>No stations yet.</p>}
      </div>

      {/* ── Place → Station assignments ────── */}
      <div style={{ borderTop: '1px solid var(--line)', paddingTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 className="h3" style={{ margin: 0 }}>Place → Station assignments</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4, marginBottom: 0 }}>
              Set which station each place is nearest to. Changes save immediately.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <I.search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' } as React.CSSProperties}/>
            <input
              className="input"
              placeholder="Filter places…"
              value={placeFilter}
              onChange={e => setPlaceFilter(e.target.value)}
              style={{ paddingLeft: 30, width: 220 }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filteredPlaces.map(p => {
            const state = assignState[p.slug]
            return (
              <div key={p.slug} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.area}{p.city ? ` · ${p.city}` : ''}</div>
                </div>
                <select
                  className="select"
                  value={p.nearest_station ?? ''}
                  onChange={e => assignStation(p.slug, e.target.value)}
                  style={{ fontSize: 12, padding: '5px 8px', borderRadius: 8, minWidth: 180 }}
                >
                  <option value="">— No station —</option>
                  {stations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {state === 'saving' && <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 40 }}>saving…</span>}
                {state === 'saved' && <span style={{ fontSize: 11, color: '#2D6A4F', minWidth: 40 }}>saved</span>}
                {state && state !== 'saving' && state !== 'saved' && <span style={{ fontSize: 11, color: 'var(--brand)', minWidth: 40 }}>error</span>}
              </div>
            )
          })}
          {!loading && filteredPlaces.length === 0 && (
            <div style={{ color: 'var(--muted)', fontSize: 13, padding: 16 }}>No places match.</div>
          )}
        </div>
      </div>
    </div>
  )
}
