'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import I from '@/components/ui/icons'

export function MobileBottomNav() {
  const pathname = usePathname()

  const is = (...prefixes: string[]) =>
    prefixes.some(p => p === '/' ? pathname === '/' : pathname.startsWith(p))

  return (
    <nav className="bottomnav">
      <Link href="/" className={is('/') ? 'is-active' : ''}><I.compass size={22}/><span>Explore</span></Link>
      <Link href="/map" className={is('/map', '/places') ? 'is-active' : ''}><I.map size={22}/><span>Map</span></Link>
      <Link href="/guides" className={is('/guides', '/transport') ? 'is-active' : ''}><I.book size={22}/><span>Guides</span></Link>
      <Link href="/tools" className={is('/tools') ? 'is-active' : ''}><I.shield size={22}/><span>Tools</span></Link>
      <Link href="/saved" className={is('/saved', '/account', '/submit') ? 'is-active' : ''}><I.bookmark size={22}/><span>Saved</span></Link>
    </nav>
  )
}
