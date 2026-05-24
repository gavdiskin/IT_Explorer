import { CATEGORIES, PLACES } from '@/data'
import { fetchPlaces } from '@/lib/db'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.id === slug)
  if (!cat) return {}
  const dbPlaces = await fetchPlaces()
  const source = dbPlaces.length > 0 ? dbPlaces : PLACES
  const count = source.filter(p => p.category === cat.id).length
  return {
    title: `${cat.label} in Bangkok & Phuket — Inside Thailand`,
    description: `${count} hand-picked ${cat.label.toLowerCase()} in Bangkok and Phuket, reviewed by locals who live here.`,
    openGraph: {
      title: `${cat.label} in Bangkok & Phuket — Inside Thailand`,
      description: `${count} hand-picked ${cat.label.toLowerCase()} in Bangkok and Phuket.`,
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
