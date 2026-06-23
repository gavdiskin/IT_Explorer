import I from './icons'

interface StarRatingProps {
  value?: number
  reviews?: number
}

export function StarRating({ value, reviews }: StarRatingProps) {
  // No rating yet (e.g. a place scraped from a list with no Google/editorial score):
  // show a neutral "New" rather than a misleading "0.0".
  if (!value) {
    return (
      <span className="mono" style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'none', letterSpacing: '.02em' }}>
        New
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
      <I.star size={13} />
      <span style={{ fontWeight: 700 }}>{value.toFixed(1)}</span>
      {reviews != null && <span style={{ color: 'var(--muted)', fontWeight: 400 }}>({reviews.toLocaleString()})</span>}
    </span>
  )
}
