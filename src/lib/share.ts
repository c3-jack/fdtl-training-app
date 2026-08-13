import type { Puzzle } from '../types/puzzle'
import { validatePuzzle } from './puzzle'

/**
 * URL encoding for puzzles.
 *
 * Puzzles serialize to JSON, then to base64url (same as JWT segments:
 * swap `+/` for `-_` and drop `=` padding). A full 16-word puzzle is
 * ~300 bytes of JSON, ~400 chars of base64 -- well under every browser's
 * URL limit.
 *
 * We use a QUERY STRING (`?p=...`) rather than a hash fragment. Hash
 * fragments look ambiguous to chat-app auto-linkers and unfurlers (some
 * truncate at `#`, and unfurlers never see past it so every puzzle
 * previews as the homepage). Query strings are unambiguous URLs that
 * every client recognises. Links from before this change used `#p=` and
 * `#create`, so readMode() falls back to the hash form for compat.
 *
 * Puzzle bytes still stay with the sender/recipient in practice -- the
 * hosting static server (GH Pages) gets the querystring in its access
 * logs but never does anything with it, and there's no database.
 */

export function encodePuzzle(puzzle: Puzzle): string {
  const json = JSON.stringify(puzzle)
  // btoa requires latin1-safe input; UTF-8 encode first so emoji / accents
  // in titles round-trip cleanly.
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  const b64 = btoa(bin)
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePuzzle(encoded: string): Puzzle | null {
  try {
    // Reverse base64url -> base64
    let b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4
    if (pad) b64 += '='.repeat(4 - pad)
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json) as unknown
    const result = validatePuzzle(parsed)
    return result.ok ? result.puzzle : null
  } catch {
    return null
  }
}

/**
 * Build a shareable URL for a puzzle. Uses location.origin + location.pathname
 * so it works whether the app is at `/connections-maker/`, a custom domain,
 * or localhost during dev.
 */
export function shareUrl(puzzle: Puzzle): string {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}?p=${encodePuzzle(puzzle)}`
}

/**
 * URL path for a mode, relative to location.pathname. Used with pushState
 * so we never trigger a real navigation -- the SPA just re-renders.
 */
export function modePath(mode: 'home' | 'create' | { play: Puzzle }): string {
  const path = window.location.pathname
  if (mode === 'home') return path
  if (mode === 'create') return `${path}?create`
  return `${path}?p=${encodePuzzle(mode.play)}`
}

/**
 * Parse the current URL into a mode decision. Prefers query params
 * (`?p=...`, `?create`); falls back to the legacy hash form (`#p=...`,
 * `#create`) so links shared before the query-string switch still open.
 */
export type Mode =
  | { kind: 'home' }
  | { kind: 'create' }
  | { kind: 'play'; puzzle: Puzzle }
  | { kind: 'invalid' }

export function readMode(): Mode {
  // Preferred: query string.
  const search = window.location.search.replace(/^\?/, '')
  if (search) {
    if (search === 'create' || search.startsWith('create&') || search.startsWith('create=')) {
      return { kind: 'create' }
    }
    const params = new URLSearchParams(search)
    const p = params.get('p')
    if (p) {
      const puzzle = decodePuzzle(p)
      return puzzle ? { kind: 'play', puzzle } : { kind: 'invalid' }
    }
  }
  // Legacy fallback: hash fragment.
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return { kind: 'home' }
  if (hash === 'create') return { kind: 'create' }
  if (hash.startsWith('p=')) {
    const puzzle = decodePuzzle(hash.slice(2))
    return puzzle ? { kind: 'play', puzzle } : { kind: 'invalid' }
  }
  return { kind: 'home' }
}

/**
 * Run a puzzle URL through TinyURL's public shortener. Full puzzle URLs
 * run 500-800 chars because the puzzle data rides in the querystring, and
 * SMS refuses to auto-link anything that long (and segments a 700-char
 * message 4+ ways, breaking the link in transit). A shortened
 * `tinyurl.com/xxxxx` is ~25 chars and always auto-links.
 *
 * TinyURL's GET endpoint CORS-reflects the request origin so this works
 * from the github.io static site. Returns null on any failure so the
 * caller can fall back to the full URL.
 *
 * Trade-off: the puzzle data now also passes through TinyURL's servers
 * instead of being strictly client-to-recipient. For user-authored
 * puzzles meant to be shared, that's an acceptable delta.
 */
export async function getShortUrl(fullUrl: string): Promise<string | null> {
  try {
    const r = await fetch(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`,
    )
    if (!r.ok) return null
    const short = (await r.text()).trim()
    return short.startsWith('http') ? short : null
  } catch {
    return null
  }
}

/**
 * Clipboard helper. Falls back to a textarea hack if the Clipboard API is
 * unavailable (older iOS Safari, non-HTTPS contexts).
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
