const KEY = 'ryft-landing-scroll-y'

/** Call before navigating to /privacy or /terms so returning to / can restore scroll. */
export function rememberLandingScrollPosition() {
  sessionStorage.setItem(KEY, String(window.scrollY))
}

/** If a position was saved, return it and clear storage; otherwise null. */
export function consumeLandingScrollRestore(): number | null {
  const raw = sessionStorage.getItem(KEY)
  if (raw == null) return null
  sessionStorage.removeItem(KEY)
  const y = Number.parseInt(raw, 10)
  if (Number.isNaN(y) || y < 0) return null
  return y
}
