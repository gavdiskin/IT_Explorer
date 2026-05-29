'use client'

import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import { CATEGORIES } from '@/data'
import type { Place } from '@/types'
import I from './icons'
import { PlaceImage } from './PlaceImage'
import { StarRating } from './StarRating'
import { PriceMark } from './PriceMark'

interface PlaceCardProps {
  place: Place
  compact?: boolean
  showCity?: boolean
}

function cityLabel(id: string | undefined) {
  if (!id) return ''
  if (id === 'bangkok') return 'Bangkok'
  if (id === 'phuket') return 'Phuket'
  return id
}

export function PlaceCard({ place, compact, showCity }: PlaceCardProps) {
  const savedSet = useUIStore(s => s.savedSet)
  const toggleSave = useUIStore(s => s.toggleSave)
  const cat = CATEGORIES.find(c => c.id === place.category)
  const saved = savedSet.has(place.id)

  if (compact) {
    return (
      <Link href={`/places/${place.id}`} className="card card-hov" style={{ display: 'flex', gap: 12, padding: 10, alignItems: 'center' }}>
        <PlaceImage src={place.photos?.[0]} alt={place.name} tone={place.slot.tone} label={place.slot.label.split(' ')[0]} h={64} style={{ width: 84, flexShrink: 0, padding: 8 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="place-card__title" style={{ fontSize: 14 }}>{place.name}</div>
          <div className="place-card__meta">
            {cat?.label} · {place.area}
            {showCity && place.city ? ` · ${cityLabel(place.city)}` : ''}
          </div>
          <div className="place-card__row" style={{ marginTop: 5 }}>
            <StarRating value={place.rating}/>
            <span className="dot-sep"/>
            <PriceMark n={place.price}/>
            <span className="dot-sep"/>
            <span className={place.open ? 'badge-open' : 'badge-closed'}>{place.open ? 'Open' : 'Closed'}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(place.id) }}
          className="btn btn-sq btn-ghost"
          aria-label={saved ? 'Saved' : 'Save'}
          style={{ color: saved ? 'var(--brand)' : 'var(--muted)' }}
        >
          {saved ? <I.bookmarkFill size={18}/> : <I.bookmark size={18}/>}
        </button>
      </Link>
    )
  }

  return (
    <Link href={`/places/${place.id}`} className="place-card">
      <PlaceImage src={place.photos?.[0]} alt={place.name} tone={place.slot.tone} label={place.slot.label} sub={place.slot.sub} h={170} tag={cat?.label} style={{ borderRadius: 0 }}/>
      <div className="place-card__body">
        <div className="place-card__title">{place.name}</div>
        <div className="place-card__meta">
          {place.area}{place.area && place.city && ' · '}
          {place.city === 'bangkok' ? 'Bangkok' : place.city === 'phuket' ? 'Phuket' : ''}
        </div>
        <div className="place-card__row">
          <StarRating value={place.rating} reviews={place.reviews}/>
          <span className="dot-sep"/>
          <PriceMark n={place.price}/>
          <span className="dot-sep"/>
          <span className={place.open ? 'badge-open' : 'badge-closed'}>{place.open ? 'Open' : 'Closed'}</span>
        </div>
      </div>
    </Link>
  )
}
