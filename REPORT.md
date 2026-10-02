# Assignment 1 report

**1. The defects and the banner fix.**
The "One away!" message appeared whenever a guess had two tiles from the same group, so a plain wrong guess like 2+1+1 or 2+2 got told it was close; it now appears only when three of the four tiles belong together. The game also let me select a fifth tile, which highlighted it and switched the Submit button off, because the check that caps the selection at four only kicked in after the fifth had already been added. In the puzzle creator, the Color dropdown did not match the coloured strip above each group, and choosing Yellow turned the strip green, because each dropdown option carried the number of the next colour instead of its own. Separately, the solved purple banner had no text colour and showed pale text on a purple background; it now uses the same dark text as the other three.

**2. Where the agent helped, and one thing it got wrong.**
The agent was most useful for finding where each cause lived, such as the `c === 2` check in `puzzle.ts` and the `(d + 1) % 4` option value in `CreatePanel.tsx`, and for working out why `git commit` failed (a comment line had been saved as my git email). I did the W1-1 and W1-2 edits and tests myself, and I found the `toggle` length check on my own. One thing it got wrong: it presented the four tickets out of order (W1-2 before W1-1, and W1-0 last in its plan), and I had to correct it back to W1-0 through W1-3.

**3. One fix and why it belongs in that file.**
The "One away!" fix belongs in `checkGuess` in `src/lib/puzzle.ts`, not in the hook that shows the message. `checkGuess` is the only place that decides whether a guess is correct, one away or wrong, and its own comment says one away means 3 of 4. `usePuzzleState.ts` only reacts to the answer it gets back, so changing the toast code would have hidden the symptom while leaving the wrong answer in place.

**4. The conflict.**
Merging `filler-updates` conflicted in `src/data/filler-groups.ts` because my Music genres group and the branch's three new groups were added at the same spot. I kept all four lines and removed only the conflict markers. Keeping just mine would have dropped Winter holidays, Bathroom fixtures and Types of fences, and keeping just theirs would have lost my group.