import type { Difficulty, Group, Puzzle } from '../types/puzzle'

/**
 * Validate an unknown value as a playable Puzzle. Returns `{ ok: true, puzzle }`
 * or `{ ok: false, error }`. Used at both ends of the share pipeline:
 * - Create panel: block "Generate share link" until valid.
 * - Play panel: reject malformed/malicious hash payloads.
 */
export type ValidationResult =
  | { ok: true; puzzle: Puzzle }
  | { ok: false; error: string }

export function validatePuzzle(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, error: 'Puzzle must be an object' }
  }
  const p = input as Record<string, unknown>
  if (p.v !== 1) return { ok: false, error: `Unsupported schema version: ${String(p.v)}` }
  if (!Array.isArray(p.groups) || p.groups.length !== 4) {
    return { ok: false, error: 'Must have exactly 4 groups' }
  }

  const seenDifficulties = new Set<Difficulty>()
  const seenWords = new Set<string>()
  const groups: Group[] = []

  for (let i = 0; i < 4; i++) {
    const g = p.groups[i] as Record<string, unknown>
    if (typeof g?.title !== 'string' || !g.title.trim()) {
      return { ok: false, error: `Group ${i + 1}: title is required` }
    }
    if (!Array.isArray(g.words) || g.words.length !== 4) {
      return { ok: false, error: `Group ${i + 1}: must have exactly 4 words` }
    }
    for (let j = 0; j < 4; j++) {
      const w = g.words[j]
      if (typeof w !== 'string' || !w.trim()) {
        return { ok: false, error: `Group ${i + 1}, word ${j + 1}: cannot be empty` }
      }
      const key = w.trim().toLowerCase()
      if (seenWords.has(key)) {
        return { ok: false, error: `Duplicate word: "${w.trim()}"` }
      }
      seenWords.add(key)
    }
    const d = g.difficulty
    if (d !== 0 && d !== 1 && d !== 2 && d !== 3) {
      return { ok: false, error: `Group ${i + 1}: difficulty must be 0-3` }
    }
    if (seenDifficulties.has(d as Difficulty)) {
      return { ok: false, error: `Duplicate difficulty: each group needs a different color` }
    }
    seenDifficulties.add(d as Difficulty)

    groups.push({
      title: g.title.trim(),
      words: (g.words as string[]).map((w) => w.trim()) as [string, string, string, string],
      difficulty: d as Difficulty,
    })
  }

  const puzzle: Puzzle = {
    v: 1,
    groups: [groups[0], groups[1], groups[2], groups[3]],
  }
  if (typeof p.title === 'string' && p.title.trim()) puzzle.title = p.title.trim()
  if (typeof p.author === 'string' && p.author.trim()) puzzle.author = p.author.trim()
  return { ok: true, puzzle }
}

/**
 * Flatten the 16 words, tagged with which group they belong to.
 * Used by the play panel to present tiles and check guesses.
 */
export interface TaggedWord {
  word: string
  groupIndex: number
}

export function allWords(puzzle: Puzzle): TaggedWord[] {
  const out: TaggedWord[] = []
  puzzle.groups.forEach((g, gi) => {
    g.words.forEach((w) => out.push({ word: w, groupIndex: gi }))
  })
  return out
}

/**
 * Fisher-Yates shuffle, returns a new array.
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const a = items.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Check a 4-word guess against the puzzle. Returns:
 *  - { status: 'correct', groupIndex } if all 4 belong to the same group
 *  - { status: 'one-away' } if 3/4 belong to the same group (NYT's hint signal)
 *  - { status: 'wrong' } otherwise
 *
 * Used on Submit in the play panel.
 */
export type GuessResult =
  | { status: 'correct'; groupIndex: number }
  | { status: 'one-away' }
  | { status: 'wrong' }

export function checkGuess(guess: readonly TaggedWord[]): GuessResult {
  if (guess.length !== 4) return { status: 'wrong' }
  const counts = new Map<number, number>()
  for (const w of guess) counts.set(w.groupIndex, (counts.get(w.groupIndex) ?? 0) + 1)
  for (const [gi, c] of counts) {
    if (c === 4) return { status: 'correct', groupIndex: gi }
  }
  for (const c of counts.values()) {
    if (c === 3) return { status: 'one-away' }
  }
  return { status: 'wrong' }
}
