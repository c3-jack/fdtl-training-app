# Week 1 Report

## 1. The defects and the banner colour

The "One away!" message popped up when you had only two words right out of four, instead of three, so it now appears only when three of your four picks belong together. You could click a fifth word while four were already chosen, which switched the Submit button off for no visible reason, so a fifth click is now ignored. In the puzzle creator, the Color menu showed and saved the colour one step off from the one you picked (choosing Yellow gave Green), so each menu choice now saves exactly the colour it names. The solved purple group had no text colour set, unlike the other three, so its words were harder to read; it now uses the same dark text colour the other groups use.

## 2. Where the agent helped, and what it got wrong

The agent found each faulty line quickly: the `2` that should have been `3` in the one-away check, the `> 4` that should have been `>= 4` in the tile selection, and the `(d + 1) % 4` in the Color menu. It also resolved the merge, ran the build and lint after each fix, and drafted the PR text. One thing it got wrong: it first tried to make the one-away edit with a `sed` command written for Linux, which fails on macOS, so the edit did not happen until it switched to a direct file edit. It also wrote "Not verified" for the browser checks on the later fixes, which was accurate, but it means those fixes were only confirmed by reading the code, build and lint rather than by playing the game.

## 3. Why one fix belongs in its file

The fifth-tile fix belongs in `src/hooks/usePuzzleState.ts`, in `toggle`. That hook owns which tiles are selected, so the rule "at most four" belongs where selection changes. Fixing it in the button or the tile component would only hide the symptom, and the keyboard and any other caller would still be able to select a fifth tile.

## 4. The merge conflict

The `filler-updates` branch added three groups (Winter holidays, Bathroom fixtures, Types of fences) at the same spot where I added "Brass instruments", so git could not choose between them. I kept all four groups and removed only the conflict marker lines, then checked that the diff against `filler-updates` removed nothing and that the build passed. Had I resolved it by keeping only my line, the three groups from the other branch would have been silently deleted from the puzzle pool, which is lost work rather than a resolved conflict.
