import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Map — Inside Thailand',
  description: 'Browse Bangkok and Phuket by category — food, temples, nightlife, cafés, and more on an interactive map.',
}

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
