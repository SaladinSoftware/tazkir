import { LANGUAGES, getLanguage, getTranslated, setLanguage } from '../translations'
import classNames from '../utils/classNames'

/** Mirrors ThemeToggle so the two controls read as one pair in the navbar. */
export default function LanguageToggle() {
  const current = getLanguage()

  return (
    <div
      role="radiogroup"
      aria-label={getTranslated('language.label')}
      className="flex items-center gap-1 rounded-full border border-gray-900/10 bg-gray-900/5 p-1 dark:border-white/10 dark:bg-white/5"
    >
      {LANGUAGES.map(({ value, short, full }) => {
        const selected = current === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            // Each option is labelled in its own language, so `lang` keeps the
            // right font and pronunciation for screen readers.
            lang={value}
            onClick={() => setLanguage(value)}
            className={classNames(
              selected
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
              'flex cursor-pointer items-center rounded-full px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
            )}
          >
            <span aria-hidden="true">{short}</span>
            <span className="sr-only">{full}</span>
          </button>
        )
      })}
    </div>
  )
}
