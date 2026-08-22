# Assignment 1 Report

## 1. What were the three defects, in one sentence each a non-engineer would follow?
- In the puzzle creator, the category's top color border did not match the corresponding text of the dropdown.
- "One away!" hint triggered even if only 2 of the 4 tiles matched.
- Gameplay allowed selecting 5 tiles and quietly disabling the Submit button.

## 2. Where did your agent help, and where did it get in the way? Name one specific thing it got wrong.
The agent quickly pinpointed the line responsible for each defect. Each diff was only one line so it was easy to verify the fixes recommended. In my original (off-camera) attempt the agent resolved all defects in one git stage/commit rather than following natural-stopping paint best-practices that will be ideal when tackling more complex defects.

## 3. Pick one of your three fixes: why is it in the file you put it in, rather than somewhere else in the data flow?
The "One away!" fix belongs in `src/lib/puzzle.ts`, inside `checkGuess` since that's the file that counts how many of the 4 selected tiles share a `groupIndex` and turns that count into a `correct`, `one-away`, or `wrong`. `usePuzzleState.ts` consumes the outcome of `checkGuess` and `PlayPanel.tsx` renders the `oneAwayAt` flag it's provided.


## 4. What did you decide during the conflict resolution, and what would have been lost if you had decided the other way?
During `git status` a merge with `origin/filler-updates` was already in progress with three new filler categories ("Winter holidays," "Bathroom fixtures," "Types of fences") and my branch had added a fourth ("IT Peripherals") to the same list. I checked the file, confirmed all four entries were already present, removed the markers, and merged the additions. If I had instead aborted the merge the three fillers could have been discarded 
