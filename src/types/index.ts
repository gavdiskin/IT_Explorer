export interface Category {
  id: string
  label: string
  tone: string
  accent: string
  icon: string
  optional?: boolean
}

export interface Place {
  id: string
  name: string
  category: string
  subcategory: string
  cuisine: string[]
  area: string
  city: string
  station?: string
  price: number
  rating: number
  reviews?: number
  distance?: string
  open: boolean
  hours: string
  tags: string[]
  desc: string
  tips: string[]
  slot: { tone: string; label: string; sub: string }
  coords: [number, number]
  priceRange?: Record<string, string>
  optional?: boolean
}

export interface City {
  id: string
  name: string
  tagline: string
  placeCount: number
  country: string
}

export interface Station {
  id: string
  line: string
  color: string
  name: string
  knownFor: string
}

export interface Scam {
  id: string
  title: string
  severity: 'serious' | 'common' | 'minor'
  where: string
  how: string
  instead: string
  keywords: string[]
}

export interface PriceBenchmark {
  id: string
  label: string
  fair: string
  range: string
  where: string
  tip: string
}

export interface GuideStep {
  title: string
  detail: string
}

export interface Guide {
  id: string
  title: string
  mins: number
  area: string
  body: string
  steps?: GuideStep[]
  warnings?: string[]
  cover_url?: string
}

export interface TouristTool {
  id: string
  name: string
  desc: string
  icon: string
  tone: string
  route: string
}

export interface EssentialApp {
  id: string
  name: string
  use: string
  ios_url?: string
  android_url?: string
  icon_char?: string
  sort_order?: number
}
