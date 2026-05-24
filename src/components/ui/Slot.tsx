import type { CSSProperties, ReactNode } from 'react'

interface SlotProps {
  tone?: string
  label?: string
  sub?: string
  tag?: string
  h?: number | string
  aspect?: string
  children?: ReactNode
  style?: CSSProperties
  className?: string
}

export function Slot({ tone = 'clay', label, sub, tag, h, aspect = '4/3', children, style, className = '' }: SlotProps) {
  const cls = `slot slot-${tone} ${className}`
  return (
    <div className={cls} style={{ height: h, aspectRatio: h ? undefined : aspect, ...style }}>
      {tag && <span className="slot__tag">{tag}</span>}
      <div className="slot__caption">Image slot</div>
      <div className="slot__label">{label}</div>
      {sub && <div className="slot__sub">{sub}</div>}
      {children}
    </div>
  )
}
