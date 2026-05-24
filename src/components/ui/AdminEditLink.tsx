'use client'
import Link from 'next/link'
import { useUIStore } from '@/store/ui'
import I from '@/components/ui/icons'

export function AdminEditLink({ href }: { href: string }) {
  const role = useUIStore(s => s.role)
  if (role !== 'admin') return null
  return (
    <Link
      href={href}
      className="btn btn-ghost"
      style={{ fontSize: 12, padding: '6px 10px', color: 'var(--brand)', border: '1px solid var(--brand)', borderRadius: 8, gap: 6, display: 'inline-flex', alignItems: 'center' }}
    >
      <I.edit size={13}/> Edit guide
    </Link>
  )
}
