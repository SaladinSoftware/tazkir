// Times are placeholders until the prayer-times API is wired up.
const prayers = [
  { name: 'Fajr', time: '--:--' },
  { name: 'Sunrise', time: '--:--' },
  { name: 'Dhuhr', time: '--:--' },
  { name: 'Asr', time: '--:--' },
  { name: 'Maghrib', time: '--:--' },
  { name: 'Isha', time: '--:--' },
]

export default function TimesSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {prayers.map(({ name, time }) => (
          <div
            key={name}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-900/10 bg-gray-100 px-4 py-6 text-center dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{name}</h3>
            <p className="text-2xl font-bold tabular-nums text-gray-600 dark:text-gray-300">
              {time}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
