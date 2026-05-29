'use client'
import { useState, useEffect } from 'react'
import type { Place, Category, Station } from '@/types'
import { fetchPlaces, fetchPlace, fetchPlacesByStation, fetchCategories, fetchPublicStations, type StationRow } from '@/lib/db'
import { PLACES, CATEGORIES, STATIONS } from '@/data'

function rowToStation(r: StationRow): Station {
  return { id: r.id, name: r.name, line: r.line, color: r.color, knownFor: r.known_for, city: r.city }
}

export function usePlaces(city: string) {
  const [places, setPlaces] = useState<Place[]>(() => PLACES.filter(p => p.city === city))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPlaces(city).then(rows => {
      if (cancelled) return
      setPlaces(rows.length > 0 ? rows : PLACES.filter(p => p.city === city))
      setLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setPlaces(PLACES.filter(p => p.city === city))
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [city])

  return { places, loading }
}

export function usePlacesByStation(stationId: string) {
  const [places, setPlaces] = useState<Place[]>(() => PLACES.filter(p => p.station === stationId))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPlacesByStation(stationId).then(rows => {
      if (cancelled) return
      setPlaces(rows.length > 0 ? rows : PLACES.filter(p => p.station === stationId))
      setLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setPlaces(PLACES.filter(p => p.station === stationId))
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [stationId])

  return { places, loading }
}

export function usePlace(slug: string) {
  const [place, setPlace] = useState<Place | null>(() => PLACES.find(p => p.id === slug) ?? null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPlace(slug).then(row => {
      if (cancelled) return
      setPlace(row ?? PLACES.find(p => p.id === slug) ?? null)
      setLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setPlace(PLACES.find(p => p.id === slug) ?? null)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [slug])

  return { place, loading }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => CATEGORIES)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchCategories().then(rows => {
      if (cancelled) return
      setCategories(rows.length > 0 ? rows : CATEGORIES)
      setLoading(false)
    }).catch(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return { categories, loading }
}

export function useStations(city?: string) {
  const fallback = city ? STATIONS.filter(s => !s.city || s.city === city) : STATIONS
  const [stations, setStations] = useState<Station[]>(() => fallback)

  useEffect(() => {
    let cancelled = false
    fetchPublicStations(city).then(rows => {
      if (!cancelled) setStations(rows.length > 0 ? rows.map(rowToStation) : fallback)
    }).catch(() => { if (!cancelled) setStations(fallback) })
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city])

  return { stations }
}

