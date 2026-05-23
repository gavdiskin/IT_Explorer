'use client'

import { useEffect, useState } from 'react'
import { adminFetchGuides, type GuideRow } from '@/lib/db'
import GuideEditor from '../GuideEditor'

export default function EditGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const [guide, setGuide] = useState<GuideRow | null | undefined>(undefined)

  useEffect(() => {
    params.then(({ id }) =>
      adminFetchGuides().then(guides => {
        setGuide(guides.find(g => g.id === id) ?? null)
      })
    )
  }, [params])

  if (guide === undefined) return <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>
  if (guide === null) return <div style={{ color: 'var(--brand)' }}>Guide not found.</div>
  return <GuideEditor initial={guide}/>
}
