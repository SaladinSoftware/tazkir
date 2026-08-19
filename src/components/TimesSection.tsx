import { useMemo } from 'react'
import type { PrayerKey, PrayerTimesState } from '../hooks/usePrayerTimes'
import { getLocale, getTranslated, type TranslationKey } from '../translations'

const prayers: { key: PrayerKey; labelKey: TranslationKey }[] = [
  { key: 'fajr', labelKey: 'prayer.fajr' },
  { key: 'sunrise', labelKey: 'prayer.sunrise' },
  { key: 'dhuhr', labelKey: 'prayer.dhuhr' },
  { key: 'asr', labelKey: 'prayer.asr' },
  { key: 'maghrib', labelKey: 'prayer.maghrib' },
  { key: 'isha', labelKey: 'prayer.isha' },
]

export default function TimesSection({ prayerTimes }: { prayerTimes: PrayerTimesState }) {
  const { times, timeZone, status, error } = prayerTimes

  // The ISO timestamps carry the located city's offset, but Intl would still
  // render them in the device's zone — so pin the formatter to the same zone
  // the clock uses.
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(getLocale(), {
        hour: '2-digit',
        minute: '2-digit',
        ...(timeZone ? { timeZone } : {}),
      }),
    [timeZone],
  )

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prayers.map(({ key, labelKey }) => {
          const iso = times?.[key]
          return (
            <div
              key={key}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-900/10 bg-gray-100 px-4 py-6 text-center dark:border-white/10 dark:bg-white/5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getTranslated(labelKey)}
              </h3>
              {iso ? (
                <time
                  dateTime={iso}
                  className="text-2xl font-bold tabular-nums text-gray-600 dark:text-gray-300"
                >
                  {timeFormatter.format(new Date(iso))}
                </time>
              ) : (
                <p
                  className={`text-2xl font-bold tabular-nums text-gray-400 dark:text-gray-500 ${
                    status === 'loading' ? 'animate-pulse' : ''
                  }`}
                >
                  --:--
                </p>
              )}
            </div>
          )
        })}
      </div>

      {status === 'error' && (
        <p role="status" className="mt-4 text-center text-sm text-red-600 dark:text-red-400">
          {getTranslated('times.error')}
          {error ? `: ${error}` : ''}.
        </p>
      )}
    </section>
  )
}
