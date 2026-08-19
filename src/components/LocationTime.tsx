import { useMemo } from 'react'
import type { LocationState } from '../hooks/useCityLocation'
import useClock from '../hooks/useClock'
import { getLocale, getTranslated } from '../translations'

type LocationTimeProps = Pick<LocationState, 'city' | 'status'> & {
  /** IANA zone of the located city. Null until resolved. */
  timeZone: string | null
}

export default function LocationTime({ city, status, timeZone }: LocationTimeProps) {
  const now = useClock()

  // Pinned to the located city's zone, not the device's. Rebuilt only when that
  // zone changes, keeping it off the per-second render path.
  const timeFormatter = useMemo(
    () =>
      timeZone
        ? new Intl.DateTimeFormat(getLocale(), {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone,
          })
        : null,
    [timeZone],
  )

  const label =
    status === 'loading'
      ? getTranslated('location.locating')
      : (city ?? getTranslated('location.unavailable'))

  return (
    <div className="mt-10 flex justify-center gap-2.5 py-2.5 text-center text-2xl font-bold text-gray-900 dark:text-white">
      <h1 aria-live="polite" className={status === 'loading' ? 'animate-pulse' : undefined}>
        {label}
      </h1>
      {timeFormatter ? (
        <time dateTime={now.toISOString()} className="tabular-nums">
          {timeFormatter.format(now)}
        </time>
      ) : (
        // Never fall back to the device clock: showing local time while the
        // city says somewhere else would be quietly wrong.
        <span className="animate-pulse tabular-nums text-gray-400 dark:text-gray-500">
          --:--:--
        </span>
      )}
    </div>
  )
}
