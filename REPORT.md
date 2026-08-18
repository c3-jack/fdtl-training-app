# Assignment 1 report

## The defects and the banner fix

The game was shouting "One away!" on guesses that weren't close at all, because it
triggered the hint whenever any two of your four picks shared a category, instead of
requiring three of your four picks to match. You could also select a fifth tile with no
warning — the puzzle now stops you at four, so you have to deselect one before picking
another. Separately, the color dropdown when building a puzzle showed one color for a
group but silently applied a different one — choosing "Yellow" would turn the group
green — so the dropdown and the actual applied color now always agree. Last, the
hardest (purple) group's "solved" banner had no text color set, unlike the other three
difficulty levels, so it now uses the same pattern as the rest.

## Where the agent helped

I worked through this with Claude Code driving the terminal. It read through
`usePuzzleState.ts`, `puzzle.ts`, `CreatePanel.tsx`, and `SolvedGroupBanner.tsx` and
correctly spotted the root cause of all three defects from static reading alone before
touching a browser — the `c === 2` vs `c === 3` check, the `s.length > 4` off-by-one, and
the `(d + 1) % 4` value offset. It also wrote a small Playwright script to actually drive
the running app and confirm each fix in a real browser rather than trusting the diff. One
thing it got wrong along the way: its first attempt to check the purple banner's text
color looked for a `div` whose text content was `'NUMBERS'` (assuming the CSS
`uppercase` class changes the actual text), which never matched anything and returned
`null` — the real text content is `'Numbers'`, uppercase is a visual transform only. It
fixed the selector once the check came back empty instead of assuming the fix was broken.

## Why the one-away fix belongs in puzzle.ts

`checkGuess` in `src/lib/puzzle.ts` is the pure guess-evaluation function — it takes four
tagged words and returns correct/one-away/wrong with no React, no DOM, and no UI
concerns. The bug was in that evaluation logic itself (counting group overlaps), not in
how the result gets displayed, so the fix belongs exactly where the counting happens
rather than in the toast component that reacts to `oneAwayAt`.

## The conflict

`filler-updates` added three groups (Winter holidays, Bathroom fixtures, Types of
fences) at the same anchor line as my own new group (Sushi roll types). It was a clean
two-way conflict with no `|||||||` ancestor section. I kept all four new entries —
mine plus the three incoming — rather than picking one side. Deleting the incoming three
to make the conflict disappear would have silently thrown away three category templates
that other people (or a future puzzle creator low on filler ideas) would otherwise have
had available, with no record that they ever existed.
