import type { MetadataRoute } from 'next'
import { PLACES, CATEGORIES, CITIES, STATIONS, GUIDES } from '@/data'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://insidethailand.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,                       lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/map`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/guides`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/transport`,        lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/tools/scams`,      lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/prices`,     lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/phrasebook`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/tools/emergency`,  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/tools/sim`,        lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const cityRoutes: MetadataRoute.Sitemap = CITIES.map(c => ({
    url: `${BASE}/cities/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const placeRoutes: MetadataRoute.Sitemap = PLACES.filter(p => !p.optional).map(p => ({
    url: `${BASE}/places/${p.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter(c => !c.optional).map(c => ({
    url: `${BASE}/categories/${c.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const stationRoutes: MetadataRoute.Sitemap = STATIONS.map(s => ({
    url: `${BASE}/stations/${s.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map(g => ({
    url: `${BASE}/guides/${g.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...cityRoutes,
    ...placeRoutes,
    ...categoryRoutes,
    ...stationRoutes,
    ...guideRoutes,
  ]
}
