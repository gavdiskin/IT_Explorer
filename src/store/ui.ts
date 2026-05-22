import { create } from 'zustand'

interface UIState {
  city: string
  setCity: (city: string) => void

  savedSet: Set<string>
  toggleSave: (id: string) => void

  signedIn: boolean
  signIn: () => void
  signOut: () => void

  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void

  // Dev tweaks — gated to development only in the UI
  homeLayout: 'hub' | 'mapfirst' | 'editorial'
  mapLayout: 'split' | 'floating' | 'drawer'
  showCannabis: boolean
  setTweak: <K extends 'homeLayout' | 'mapLayout' | 'showCannabis'>(key: K, value: UIState[K]) => void
}

export const useUIStore = create<UIState>((set) => ({
  city: 'bangkok',
  setCity: (city) => set({ city }),

  savedSet: new Set(['or-tor-kor', 'wat-arun']),
  toggleSave: (id) =>
    set((state) => {
      const next = new Set(state.savedSet)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return { savedSet: next }
    }),

  signedIn: false,
  signIn: () => set({ signedIn: true }),
  signOut: () => set({ signedIn: false }),

  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),

  homeLayout: 'hub',
  mapLayout: 'floating',
  showCannabis: false,
  setTweak: (key, value) => set({ [key]: value } as Partial<UIState>),
}))
