import { PLACES } from '@/data'
import { fetchPlace } from '@/lib/db'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const place = (await fetchPlace(slug)) ?? PLACES.find(p => p.id === slug)
  if (!place) return {}
  return {
    title: `${place.name} — Inside Thailand`,
    description: place.desc.slice(0, 155),
    openGraph: {
      title: `${place.name} — Inside Thailand`,
      description: place.desc.slice(0, 155),
      type: 'article',
    },
  }
}

export default function PlaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
