'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui'
import { AuthProvider } from '@/components/AuthProvider'
import I from '@/components/ui/icons'

function AdminShell({ children }: { children: React.ReactNode }) {
  const role = useUIStore(s => s.role)
  const signedIn = useUIStore(s => s.signedIn)
  const authReady = useUIStore(s => s.authReady)
  const pathname = usePathname()

  // Wait for auth, and (when signed in) for the role lookup to resolve — otherwise
  // an admin would briefly see the 403 screen before their role loads.
  if (!authReady || (signedIn && role === null)) {
    return (
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 32 }}>
        <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>
      </main>
    )
  }

  if (!signedIn) {
    return (
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ marginBottom: 10, color: 'var(--muted)' }}>Admin panel</div>
          <h1 className="h2">Sign in required</h1>
          <Link href="/signin" className="btn btn-primary btn-lg" style={{ marginTop: 18 }}>Sign in</Link>
        </div>
      </main>
    )
  }

  if (role !== 'admin') {
    return (
      <main style={{ display: 'grid', placeItems: 'center', minHeight: '100dvh', padding: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="mono" style={{ marginBottom: 10, color: 'var(--brand)' }}>403</div>
          <h1 className="h2">Not authorized</h1>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>This account does not have admin access.</p>
          <Link href="/" className="btn" style={{ marginTop: 18 }}>← Back to app</Link>
        </div>
      </main>
    )
  }

  const isActive = (path: string) =>
    path === '/admin' ? pathname === '/admin' : pathname.startsWith(path)

  const navItem: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 10, fontSize: 14,
    color: 'var(--text)', textDecoration: 'none', fontWeight: 500,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
      <aside style={{
        width: 220, flexShrink: 0, borderRight: '1px solid var(--line)',
        padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 2,
        position: 'sticky', top: 0, height: '100dvh', overflowY: 'auto',
      }}>
        <div style={{ padding: '6px 12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--brand)' }}/>
          <span style={{ fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)', letterSpacing: '.04em' }}>ADMIN</span>
        </div>
        <Link href="/admin" style={{ ...navItem, background: isActive('/admin') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin') ? 600 : 500 }}>
          <I.grid size={16}/> Dashboard
        </Link>
        <Link href="/admin/submissions" style={{ ...navItem, background: isActive('/admin/submissions') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/submissions') ? 600 : 500 }}>
          <I.send size={16}/> Submissions
        </Link>
        <Link href="/admin/reports" style={{ ...navItem, background: isActive('/admin/reports') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/reports') ? 600 : 500 }}>
          <I.flag size={16}/> Reports
        </Link>
        <Link href="/admin/guides" style={{ ...navItem, background: isActive('/admin/guides') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/guides') ? 600 : 500 }}>
          <I.book size={16}/> Guides
        </Link>
        <Link href="/admin/places" style={{ ...navItem, background: isActive('/admin/places') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/places') ? 600 : 500 }}>
          <I.camera size={16}/> Photos
        </Link>
        <Link href="/admin/stations" style={{ ...navItem, background: isActive('/admin/stations') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/stations') ? 600 : 500 }}>
          <I.train size={16}/> Stations
        </Link>
        <Link href="/admin/apps" style={{ ...navItem, background: isActive('/admin/apps') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/apps') ? 600 : 500 }}>
          <I.grid size={16}/> Apps
        </Link>
        <Link href="/admin/users" style={{ ...navItem, background: isActive('/admin/users') ? 'var(--bg-2)' : 'transparent', fontWeight: isActive('/admin/users') ? 600 : 500 }}>
          <I.users size={16}/> Users
        </Link>
        <div style={{ flex: 1 }}/>
        <Link href="/" style={{ ...navItem, color: 'var(--muted)', fontSize: 13 }}>
          <I.arrowL size={15}/> Back to app
        </Link>
      </aside>
      <main style={{ flex: 1, minWidth: 0, padding: '32px 40px 64px', maxWidth: 1100 }}>
        {children}
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  )
}
