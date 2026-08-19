import arabic from './arabic.json'
import english from './english.json'

export type Language = 'en' | 'ar'

/** Every key comes from the English file, so a missing Arabic one is a type error. */
export type TranslationKey = keyof typeof english

const translations: Record<Language, Record<TranslationKey, string>> = { en: english, ar: arabic }

/** Each language's own name, so the switcher reads natively in both. */
export const LANGUAGES: { value: Language; short: string; full: string }[] = [
  { value: 'en', short: 'EN', full: 'English' },
  { value: 'ar', short: 'ع', full: 'العربية' },
]

// Keep in sync with the anti-flash script in index.html.
const STORAGE_KEY = 'tazkir-lang'

/** The language in play right now. Read fresh every call — it is one localStorage hit. */
export function getLanguage(): Language {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ar') return stored
  // First visit: follow the browser's top preference, English otherwise.
  return navigator.language.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

/** The one lookup every piece of UI text goes through. */
export function getTranslated(keyName: TranslationKey): string {
  return translations[getLanguage()][keyName]
}

/**
 * Locale handed to `Intl`.
 *
 * English maps to `undefined` on purpose: that keeps the visitor's own regional
 * conventions (24h vs 12h, for instance). Arabic pins the `latn` numbering
 * system so digits stay Latin — the layout relies on `tabular-nums`, which
 * Arabic-Indic digits do not get in the default UI font.
 */
export function getLocale(): string | undefined {
  return getLanguage() === 'ar' ? 'ar-u-nu-latn' : undefined
}

/**
 * Stores the choice and reloads. The app is a few kilobytes, and a reload lets
 * the direction flip, the time formatters and the city lookup all rebuild from
 * scratch instead of each having to react to a language change.
 */
export function setLanguage(next: Language) {
  localStorage.setItem(STORAGE_KEY, next)
  location.reload()
}
