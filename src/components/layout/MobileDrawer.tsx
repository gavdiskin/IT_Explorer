'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUIStore } from '@/store/ui'
import { CITIES } from '@/data'
import I from '@/components/ui/icons'

export function MobileDrawer() {
  const open = useUIStore(s => s.drawerOpen)
  const setDrawerOpen = useUIStore(s => s.setDrawerOpen)
  const city = useUIStore(s => s.city)
  const setCity = useUIStore(s => s.setCity)
  const signedIn = useUIStore(s => s.signedIn)
  const signOut = useUIStore(s => s.signOut)

  const onClose = () => setDrawerOpen(false)

  return (
    <>
      <div className={'drawer-bg' + (open ? ' is-open' : '')} onClick={onClose}/>
      <div className={'drawer' + (open ? ' is-open' : '')}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div className="header__brand">
            <Image src="/logo.png" alt="Inside Thailand" width={30} height={30} style={{ borderRadius: 8 }}/>
            <span>Inside Thailand</span>
          </div>
          <button className="btn btn-sq btn-ghost" onClick={onClose} aria-label="Close"><I.x size={20}/></button>
        </div>

        <div className="field" style={{ marginBottom: 20 }}>
          <label>City</label>
          <select className="select" value={city} onChange={e => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 18 }}>
          <DrawerLink href="/map" icon={<I.map size={18}/>} onClose={onClose}>Map</DrawerLink>
          <DrawerLink href="/cities/bangkok" icon={<I.compass size={18}/>} onClose={onClose}>Explore Bangkok</DrawerLink>
          <DrawerLink href="/cities/phuket" icon={<I.beach size={18}/>} onClose={onClose}>Phuket guide</DrawerLink>
          <DrawerLink href="/guides" icon={<I.book size={18}/>} onClose={onClose}>Practical guides</DrawerLink>
          <DrawerLink href="/transport" icon={<I.train size={18}/>} onClose={onClose}>Transport (BTS / MRT)</DrawerLink>
          <DrawerLink href="/tools" icon={<I.sliders size={18}/>} onClose={onClose}>Tourist tools</DrawerLink>
          <DrawerLink href="/tools/scams" icon={<I.shield size={18}/>} onClose={onClose}>Scam detector</DrawerLink>
          <DrawerLink href="/tools/prices" icon={<I.tag size={18}/>} onClose={onClose}>Price checker</DrawerLink>
          <DrawerLink href="/saved" icon={<I.bookmark size={18}/>} onClose={onClose}>Saved places</DrawerLink>
          <DrawerLink href="/submit" icon={<I.plus size={18}/>} onClose={onClose}>Submit a place</DrawerLink>
        </div>

        {signedIn ? (
          <button onClick={() => { signOut(); onClose() }} className="btn" style={{ width: '100%' }}>Sign out</button>
        ) : (
          <Link href="/signin" onClick={onClose} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign in</Link>
        )}
      </div>
    </>
  )
}

function DrawerLink({ href, icon, onClose, children }: { href: string; icon: React.ReactNode; onClose: () => void; children: React.ReactNode }) {
  return (
    <Link href={href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', borderRadius: 10, fontSize: 15, color: 'var(--text)' }}>
      <span style={{ color: 'var(--muted)' }}>{icon}</span>
      {children}
    </Link>
  )
}
