import LocationTime from '../components/LocationTime'
import TimesSection from '../components/TimesSection'
import useCityLocation from '../hooks/useCityLocation'
import usePrayerTimes from '../hooks/usePrayerTimes'

function Home() {
  // Both held here so one IP lookup feeds the city, the clock, and the times —
  // every field then agrees on a single location.
  const { city, coords, status } = useCityLocation()
  const prayerTimes = usePrayerTimes(coords)

  return (
    <>
      <LocationTime city={city} status={status} timeZone={prayerTimes.timeZone} />
      <TimesSection prayerTimes={prayerTimes} />
    </>
  )
}

export default Home
