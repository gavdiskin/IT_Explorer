interface PriceMarkProps {
  n?: number
}

export function PriceMark({ n }: PriceMarkProps) {
  // No price level known yet — show a neutral dash rather than a fabricated "฿฿".
  if (!n || n < 1) {
    return (
      <span className="mono" style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: '.04em', fontSize: 11 }}>
        —
      </span>
    )
  }
  const clamped = Math.min(4, Math.max(1, n))
  return (
    <span className="mono" style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: '.04em', fontSize: 11 }}>
      <span style={{ color: 'var(--text)' }}>{'฿'.repeat(clamped)}</span>
      <span style={{ color: 'var(--line-2)' }}>{'฿'.repeat(4 - clamped)}</span>
    </span>
  )
}
