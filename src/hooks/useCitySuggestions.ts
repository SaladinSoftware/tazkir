import { useEffect, useState } from 'react'
import { getLanguage } from '../translations'

// Free, key-less geocoding search. It matches either script and answers in the
// language asked for, so typing "Damascus" on an Arabic page still yields دمشق.
const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search'

/** One letter matches half the planet — wait for a second before asking. */
const MIN_QUERY_LENGTH = 2

/** Long enough to skip the letters of a word, short enough to feel live. */
const DEBOUNCE_MS = 300

const RESULT_COUNT = 5

export type CitySuggestion = {
  id: number
  name: string
  /** "Damascus Governorate, Syria" — several real cities share a name. */
  region: string
  latitude: number
  longitude: number
  timeZone: string
}

export type SuggestionsState = {
  suggestions: CitySuggestion[]
  status: 'idle' | 'loading' | 'ready'
}

type GeocodeResult = {
  id: number
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
  timezone: string
}

export default function useCitySuggestions(query: string): SuggestionsState {
  const [state, setState] = useState<SuggestionsState>({ suggestions: [], status: 'idle' })

  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setState({ suggestions: [], status: 'idle' })
      return
    }

    setState((previous) => ({ ...previous, status: 'loading' }))
    const controller = new AbortController()

    // Fires once typing pauses, so a five-letter city costs one request, not five.
    const timer = setTimeout(() => {
      const url = new URL(SEARCH_URL)
      url.searchParams.set('name', trimmed)
      url.searchParams.set('count', String(RESULT_COUNT))
      url.searchParams.set('language', getLanguage())
      url.searchParams.set('format', 'json')

      fetch(url, { signal: controller.signal })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`)
          return response.json() as Promise<{ results?: GeocodeResult[] }>
        })
        .then((data) => {
          const separator = getLanguage() === 'ar' ? '، ' : ', '
          setState({
            status: 'ready',
            suggestions: (data.results ?? []).map((result) => ({
              id: result.id,
              name: result.name,
              region: [result.admin1, result.country].filter(Boolean).join(separator),
              latitude: result.latitude,
              longitude: result.longitude,
              timeZone: result.timezone,
            })),
          })
        })
        .catch(() => {
          // A dropped lookup just means no list this keystroke; the field still
          // works as a plain text box. Aborts are our own doing — ignore them.
          if (!controller.signal.aborted) setState({ suggestions: [], status: 'ready' })
        })
    }, DEBOUNCE_MS)

    // Every new keystroke cancels the pending timer AND any in-flight request,
    // so a slow early response can never overwrite a newer one.
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return state
}
