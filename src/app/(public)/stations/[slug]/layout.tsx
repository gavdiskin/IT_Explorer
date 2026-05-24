import { STATIONS } from '@/data'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const station = STATIONS.find(s => s.id === slug)
  if (!station) return {}
  return {
    title: `${station.name} · Places Nearby — Inside Thailand`,
    description: `${station.knownFor} — hand-picked places within walking distance of ${station.name}.`,
  }
}

export default function StationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
