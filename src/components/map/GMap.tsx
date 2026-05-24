'use client'
import dynamic from 'next/dynamic'
import type { CSSProperties } from 'react'
import type { Place } from '@/types'

const Inner = dynamic(() => import('./LeafletMapInner'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: '#EFE9DC' }} />,
})

interface GMapProps {
  pins?: Place[]
  selectedId?: string | null
  onSelect?: (place: Place) => void
  city?: string
  style?: CSSProperties
}

export function GMap({ style, ...props }: GMapProps) {
  return (
    <div className="gmap" style={style}>
      <Inner {...props} />
    </div>
  )
}
