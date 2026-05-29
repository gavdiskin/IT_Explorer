'use client'

import { useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/ui'
import { fetchSavedSlugs, fetchUserRole } from '@/lib/db'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signIn = useUIStore(s => s.signIn)
  const signOut = useUIStore(s => s.signOut)
  const setRole = useUIStore(s => s.setRole)
  const loadSaved = useUIStore(s => s.loadSaved)
  const setAuthReady = useUIStore(s => s.setAuthReady)

  useEffect(() => {
    if (!supabase) { setAuthReady(true); return }

    // Safety net so the UI never hangs on a loading state if the auth event is
    // slow. It only flips authReady — it never signs the user out.
    const fallback = setTimeout(() => setAuthReady(true), 5000)

    // Secondary, non-critical data (admin role + saved places). This MUST run
    // outside the onAuthStateChange callback: supabase-js v2 holds an auth lock
    // for the duration of that callback, and any Supabase call that needs the
    // access token would try to re-enter the same lock and deadlock. fetchUserRole
    // already falls back to 'user' on error, so role always resolves.
    const hydrate = (session: Session) => {
      fetchUserRole(session.user.id).then(setRole).catch(() => setRole('user'))
      fetchSavedSlugs(session.user.id).then(loadSaved).catch(() => {})
    }

    // A single listener. INITIAL_SESSION fires on subscribe with the session read
    // from localStorage, so this covers the first paint after a reload as well as
    // later sign-in / sign-out / token-refresh events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Only an explicit sign-out clears the session. A blocked or slow token
        // refresh leaves the user signed in (the stored session is still valid),
        // which is what keeps them logged in across refreshes.
        signOut()
      } else if (session?.user) {
        const changed = useUIStore.getState().userId !== session.user.id
        // Synchronous: the user is logged in immediately from the stored session.
        signIn(session.user.id, session.user.email ?? '')
        // Fetch role + saved places only when the user actually changes — not on
        // every hourly background token refresh.
        if (changed) setTimeout(() => hydrate(session), 0)
      }
      setAuthReady(true)
      clearTimeout(fallback)
    })

    return () => { clearTimeout(fallback); subscription.unsubscribe() }
  }, [signIn, signOut, setRole, loadSaved, setAuthReady])

  return <>{children}</>
}
