'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useUIStore } from '@/store/ui'
import { fetchSavedSlugs, fetchUserRole } from '@/lib/db'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const signIn = useUIStore(s => s.signIn)
  const signOut = useUIStore(s => s.signOut)
  const loadSaved = useUIStore(s => s.loadSaved)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const role = await fetchUserRole(session.user.id)
        signIn(session.user.id, session.user.email ?? '', role)
        fetchSavedSlugs(session.user.id).then(loadSaved)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const role = await fetchUserRole(session.user.id)
        signIn(session.user.id, session.user.email ?? '', role)
        fetchSavedSlugs(session.user.id).then(loadSaved)
      } else {
        signOut()
      }
    })

    return () => subscription.unsubscribe()
  }, [signIn, signOut, loadSaved])

  return <>{children}</>
}
