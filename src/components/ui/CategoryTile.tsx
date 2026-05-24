import Link from 'next/link'
import type { Category } from '@/types'
import I from './icons'

interface CategoryTileProps {
  category: Category
  big?: boolean
}

export function CategoryTile({ category, big }: CategoryTileProps) {
  const Ic = I[category.icon] || I.dot
  return (
    <Link href={`/categories/${category.id}`} className="cat-tile" style={{ padding: big ? 18 : 14 }}>
      <div className="cat-tile__icon" style={{ background: category.accent + '18', color: category.accent }}>
        <Ic size={big ? 24 : 22}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-.01em', fontSize: big ? 16 : 14.5 }}>
          {category.label}
        </div>
      </div>
      <I.chevR size={16} stroke={1.5}/>
    </Link>
  )
}
