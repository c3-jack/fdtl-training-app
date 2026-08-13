import type { Puzzle } from '../types/puzzle'

/**
 * Draft persistence for the Create panel. Saves the in-progress puzzle
 * (shape loose: strings + nullable difficulty) to localStorage so closing
 * the tab mid-creation doesn't lose work. Not the same as saved *finished*
 * puzzles -- the share link is the canonical way to save a finished puzzle.
 *
 * The Draft shape has to stay in sync with CreatePanel's internal Draft.
 * We persist the raw form state, not a validated Puzzle, so we can restore
 * partial/invalid state (the whole point of a draft).
 */

export interface StoredDraft {
  id: string
  savedAt: number
  title: string
  author: string
  // Parallel arrays, length 4: group title, words[4], difficulty (0-3 or null)
  groups: Array<{
    title: string
    words: string[]
    difficulty: number | null
  }>
}

const STORAGE_KEY = 'connections-maker-drafts'
const MAX_DRAFTS = 10

export function loadDrafts(): StoredDraft[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Light validation -- drop anything malformed rather than crashing the panel.
    return parsed.filter(
      (d: unknown): d is StoredDraft =>
        typeof d === 'object' &&
        d !== null &&
        typeof (d as StoredDraft).id === 'string' &&
        Array.isArray((d as StoredDraft).groups),
    )
  } catch {
    return []
  }
}

export function saveDraft(draft: StoredDraft) {
  try {
    const drafts = loadDrafts().filter((d) => d.id !== draft.id)
    drafts.unshift(draft)
    const trimmed = drafts.slice(0, MAX_DRAFTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    /* quota exceeded or disabled -- silent */
  }
}

export function deleteDraft(id: string) {
  try {
    const drafts = loadDrafts().filter((d) => d.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
  } catch {
    /* ignore */
  }
}

export function newDraftId(): string {
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Puzzle export/import. Shape:
 *   { name: "my-ruleset", createdAt: 2026..., puzzles: [Puzzle, ...] }
 * Single-puzzle format also accepted on import (a bare Puzzle object).
 * Matches the clocktower custom-ruleset JSON convention.
 */

export interface PuzzleBundle {
  name?: string
  createdAt?: number
  puzzles: Puzzle[]
}

export function exportSinglePuzzle(puzzle: Puzzle, name?: string): string {
  const bundle: PuzzleBundle = {
    name: name || puzzle.title || 'connections-puzzle',
    createdAt: Date.now(),
    puzzles: [puzzle],
  }
  return JSON.stringify(bundle, null, 2)
}

export function downloadJson(json: string, filename: string) {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.json') ? filename : `${filename}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Parse a JSON string into one or more puzzles. Accepts either a
 * {puzzles: [...]} bundle or a bare Puzzle object. Validation of the
 * puzzle contents happens in the caller (uses validatePuzzle from
 * lib/puzzle.ts).
 */
export function parseImport(text: string): unknown[] {
  const parsed = JSON.parse(text) as unknown
  if (Array.isArray(parsed)) return parsed
  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>
    if (Array.isArray(obj.puzzles)) return obj.puzzles
    // Bare Puzzle
    return [parsed]
  }
  throw new Error('Not a puzzle or puzzle bundle')
}
