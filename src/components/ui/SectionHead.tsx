import type { ReactNode } from 'react'

interface SectionHeadProps {
  kicker?: string
  title: string
  subtitle?: string
  action?: ReactNode
  badge?: string
}

export function SectionHead({ kicker, title, subtitle, action }: SectionHeadProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        {kicker && <div className="mono" style={{ marginBottom: 4 }}>{kicker}</div>}
        <h2 className="h2" style={{ margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4, maxWidth: 580 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}
