'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/ui'

export default function SignInPage() {
  const router = useRouter()
  const signIn = useUIStore(s => s.signIn)

  const onSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    signIn()
    router.push('/')
  }

  return (
    <main className="wrap route-mount" style={{ padding: '40px var(--gutter)', maxWidth: 460 }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Image src="/logo.png" alt="Inside Thailand" width={32} height={32} style={{ borderRadius: 9 }}/>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>Inside Thailand</span>
        </div>
        <h1 className="h2" style={{ margin: '8px 0 4px' }}>Welcome back</h1>
        <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 22, fontSize: 14 }}>Sign in to save places, submit new ones, and sync with the mobile app.</p>

        <button onClick={onSignIn} className="btn" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>Continue with Google</button>
        <button onClick={onSignIn} className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 12 }}>Continue with Apple</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0', color: 'var(--muted)', fontSize: 11.5 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
          OR
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
        </div>

        <form onSubmit={onSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="field"><label>Email</label><input type="email" className="input" placeholder="you@example.com" required/></div>
          <div className="field"><label>Password</label><input type="password" className="input" required/></div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ justifyContent: 'center' }}>Sign in</button>
        </form>

        <div style={{ marginTop: 16, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>
          No account? <a href="/signin" style={{ color: 'var(--brand)', fontWeight: 600 }}>Create one</a>
        </div>
      </div>
    </main>
  )
}
