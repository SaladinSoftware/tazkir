import { useEffect, useState } from 'react'

/**
 * Current time, updating every second.
 *
 * Re-aligns to the wall-clock second boundary after each tick instead of using
 * a plain 1000ms interval, which drifts and visibly skips a second when the
 * browser throttles timers (background tab, sleeping machine).
 */
export default function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timeout: number

    const tick = () => {
      const current = new Date()
      setNow(current)
      timeout = window.setTimeout(tick, 1000 - (current.getTime() % 1000))
    }

    tick()
    return () => window.clearTimeout(timeout)
  }, [])

  return now
}
