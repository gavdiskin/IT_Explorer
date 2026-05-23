'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminSaveGuide, type GuideRow } from '@/lib/db'
import type { GuideStep } from '@/types'
import I from '@/components/ui/icons'

const AREAS = ['Transport', 'Paperwork', 'Setup', 'Long stay', 'Money', 'Streetwise', 'Climate', 'Health', 'Food', 'Culture']

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

const EMPTY: Omit<GuideRow, 'created_at' | 'updated_at'> = {
  id: '', title: '', mins: 5, area: 'Setup', body: '',
  steps: [], warnings: [], cover_url: null, status: 'published', sort_order: 0,
}

export default function GuideEditor({ initial }: { initial?: GuideRow }) {
  const router = useRouter()
  const isNew = !initial
  const [form, setForm] = useState<Omit<GuideRow, 'created_at' | 'updated_at'>>(
    initial ? { ...initial } : { ...EMPTY }
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const setStep = (i: number, field: keyof GuideStep, val: string) =>
    set('steps', form.steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s))

  const addStep = () => set('steps', [...form.steps, { title: '', detail: '' }])
  const removeStep = (i: number) => set('steps', form.steps.filter((_, idx) => idx !== i))
  const moveStep = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= form.steps.length) return
    const next = [...form.steps]
    ;[next[i], next[j]] = [next[j], next[i]]
    set('steps', next)
  }

  const setWarning = (i: number, val: string) =>
    set('warnings', form.warnings.map((w, idx) => idx === i ? val : w))
  const addWarning = () => set('warnings', [...form.warnings, ''])
  const removeWarning = (i: number) => set('warnings', form.warnings.filter((_, idx) => idx !== i))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    const id = isNew ? slugify(form.title) : form.id
    if (!id) { setSaveError('Title is required to generate an ID.'); setSaving(false); return }
    const { error } = await adminSaveGuide({ ...form, id })
    setSaving(false)
    if (error) { setSaveError(error); return }
    setSaved(true)
    setTimeout(() => {
      router.push('/admin/guides')
    }, 800)
  }

  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }
  const labelStyle: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }

  return (
    <form onSubmit={handleSave}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="mono" style={{ color: 'var(--muted)', marginBottom: 4 }}>
            {isNew ? 'New guide' : `Editing: ${initial.id}`}
          </div>
          <h1 className="h2">{isNew ? 'Create guide' : 'Edit guide'}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn" onClick={() => router.push('/admin/guides')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving || saved}>
            {saved ? <><I.check size={15}/> Saved!</> : saving ? 'Saving…' : <><I.check size={15}/> {isNew ? 'Publish guide' : 'Save changes'}</>}
          </button>
        </div>
      </div>

      {saveError && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: '#C13D2F12', color: 'var(--brand)', fontSize: 13, marginBottom: 20 }}>
          {saveError}
        </div>
      )}

      {/* ── Meta ─────────────────────────────────────────────────────── */}
      <section className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16, letterSpacing: '.06em' }}>METADATA</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'end' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>TITLE *</label>
            <input className="input" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. How to get a Thai bank account"/>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>AREA</label>
            <select className="select" value={form.area} onChange={e => set('area', e.target.value)}>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>EST. MINS</label>
            <input className="input" type="number" min={1} max={60} value={form.mins}
              onChange={e => set('mins', Number(e.target.value))} style={{ width: 80 }}/>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'end', marginTop: 14 }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>COVER IMAGE URL</label>
            <input className="input" value={form.cover_url ?? ''} onChange={e => set('cover_url', e.target.value || null)}
              placeholder="https://... (paste any public image URL)"/>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>STATUS</label>
            <select className="select" value={form.status} onChange={e => set('status', e.target.value as 'published' | 'draft')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {form.cover_url && (
          <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', maxHeight: 180, background: 'var(--bg-2)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.cover_url} alt="cover preview" style={{ width: '100%', height: 180, objectFit: 'cover' }}/>
          </div>
        )}
      </section>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <section className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14, letterSpacing: '.06em' }}>INTRO / SUMMARY</div>
        <div style={fieldStyle}>
          <label style={labelStyle}>BODY *</label>
          <textarea className="textarea" required rows={4} value={form.body}
            onChange={e => set('body', e.target.value)}
            placeholder="2–4 sentence summary shown at the top of the guide. Direct, specific, no filler."/>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────────────────────── */}
      <section className="card" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>STEP BY STEP ({form.steps.length})</div>
          <button type="button" className="btn" style={{ fontSize: 12, padding: '5px 10px' }} onClick={addStep}>
            <I.plus size={13}/> Add step
          </button>
        </div>
        {form.steps.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
            No steps yet. <button type="button" style={{ color: 'var(--brand)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }} onClick={addStep}>Add the first step</button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {form.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 8 }}>{i + 1}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input className="input" value={s.title} onChange={e => setStep(i, 'title', e.target.value)} placeholder="Step title"/>
                <textarea className="textarea" rows={2} value={s.detail} onChange={e => setStep(i, 'detail', e.target.value)} placeholder="Specific details — prices, addresses, what to say or do."/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, marginTop: 4 }}>
                <button type="button" className="btn btn-sq" style={{ padding: 6, fontSize: 11 }} onClick={() => moveStep(i, -1)} disabled={i === 0}><I.chevD size={12} style={{ transform: 'rotate(180deg)' }}/></button>
                <button type="button" className="btn btn-sq" style={{ padding: 6, fontSize: 11 }} onClick={() => moveStep(i, 1)} disabled={i === form.steps.length - 1}><I.chevD size={12}/></button>
                <button type="button" className="btn btn-sq" style={{ padding: 6, color: 'var(--brand)' }} onClick={() => removeStep(i)}><I.x size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Warnings ─────────────────────────────────────────────────── */}
      <section className="card" style={{ padding: 22, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '.06em' }}>WARNINGS / WATCH OUT FOR ({form.warnings.length})</div>
          <button type="button" className="btn" style={{ fontSize: 12, padding: '5px 10px' }} onClick={addWarning}>
            <I.plus size={13}/> Add warning
          </button>
        </div>
        {form.warnings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '14px 0', color: 'var(--muted)', fontSize: 13 }}>
            No warnings. <button type="button" style={{ color: 'var(--brand)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }} onClick={addWarning}>Add one</button>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {form.warnings.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <I.warning size={15} style={{ color: '#9A6E15', flexShrink: 0 }}/>
              <input className="input" style={{ flex: 1 }} value={w} onChange={e => setWarning(i, e.target.value)} placeholder="e.g. Touts inside the terminal are not official taxi drivers"/>
              <button type="button" className="btn btn-sq" style={{ padding: 6, color: 'var(--brand)', flexShrink: 0 }} onClick={() => removeWarning(i)}><I.x size={13}/></button>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button type="button" className="btn" onClick={() => router.push('/admin/guides')}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving || saved}>
          {saved ? <><I.check size={15}/> Saved!</> : saving ? 'Saving…' : <><I.check size={15}/> {isNew ? 'Publish guide' : 'Save changes'}</>}
        </button>
      </div>
    </form>
  )
}
