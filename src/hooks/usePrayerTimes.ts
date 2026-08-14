import { useEffect, useState } from 'react'
import type { Coords } from './useCityLocation'

// The docs advertise api.ummahapi.com, but that host currently fails TLS at the
// origin (Cloudflare 526); www serves the same endpoint and sends CORS headers.
const PRAYER_TIMES_URL = 'https://www.ummahapi.com/api/prayer-times'

const MADHAB = 'Shafi'

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export type PrayerTimesState = {
  /** ISO 8601 timestamps keyed by prayer, or null until loaded. */
  times: Record<PrayerKey, string> | null
  /**
   * IANA zone the API derived from the coordinates — the app's single source of
   * truth for "what time is it there", used to render both the clock and these
   * times. Never the device's own zone, which would ignore the VPN.
   */
  timeZone: string | null
  status: 'idle' | 'loading' | 'ready' | 'error'
  error: string | null
}

type PrayerTimesResponse = {
  success: boolean
  data?: {
    date: string
    timezone: string
    prayer_times: Partial<Record<PrayerKey | 'imsak', string>>
    prayer_datetimes: Partial<Record<PrayerKey | 'imsak', string>>
  }
  error?: string
}

const PRAYER_KEYS: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']

export default function usePrayerTimes(coords: Coords | null): PrayerTimesState {
  const [state, setState] = useState<PrayerTimesState>({
    times: null,
    timeZone: null,
    status: 'idle',
    error: null,
  })

  const latitude = coords?.latitude
  const longitude = coords?.longitude

  useEffect(() => {
    if (latitude == null || longitude == null) return

    const controller = new AbortController()
    let cancelled = false

    setState({ times: null, timeZone: null, status: 'loading', error: null })

    const url = new URL(PRAYER_TIMES_URL)
    url.searchParams.set('lat', String(latitude))
    url.searchParams.set('lng', String(longitude))
    url.searchParams.set('madhab', MADHAB)
    // `timezone` is deliberately omitted: the API infers it from the
    // coordinates, giving us the zone at the IP location rather than the
    // device's own zone, which a VPN does not change.

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Prayer times request failed (${response.status})`)
        return (await response.json()) as PrayerTimesResponse
      })
      .then((body) => {
        if (cancelled) return
        const datetimes = body.data?.prayer_datetimes
        if (!body.success || !datetimes) {
          throw new Error(body.error ?? 'Prayer times unavailable')
        }

        const times = {} as Record<PrayerKey, string>
        for (const key of PRAYER_KEYS) {
          const value = datetimes[key]
          if (!value) throw new Error(`Missing ${key} in response`)
          times[key] = value
        }

        setState({
          times,
          timeZone: body.data?.timezone ?? null,
          status: 'ready',
          error: null,
        })
      })
      .catch((cause: Error) => {
        if (cancelled || cause.name === 'AbortError') return
        setState({ times: null, timeZone: null, status: 'error', error: cause.message })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [latitude, longitude])

  return state
}
