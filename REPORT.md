# Assignment 1 report

## The defects

The "One away!" hint was firing on guesses that weren't actually close — it fired whenever two
of the four selected words shared a category, instead of only when three of them did. Selecting
a fifth tile after four were already picked wasn't blocked, so a player could end up with five
tiles highlighted and the Submit button stuck disabled. In the puzzle builder, a group's Color
dropdown showed a different color than the one actually applied to that group, and choosing
"Yellow" would visibly turn the group green instead. Separately, the hardest (purple) category's
solved banner had no text color set, so its title and words were unreadable against the purple
background while the other three difficulty banners displayed fine.

## Where the agent helped

Claude Code read through `usePuzzleState.ts`, `puzzle.ts`, and `CreatePanel.tsx` and pointed to
the exact line behind each bug instead of me tracing the render/state flow by hand, and it found
that the CSS variable the purple banner needed (`--diff-3-text`) already existed in `index.css`,
so the fix was just wiring it up rather than inventing new styling. One thing it got wrong: when
I asked how to confirm the purple banner fix, it just handed me the answer key of which words
belong to the purple group in each example puzzle, straight from the source file. It should have
asked me to play the game and describe what I actually saw on screen first, then walked me
through what to select from there, instead of skipping past my own verification.

## Why this fix belongs in this file

I'm picking the one-away fix in `puzzle.ts`. That file already owns every rule for how a guess
gets classified — `checkGuess` counts how many selected words land in each group and decides
correct/one-away/wrong. The bug was a wrong threshold inside that same counting logic (checking
for a group count of 2 instead of 3), so the fix belongs exactly where the rule already lives.
Putting the fix in `usePuzzleState.ts` or `PlayPanel.tsx` instead would have meant re-deriving
the same per-group counts a second time in a file that's supposed to just consume the result.

## The merge conflict

`filler-groups.ts` conflicted because my "Card suits" filler group and the incoming branch's
three groups ("Winter holidays," "Bathroom fixtures," "Types of fences") were both added at the
same anchor line. I kept all four groups rather than picking one side. Deleting the incoming
three to make the conflict disappear would have quietly dropped three categories other
contributors are relying on being in the shared pool; keeping only the incoming three and
dropping mine would have cost my own ticket's requirement instead.
