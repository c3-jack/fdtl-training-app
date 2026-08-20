# Assignment 1 Report

## 1. What were the three defects?

The "One away!" hint was showing up on weak guesses — it should only appear when three of your four selected tiles belong to the same group, but it was firing when just two did. Selecting five tiles was never blocked, so picking a fifth tile after already having four selected would leave the puzzle stuck instead of just ignoring the extra click. And in the puzzle builder, the color dropdown for a group didn't match the color actually applied to it, so choosing "Yellow" could turn a group green instead.

## 2. Where did your agent help, and where did it get in the way?

The agent was fastest at narrowing down where to look: for each bug, a quick search across the relevant files pointed straight to the line and explained why the logic was wrong (a hardcoded 2 instead of 3, a `>` instead of `>=`, a color value off by one in a dropdown). Reading through unfamiliar code file by file would have taken longer. It got in the way on terminal mechanics rather than the bugs themselves — at one point it told me to edit line 42 for a fix that was actually on line 44, which silently did nothing until we caught it by checking the file afterward. It also pointed me toward the nano text editor for small edits, which slowed me down repeatedly because I didn't understand that nano's search and save prompts are separate modes with their own limited keys — once that clicked, editing moved fine, but the early confusion cost real time.

## 3. Pick one of your three fixes: why is it in the file you put it in, rather than somewhere else in the data flow?

The "One away" fix belongs in `checkGuess` in `puzzle.ts`, not in the component that displays the toast. `checkGuess` is the single place that turns a raw 4-tile selection into a result — both the play panel's toast and the hook's counter depend on whatever it returns. Fixing the symptom at the display layer would have hidden the wrong message for that one screen while leaving the underlying classification wrong for anything else that reads a guess result.

## 4. What did you decide during the conflict resolution, and what would have been lost if you had decided the other way?

I kept every filler group from both sides — my own entry and the three from `filler-updates` — rather than picking one side. Since the filler pool is shared across the whole cohort, resolving it any other way (taking only my side, or accepting an automatic "theirs"/"ours" resolution) would have deleted either my required entry or categories other people are relying on. Either way it would have been data loss, not an actual resolution.
