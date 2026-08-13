import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { Puzzle } from '../types/puzzle'
import { DIFFICULTY_EMOJI } from '../types/puzzle'
import { copyToClipboard, shareUrl } from '../lib/share'

/**
 * Win/lose screen. Builds the NYT-style emoji recap from the guess
 * history -- each row is one guess, colored by which group each
 * chosen tile belonged to. Players copy this into group chats
 * without revealing any of the actual words.
 *
 * Example for a win with 1 mistake:
 *   Connections by jack (1 mistake)
 *   🟨🟨🟩🟨   <- one wrong
 *   🟨🟨🟨🟨
 *   🟩🟩🟩🟩
 *   🟦🟦🟦🟦
 *   🟪🟪🟪🟪
 *   Play: https://.../#p=...
 */
export function ResultsScreen({
  puzzle,
  status,
  guesses,
  onPlayAgain,
  onCreateOwn,
  onHome,
}: {
  puzzle: Puzzle
  status: 'won' | 'lost'
  guesses: number[][]
  onPlayAgain: () => void
  onCreateOwn: () => void
  onHome: () => void
}) {
  const [copied, setCopied] = useState(false)
  const mistakes = guesses.filter((g) => !isCorrect(g)).length
  const recap = buildRecap(puzzle, status, guesses)

  // Fire confetti on mount for a win. Two bursts at canvas edges so
  // the particles cross-cross the screen rather than piling up center.
  useEffect(() => {
    if (status !== 'won') return
    const end = Date.now() + 600
    const burst = () => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'],
      })
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f9df6d', '#a0c35a', '#b0c4ef', '#ba81c5'],
      })
      if (Date.now() < end) requestAnimationFrame(burst)
    }
    burst()
  }, [status])

  async function handleCopy() {
    const ok = await copyToClipboard(recap)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <div className="text-5xl mb-3">{status === 'won' ? '🎉' : '💀'}</div>
      <h1 className="text-2xl font-bold text-[var(--text)] mb-1">
        {status === 'won' ? 'Solved!' : 'Out of tries'}
      </h1>
      <p className="text-[var(--text-dim)] mb-4 text-sm">
        {status === 'won'
          ? mistakes === 0
            ? 'Clean sweep — no mistakes.'
            : `${mistakes} mistake${mistakes === 1 ? '' : 's'}.`
          : 'Better luck next time.'}
      </p>

      {/* Show all groups at the end, win or lose */}
      <div className="space-y-2 mb-6">
        {puzzle.groups.map((g, gi) => (
          <div
            key={gi}
            className="rounded-lg p-3"
            style={{
              background: `var(--diff-${g.difficulty})`,
              color: `var(--diff-${g.difficulty}-text)`,
            }}
          >
            <div className="font-bold uppercase tracking-wide text-sm">{g.title}</div>
            <div className="text-sm mt-0.5">{g.words.join(', ')}</div>
          </div>
        ))}
      </div>

      <pre className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 text-left text-sm font-mono text-[var(--text)] whitespace-pre-wrap mb-3 overflow-x-auto">
        {recap}
      </pre>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-3 rounded-lg bg-[var(--accent)] text-[#111] font-semibold hover:brightness-110"
        >
          {copied ? 'Copied!' : 'Copy result'}
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="w-full py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)]"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onCreateOwn}
          className="w-full py-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--color-bg-hover)]"
        >
          Create your own
        </button>
        <button
          type="button"
          onClick={onHome}
          className="w-full py-2 text-[var(--text-dim)] text-sm"
        >
          Home
        </button>
      </div>
    </div>
  )
}

function isCorrect(guess: number[]): boolean {
  return guess.every((g) => g === guess[0])
}

function buildRecap(puzzle: Puzzle, status: 'won' | 'lost', guesses: number[][]): string {
  const rows = guesses.map((g) => g.map((gi) => DIFFICULTY_EMOJI[puzzle.groups[gi].difficulty]).join(''))
  const header = [
    puzzle.title ? `Connections: ${puzzle.title}` : 'Connections Maker',
    puzzle.author ? `by ${puzzle.author}` : null,
    status === 'won' ? solvedSummary(guesses) : 'Missed it',
  ]
    .filter(Boolean)
    .join(' — ')
  const link = shareUrl(puzzle)
  return `${header}\n\n${rows.join('\n')}\n\nPlay: ${link}`
}

function solvedSummary(guesses: number[][]): string {
  const mistakes = guesses.filter((g) => !isCorrect(g)).length
  if (mistakes === 0) return 'Clean sweep'
  return `Solved with ${mistakes} mistake${mistakes === 1 ? '' : 's'}`
}
