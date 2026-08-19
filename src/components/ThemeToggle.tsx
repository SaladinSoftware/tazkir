import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { getTranslated, type TranslationKey } from '../translations'
import classNames from '../utils/classNames'

type Theme = 'light' | 'dark'

// Keep in sync with the anti-flash script in index.html.
const STORAGE_KEY = 'tazkir-theme'

const options: { value: Theme; labelKey: TranslationKey; Icon: typeof SunIcon }[] = [
  { value: 'light', labelKey: 'theme.light', Icon: SunIcon },
  { value: 'dark', labelKey: 'theme.dark', Icon: MoonIcon },
]

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <div
      role="radiogroup"
      aria-label={getTranslated('theme.label')}
      className="flex items-center gap-1 rounded-full border border-gray-900/10 bg-gray-900/5 p-1 dark:border-white/10 dark:bg-white/5"
    >
      {options.map(({ value, labelKey, Icon }) => {
        const selected = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(value)}
            className={classNames(
              selected
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white',
              'flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            <span className="hidden lg:inline">{getTranslated(labelKey)}</span>
          </button>
        )
      })}
    </div>
  )
}
