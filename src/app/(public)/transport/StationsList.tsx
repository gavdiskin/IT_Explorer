'use client'

import Link from 'next/link'
import { useStations } from '@/hooks/usePlaces'
import I from '@/components/ui/icons'

export function StationsList() {
  const { stations } = useStations('bangkok')

  return (
    <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
      {stations.map(s => (
        <Link key={s.id} href={`/stations/${s.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, padding: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, color: '#fff', display: 'grid', placeItems: 'center' }}>
            <I.train size={20}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{s.knownFor}</div>
          </div>
          <I.chevR size={16}/>
        </Link>
      ))}
    </div>
  )
}
