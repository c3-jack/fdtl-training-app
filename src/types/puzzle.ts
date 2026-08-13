/**
 * Puzzle data model.
 *
 * A Connections puzzle is 4 groups of 4 related words (16 total). The creator
 * picks every word, every group title (theme), and assigns each group one of
 * the 4 fixed difficulty colors (yellow/green/blue/purple). The colors are
 * fixed -- not user-choosable -- so the emoji result grid players copy stays
 * portable across chats.
 */

export type Difficulty = 0 | 1 | 2 | 3
// 0 = yellow (easiest), 1 = green, 2 = blue, 3 = purple (hardest)

export interface Group {
  title: string
  words: [string, string, string, string]
  difficulty: Difficulty
}

export interface Puzzle {
  v: 1
  title?: string
  author?: string
  groups: [Group, Group, Group, Group]
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  0: 'Yellow (easiest)',
  1: 'Green',
  2: 'Blue',
  3: 'Purple (hardest)',
}

export const DIFFICULTY_EMOJI: Record<Difficulty, string> = {
  0: '🟨',
  1: '🟩',
  2: '🟦',
  3: '🟪',
}
