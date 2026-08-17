import type { Difficulty, Group } from '../types/puzzle'

/**
 * Colored banner that replaces a solved group's row of tiles. Shows
 * the theme title and the 4 words, using the group's difficulty color.
 */
const textColors: Partial<Record<Difficulty, string>> = {
  0: 'var(--diff-0-text)',
  1: 'var(--diff-1-text)',
  2: 'var(--diff-2-text)',
}

export function SolvedGroupBanner({ group }: { group: Group }) {
  return (
    <div
      className="rounded-lg p-3 text-center group-reveal"
      style={{
        background: `var(--diff-${group.difficulty})`,
        color: textColors[group.difficulty] ?? '',
        boxShadow: `0 8px 20px -6px color-mix(in srgb, var(--diff-${group.difficulty}) 65%, transparent)`,
      }}
    >
      <div className="font-bold uppercase tracking-wide text-sm">{group.title}</div>
      <div className="text-sm mt-0.5">{group.words.join(', ')}</div>
    </div>
  )
}
