import I from './icons'

interface StarRatingProps {
  value?: number
  reviews?: number
}

export function StarRating({ value = 4.5, reviews }: StarRatingProps) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
      <I.star size={13} />
      <span style={{ fontWeight: 700 }}>{value.toFixed(1)}</span>
      {reviews != null && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({reviews.toLocaleString()})</span>}
    </span>
  )
}
