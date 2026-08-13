import { useEffect, useState } from 'react'
import type { Puzzle } from '../types/puzzle'
import { usePuzzleState } from '../hooks/usePuzzleState'
import { copyToClipboard, getShortUrl, shareUrl } from '../lib/share'
import { Tile } from './Tile'
import { SolvedGroupBanner } from './SolvedGroupBanner'
import { ResultsScreen } from './ResultsScreen'

export function PlayPanel({ puzzle, onBack, onCreate }: { puzzle: Puzzle; onBack: () => void; onCreate: () => void }) {
  const state = usePuzzleState(puzzle)
  // Pre-shorten on mount so the Copy Link click hands over the short URL
  // instantly. Falls back to full URL if the shortener fails / is slow.
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [shortening, setShortening] = useState(true)
  // null = idle, 'short'/'full' after copy.
  const [copyState, setCopyState] = useState<null | 'short' | 'full'>(null)

  useEffect(() => {
    let cancelled = false
    getShortUrl(shareUrl(puzzle)).then((short) => {
      if (cancelled) return
      setShortUrl(short)
      setShortening(false)
    })
    return () => {
      cancelled = true
    }
  }, [puzzle])

  async function handleCopyLink() {
    const toCopy = shortUrl ?? shareUrl(puzzle)
    const ok = await copyToClipboard(toCopy)
    if (!ok) return
    setCopyState(shortUrl ? 'short' : 'full')
    setTimeout(() => setCopyState(null), 2500)
  }

  // Keyboard shortcuts: Enter submits when 4 selected, Esc deselects.
  // Scoped to document so you can hit Enter with the grid focused or not.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'Enter' && state.selected.length === 4) {
        e.preventDefault()
        state.submit()
      } else if (e.key === 'Escape' && state.selected.length > 0) {
        e.preventDefault()
        state.clearSelected()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [state])

  if (state.status !== 'playing') {
    return (
      <ResultsScreen
        puzzle={puzzle}
        status={state.status}
        guesses={state.guesses}
        onPlayAgain={state.reset}
        onCreateOwn={onCreate}
        onHome={onBack}
      />
    )
  }

  return (
    <div className="max-w-xl mx-auto p-4 pt-16">
      <div className="flex items-center justify-between mb-2 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="text-[var(--text-dim)] hover:text-[var(--text)] text-sm"
        >
          ← Home
        </button>
        <button
          type="button"
          onClick={handleCopyLink}
          disabled={shortening}
          className="px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text)] text-xs hover:bg-[var(--color-bg-hover)] transition-colors flex items-center gap-1.5 disabled:opacity-60"
          title="Copy this puzzle's share link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          {shortening
            ? 'Shortening…'
            : copyState === 'short'
              ? 'Short link copied!'
              : copyState === 'full'
                ? 'Copied (full link)'
                : 'Copy link'}
        </button>
        <div className="text-[var(--text-dim)] text-xs">
          {state.mistakesLeft} mistake{state.mistakesLeft === 1 ? '' : 's'} left
        </div>
      </div>

      {puzzle.title && (
        <h1 className="text-xl font-bold text-[var(--text)] text-center mb-1">{puzzle.title}</h1>
      )}
      {puzzle.author && (
        <div className="text-[var(--text-dim)] text-xs text-center mb-3">by {puzzle.author}</div>
      )}

      <p className="text-[var(--text-dim)] text-center text-sm mb-4">
        Create four groups of four!
      </p>

      {/* Solved banners at top */}
      <div className="space-y-2 mb-3">
        {state.solved.map((gi) => (
          <SolvedGroupBanner key={gi} group={puzzle.groups[gi]} />
        ))}
      </div>

      {/* Unsolved tiles grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {state.unsolvedOrder.map((w) => (
          <Tile
            key={w.word}
            word={w.word}
            selected={state.selected.some((s) => s.word === w.word)}
            shakeKey={state.selected.some((s) => s.word === w.word) ? state.shakeId : 0}
            onClick={() => state.toggle(w)}
          />
        ))}
      </div>

      {/* Mistakes remaining: filled dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <span className="text-[var(--text-dim)] text-sm">Mistakes remaining:</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                i < state.mistakesLeft ? 'bg-[var(--text)]' : 'bg-[var(--border)]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={state.reshuffle}
          className="py-3 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] text-sm font-medium"
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={state.clearSelected}
          disabled={state.selected.length === 0}
          className="py-3 rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)] text-sm font-medium disabled:opacity-40"
        >
          Deselect all
        </button>
        <button
          type="button"
          onClick={state.submit}
          disabled={state.selected.length !== 4}
          className="py-3 rounded-full bg-[var(--accent)] text-[#111] text-sm font-semibold disabled:opacity-40 disabled:bg-[var(--border)] disabled:text-[var(--text-dim)]"
        >
          Submit
        </button>
      </div>

      {/* Toast -- CSS auto-dismisses; remount via key to replay on each event */}
      {state.oneAwayAt > 0 && (
        <div
          key={state.oneAwayAt}
          className="fixed top-20 left-1/2 px-4 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-medium shadow-lg toast-flash pointer-events-none"
        >
          One away!
        </div>
      )}
    </div>
  )
}
