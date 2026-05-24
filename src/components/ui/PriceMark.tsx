interface PriceMarkProps {
  n?: number
}

export function PriceMark({ n = 1 }: PriceMarkProps) {
  const clamped = Math.min(4, Math.max(1, n))
  return (
    <span className="mono" style={{ color: 'var(--muted)', textTransform: 'none', letterSpacing: '.04em', fontSize: 11 }}>
      <span style={{ color: 'var(--text)' }}>{'฿'.repeat(clamped)}</span>
      <span style={{ color: 'var(--line-2)' }}>{'฿'.repeat(4 - clamped)}</span>
    </span>
  )
}
