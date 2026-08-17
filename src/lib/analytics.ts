/**
 * Umami events. Guarded on every call: no tracking script is loaded in this
 * training copy, so `window.umami` is always undefined and every call below
 * is a no-op. Kept only so the event call sites match the original app.
 */
type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Props) => void }
  }
}

export function track(event: string, props?: Props) {
  try {
    window.umami?.track(event, props)
  } catch {
    /* never load-bearing */
  }
}
