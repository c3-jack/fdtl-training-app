# Assignment 1 report

## The three defects and the banner-colour fix

A wrong guess that only shared two tiles with any single group was still popping up a "One
away!" toast, even when the guess wasn't close to correct — that hint is only supposed to
appear when three of the four guessed tiles genuinely belong together. Selecting a fifth tile
after four were already picked didn't stop the fifth from highlighting, and it left the Submit
button disabled instead of just ignoring the extra click. On the puzzle-builder screen, the
colour dropdown next to a group didn't show the colour actually painted on that group's strip,
and choosing "Yellow" from the list turned the strip green instead of yellow. Separately, the
purple (hardest) group's "solved" banner had no text colour set, so its title and words were
invisible against the purple background while the other three colours displayed fine.

## Where the agent helped, and what it got wrong

The agent read the four relevant files (`puzzle.ts`, `usePuzzleState.ts`, `CreatePanel.tsx`,
`SolvedGroupBanner.tsx`) and pinpointed the exact root cause in each — an off-by-one comparison,
a swapped option value, and a missing map key — producing single-line diffs instead of guessing
at symptoms. What it didn't do, and what the assignment actually calls for, is reproduce each
bug in the running app on camera before touching any file; it went straight from ticket text to
source code. That live reproduction, plus watching the fixed behaviour in the browser, still has
to happen during the recording — the agent's `npm run build` / `npm run lint` passes are not a
substitute for actually seeing it.

## Why the one-away fix belongs in `puzzle.ts`

`checkGuess` in `src/lib/puzzle.ts` is the single place that owns the game's matching rules —
correct, one-away, or wrong — independent of how the UI reacts to them. The toast itself lives in
the play panel, but the panel only decides *whether* to show it based on the status this function
returns; fixing the threshold anywhere else would mean re-deriving the same rule in a second
place. The bug was in the rule, not in the toast, so the fix belongs where the rule is defined.

## The `filler-updates` conflict

The conflict in `src/data/filler-groups.ts` was a straight two-way conflict: my own
"Sandwich condiments" group on one side, and three incoming groups — "Winter holidays,"
"Bathroom fixtures," and "Types of fences" — on the other, all added at the same anchor line.
I kept all four rather than picking a side. Discarding the incoming three to make the conflict
go away would have silently deleted three already-reviewed filler categories that other people
in the cohort are relying on being in the shared pool — a smaller diff, but a real loss of data.
