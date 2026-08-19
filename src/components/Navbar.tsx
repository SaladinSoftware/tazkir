import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router'
import LanguageToggle from './LanguageToggle'
import ThemeToggle from './ThemeToggle'
import { getTranslated, type TranslationKey } from '../translations'
import classNames from '../utils/classNames'
// Imported (not referenced by path) so Vite fingerprints it and emits it to
// dist/ — a bare path would 404 in production.
import tazkirLogo from '../assets/tazkir_logo.png'

const navigation: { labelKey: TranslationKey; to: string }[] = [
  { labelKey: 'nav.dashboard', to: '/' },
  { labelKey: 'nav.about', to: '/about' },
]

export default function Navbar() {
  // Drives the highlight from the actual route rather than a hardcoded flag.
  const { pathname } = useLocation()

  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-100 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gray-900/10 dark:bg-gray-800/50 dark:after:bg-white/10"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-23 items-center justify-between gap-2">
          <div className="flex items-center md:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-900/5 hover:text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">{getTranslated('nav.openMenu')}</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center md:justify-start">
            <div className="flex min-w-0 items-center">
              <img
                alt={getTranslated('app.logoAlt')}
                src={tazkirLogo}
                className="h-14 w-auto max-w-full object-contain sm:h-20 md:h-23"
              />
            </div>
            <div className="hidden md:ms-6 md:flex md:items-center">
              <div className="flex gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={pathname === item.to ? 'page' : undefined}
                    className={classNames(
                      pathname === item.to
                        ? 'bg-gray-900/10 text-gray-900 dark:bg-gray-950/50 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-900/5 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
                      'rounded-md px-3 py-2 text-lg font-bold',
                    )}
                  >
                    {getTranslated(item.labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:ms-6">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.to}
              as={Link}
              to={item.to}
              aria-current={pathname === item.to ? 'page' : undefined}
              className={classNames(
                pathname === item.to
                  ? 'bg-gray-900/10 text-gray-900 dark:bg-gray-950/50 dark:text-white'
                  : 'text-gray-600 hover:bg-gray-900/5 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
                'block rounded-md px-3 py-2 text-lg font-bold',
              )}
            >
              {getTranslated(item.labelKey)}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
