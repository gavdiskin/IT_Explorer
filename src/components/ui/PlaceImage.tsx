'use client'

import { useState, type ComponentProps } from 'react'
import { Slot } from './Slot'

type Props = ComponentProps<typeof Slot> & {
  /** First real photo URL, if the place has one. Falls back to the Slot placeholder. */
  src?: string
  alt?: string
}

// Shows a real photo when a place has one, otherwise renders the existing
// hand-drawn Slot placeholder. Same prop surface as Slot so call sites just add
// `src={place.photos?.[0]}` — sizing (h/aspect), tag and style are preserved.
// If the image 404s or fails to load we fall straight back to the Slot.
export function PlaceImage({ src, alt, ...slot }: Props) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) return <Slot {...slot} />

  const { h, aspect = '4/3', tag, style } = slot
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius)',
        height: h,
        aspectRatio: h ? undefined : aspect,
        ...style,
        overflow: 'hidden',
        padding: 0,
      }}
    >
      {tag && <span className="slot__tag">{tag}</span>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        onError={() => setErrored(true)}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  )
}
