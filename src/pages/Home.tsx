import { useState } from 'react'
import CitySearch from '../components/CitySearch'
import LocationTime from '../components/LocationTime'
import TimesSection from '../components/TimesSection'
import useCityLocation from '../hooks/useCityLocation'
import type { CitySuggestion } from '../hooks/useCitySuggestions'
import usePrayerTimes from '../hooks/usePrayerTimes'

function Home() {
  // Null until someone searches, and then it wins: a deliberate choice should
  // not be overridden by where the traffic happens to come from.
  const [chosenCity, setChosenCity] = useState<CitySuggestion | null>(null)

  // Held here so one lookup feeds the city, the clock, and the times — every
  // field then agrees on a single location.
  const ipLocation = useCityLocation()

  const coords = chosenCity
    ? { latitude: chosenCity.latitude, longitude: chosenCity.longitude }
    : ipLocation.coords
  // The zone still comes back from the prayer-times API, so the clock and the
  // times can never disagree about where "there" is.
  const prayerTimes = usePrayerTimes(coords)

  return (
    <>
      <CitySearch onSubmit={setChosenCity} />
      <LocationTime
        city={chosenCity?.name ?? ipLocation.city}
        status={chosenCity ? 'ready' : ipLocation.status}
        timeZone={prayerTimes.timeZone}
      />
      <TimesSection prayerTimes={prayerTimes} />
    </>
  )
}

export default Home
