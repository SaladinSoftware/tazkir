import { useState, type SubmitEvent } from 'react'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, Label } from '@headlessui/react'
import useCitySuggestions, { type CitySuggestion } from '../hooks/useCitySuggestions'
import { getTranslated } from '../translations'

/**
 * City picker. Choosing from the list only arms the choice; submitting is what
 * hands it up to the page, so the times never move mid-typing.
 */
export default function CitySearch({ onSubmit }: { onSubmit: (city: CitySuggestion) => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<CitySuggestion | null>(null)
  const { suggestions, status } = useCitySuggestions(query)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    // Enter with the list open picks a suggestion; this only catches Enter with
    // it closed, where a page reload would be the browser default.
    event.preventDefault()

    // Submitting without touching the list takes the top match, so typing a
    // city and hitting Search does the obvious thing.
    const chosen = selected ?? suggestions[0]
    if (!chosen) return

    setSelected(chosen)
    onSubmit(chosen)
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pt-8">
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <Combobox
          value={selected}
          onChange={setSelected}
          onClose={() => setQuery('')}
          immediate
          as="div"
          className="w-full"
        >
          <Label className="sr-only">{getTranslated('city.label')}</Label>
          <ComboboxInput
            placeholder={getTranslated('city.placeholder')}
            // The browser's own autofill would cover the suggestion list.
            autoComplete="off"
            displayValue={(city: CitySuggestion | null) => city?.name ?? ''}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-gray-900/10 bg-gray-100 px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400"
          />
          <ComboboxOptions
            // `anchor` keeps the panel pinned to the input's start edge, which
            // flips with the page direction on its own.
            anchor="bottom start"
            className="z-10 mt-1 w-(--input-width) overflow-hidden rounded-xl border border-gray-900/10 bg-gray-100 shadow-lg empty:invisible dark:border-white/10 dark:bg-gray-800"
          >
            {status === 'loading' && suggestions.length === 0 && (
              <p className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                {getTranslated('city.searching')}
              </p>
            )}
            {status === 'ready' && suggestions.length === 0 && (
              <p className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                {getTranslated('city.noResults')}
              </p>
            )}
            {suggestions.map((city) => (
              <ComboboxOption
                key={city.id}
                value={city}
                className="cursor-pointer px-4 py-2.5 data-focus:bg-gray-900/10 dark:data-focus:bg-white/10"
              >
                <span className="font-semibold text-gray-900 dark:text-white">{city.name}</span>
                <span className="ms-2 text-sm text-gray-500 dark:text-gray-400">{city.region}</span>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>

        <button
          type="submit"
          className="shrink-0 cursor-pointer rounded-xl bg-gray-900/10 px-4 py-2.5 font-semibold text-gray-900 transition hover:bg-gray-900/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          {getTranslated('city.search')}
        </button>
      </form>
    </section>
  )
}
