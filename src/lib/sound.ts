/**
 * Tiny Web Audio sound effects for Play mode. Synthesized with
 * oscillators (no asset files) so there's nothing to fetch or bundle.
 * Mute preference persists to localStorage.
 */

const STORAGE_KEY = 'connections-maker-sound-muted'

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    ctx = new AudioContextClass()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/**
 * Create/resume the AudioContext. Browsers only allow this within the
 * call stack of a genuine user gesture (click, keydown) -- calling it
 * from a useEffect (which fires after React re-renders, outside the
 * gesture) leaves the context suspended and sounds silently don't play.
 * Call this directly from onClick handlers so a context exists and is
 * running before any later effect tries to use it.
 */
export function primeAudio() {
  getContext()
}

export function isSoundMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setSoundMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  } catch {
    /* ignore */
  }
}

// One note: frequency (Hz), start offset (seconds from now), duration (seconds).
function tone(frequency: number, startAt: number, duration: number, volume = 0.15) {
  const audioCtx = getContext()
  if (!audioCtx) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency
  const start = audioCtx.currentTime + startAt
  const end = start + duration
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.02)
  gain.gain.linearRampToValueAtTime(0, end)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(start)
  osc.stop(end)
}

export function playCorrect() {
  if (isSoundMuted()) return
  tone(523.25, 0, 0.12) // C5
  tone(783.99, 0.1, 0.16) // G5
}

export function playGameEnd(won: boolean) {
  if (isSoundMuted()) return
  if (won) {
    tone(523.25, 0, 0.12) // C5
    tone(659.25, 0.1, 0.12) // E5
    tone(783.99, 0.2, 0.12) // G5
    tone(1046.5, 0.3, 0.25) // C6
  } else {
    tone(392, 0, 0.18) // G4
    tone(311.13, 0.15, 0.3) // Eb4
  }
}
