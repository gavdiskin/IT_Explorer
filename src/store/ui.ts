import { create } from 'zustand'
import { upsertSaved, deleteSaved } from '@/lib/db'

interface UIState {
  city: string
  setCity: (city: string) => void

  savedSet: Set<string>
  toggleSave: (id: string) => void
  loadSaved: (ids: string[]) => void

  userId: string | null
  userEmail: string | null
  role: 'user' | 'admin' | null
  signedIn: boolean
  signIn: (userId: string, email: string, role: 'user' | 'admin') => void
  signOut: () => void

  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  showCannabis: boolean
  setShowCannabis: (v: boolean) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  city: 'bangkok',
  setCity: (city) => set({ city }),

  savedSet: new Set<string>(),
  toggleSave: (id) => {
    const state = get()
    const next = new Set(state.savedSet)
    if (next.has(id)) {
      next.delete(id)
      if (state.userId) deleteSaved(state.userId, id)
    } else {
      next.add(id)
      if (state.userId) upsertSaved(state.userId, id)
    }
    set({ savedSet: next })
  },
  loadSaved: (ids) => set({ savedSet: new Set(ids) }),

  userId: null,
  userEmail: null,
  role: null,
  signedIn: false,
  signIn: (userId, email, role) => set({ signedIn: true, userId, userEmail: email, role }),
  signOut: () => set({ signedIn: false, userId: null, userEmail: null, role: null, savedSet: new Set() }),

  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  showCannabis: false,
  setShowCannabis: (v) => set({ showCannabis: v }),
}))

