import { CITIES } from '@/data'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const city = CITIES.find(c => c.id === slug)
  if (!city) return {}
  return {
    title: `${city.name} City Guide — Inside Thailand`,
    description: `${city.tagline}. ${city.placeCount} hand-picked places, practical transport tips, and local guides for ${city.name}.`,
    openGraph: {
      title: `${city.name} City Guide — Inside Thailand`,
      description: `${city.tagline} · ${city.placeCount} hand-picked places.`,
    },
  }
}

export default function CityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
