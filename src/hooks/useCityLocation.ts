import { useEffect, useState } from 'react'
import { getLanguage } from '../translations'

// Called WITHOUT latitude/longitude, this endpoint locates by the caller's IP
// address. That is deliberate: the app reports where your traffic appears to
// come from, so a VPN moves the location, the clock, and the prayer times
// together. Browser geolocation would report the device's true position and
// ignore the VPN, which is not what we want here.
const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export type Coords = { latitude: number; longitude: number }

export type LocationState = {
  city: string | null
  /** IP-derived coordinates; the prayer-times API needs these, not a name. */
  coords: Coords | null
  status: 'loading' | 'ready' | 'error'
  error: string | null
}

type GeocodeResponse = {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
  latitude?: number
  longitude?: number
}

export default function useCityLocation(): LocationState {
  const [state, setState] = useState<LocationState>({
    city: null,
    coords: null,
    status: 'loading',
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    const url = new URL(REVERSE_GEOCODE_URL)
    // The endpoint localises the place name itself, so the city arrives in
    // the page's language.
    url.searchParams.set('localityLanguage', getLanguage())

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Location lookup failed (${response.status})`)
        return (await response.json()) as GeocodeResponse
      })
      .then((data) => {
        if (cancelled) return
        // `city` is empty for some regions, so fall back to coarser names
        // rather than showing nothing.
        const city = data.city || data.locality || data.principalSubdivision || null
        const coords =
          data.latitude != null && data.longitude != null
            ? { latitude: data.latitude, longitude: data.longitude }
            : null

        setState({
          city,
          coords,
          status: city && coords ? 'ready' : 'error',
          error: city && coords ? null : 'Could not determine your location',
        })
      })
      .catch((cause: Error) => {
        if (cancelled || cause.name === 'AbortError') return
        setState({
          city: null,
          coords: null,
          status: 'error',
          error: 'Could not determine your location',
        })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  return state
}
