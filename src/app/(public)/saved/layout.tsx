import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saved Places — Inside Thailand',
  description: 'Your saved places in Bangkok and Phuket.',
}

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
