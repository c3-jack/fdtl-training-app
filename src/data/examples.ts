import type { Puzzle } from '../types/puzzle'

/**
 * Handful of starter puzzles. The home "Play example" button picks one
 * at random so returning visitors don't see the same puzzle twice.
 *
 * Keep these genuinely good (not filler) -- the example puzzle is the
 * first impression for anyone following a share link who lands on
 * home instead of a puzzle.
 */
export const EXAMPLE_PUZZLES: Puzzle[] = [
  {
    v: 1,
    title: 'Warm-up',
    author: 'house',
    groups: [
      {
        title: 'Citrus fruits',
        words: ['LEMON', 'LIME', 'ORANGE', 'GRAPEFRUIT'],
        difficulty: 0,
      },
      {
        title: 'Types of pasta',
        words: ['PENNE', 'ZITI', 'ROTINI', 'FUSILLI'],
        difficulty: 1,
      },
      {
        title: 'Things that ring',
        words: ['PHONE', 'BELL', 'ALARM', 'DOORBELL'],
        difficulty: 2,
      },
      // Purple: each word + "STONE" is a thing.
      {
        title: '___ stone',
        words: ['MILE', 'KEY', 'BRIM', 'CORNER'],
        difficulty: 3,
      },
    ],
  },
  {
    v: 1,
    title: 'Board games night',
    author: 'house',
    groups: [
      {
        title: 'Chess pieces',
        words: ['KNIGHT', 'BISHOP', 'ROOK', 'PAWN'],
        difficulty: 0,
      },
      {
        title: 'Monopoly squares',
        words: ['BOARDWALK', 'CHANCE', 'JAIL', 'PARK PLACE'],
        difficulty: 1,
      },
      {
        title: 'Card game terms',
        words: ['TRICK', 'TRUMP', 'BID', 'MELD'],
        difficulty: 2,
      },
      // Tricky purple: things that can precede "box"
      {
        title: '___ box',
        words: ['LUNCH', 'SHADOW', 'TOOL', 'MUSIC'],
        difficulty: 3,
      },
    ],
  },
  {
    v: 1,
    title: 'Cinema',
    author: 'house',
    groups: [
      {
        title: 'Pixar movies',
        words: ['UP', 'COCO', 'CARS', 'BRAVE'],
        difficulty: 0,
      },
      {
        title: 'Horror classics',
        words: ['PSYCHO', 'JAWS', 'ALIEN', 'HALLOWEEN'],
        difficulty: 1,
      },
      {
        title: 'Director\u2019s tools',
        words: ['CAMERA', 'SCRIPT', 'SLATE', 'BOOM'],
        difficulty: 2,
      },
      // Purple: movies that are single pronouns/articles
      {
        title: 'One-word titles (pronouns)',
        words: ['HER', 'IT', 'US', 'THEM'],
        difficulty: 3,
      },
    ],
  },
]

export function pickExample(): Puzzle {
  return EXAMPLE_PUZZLES[Math.floor(Math.random() * EXAMPLE_PUZZLES.length)]
}
