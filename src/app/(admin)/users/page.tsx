'use client'

import { useEffect, useState } from 'react'
import { adminFetchUsers, adminUpdateUserRole, type UserRow } from '@/lib/db'
import { useUIStore } from '@/store/ui'
import I from '@/components/ui/icons'

export default function UsersPage() {
  const currentUserId = useUIStore(s => s.userId)
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    adminFetchUsers().then(u => { setUsers(u); setLoading(false) })
  }, [])

  const toggleRole = async (user: UserRow) => {
    if (user.id === currentUserId && user.role === 'admin') {
      alert("You can't remove your own admin role.")
      return
    }
    const next: 'user' | 'admin' = user.role === 'admin' ? 'user' : 'admin'
    setUpdating(user.id)
    const { error } = await adminUpdateUserRole(user.id, next)
    if (!error) setUsers(u => u.map(x => x.id === user.id ? { ...x, role: next } : x))
    setUpdating(null)
  }

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 className="h2">Users</h1>
        <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14 }}>
          Toggle admin access. Users in the admin whitelist are automatically promoted on sign-up.
        </p>
      </div>

      {loading && <div style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</div>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {users.map((u, i) => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
            borderBottom: i < users.length - 1 ? '1px solid var(--line)' : undefined,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: 'var(--bg-deep)', color: 'var(--text-on-deep)',
              display: 'grid', placeItems: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12,
            }}>
              {u.email.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.email}
                {u.id === currentUserId && <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>(you)</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>ID: {u.id.slice(0, 8)}…</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {u.role === 'admin' && (
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'var(--brand)', color: '#fff', letterSpacing: '.04em' }}>ADMIN</span>
              )}
              <button
                className="btn"
                disabled={updating === u.id}
                onClick={() => toggleRole(u)}
                style={{ fontSize: 12, padding: '6px 12px', gap: 6,
                  color: u.role === 'admin' ? 'var(--brand)' : 'var(--moss)',
                }}
              >
                {u.role === 'admin' ? <><I.x size={13}/> Remove admin</> : <><I.users size={13}/> Make admin</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && users.length === 0 && (
        <div className="card card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          No users found.
        </div>
      )}
    </>
  )
}
