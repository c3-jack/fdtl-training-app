# Assignment 1 write-up

## 1. What were the three defects, in one sentence each a non-engineer would follow?

- The "One away!" hint was popping up on guesses that weren't actually close — two tiles from one group plus two unrelated tiles triggered it, when it's supposed to mean three of your four picks share a group.
- The board let you select a fifth tile even though a guess is only ever four, so Submit would just go gray with no explanation instead of ignoring the extra click.
- The color dropdown for a puzzle group could show a different color than the one actually applied to that group's strip, so picking "Yellow" could visibly turn the strip green instead.

## 2. Where did your agent help, and where did it get in the way? Name one specific thing it got wrong.

I worked through this with Claude Code. Where it helped: for each of the four tickets it went straight to the one file and the one line actually responsible instead of guessing from the symptom in the ticket text — the "one away" bug, the fifth-tile bug, and the color-dropdown bug were each a single-character or single-line fix once it traced the logic, and for the purple banner it noticed on its own that the CSS variable for purple's text color already existed in `index.css` and just wasn't referenced, which kept that fix to one line instead of touching the stylesheet too.

Where it got in the way: when it put together the script I used to plan my recording, it told me to "solve the purple group" in the demo puzzle without giving me any way to know which four tiles were actually purple — the app doesn't label a tile's group before you guess it, so that instruction was useless on its own. I had to ask "how do I know it's the purple group?" before it went back and built a fixed, non-random test puzzle where every word's group was known in advance. It was a good fix once I pushed on it, but the first version assumed I could see something the app doesn't actually show, and I only caught it because I tried to follow the instruction literally.

## 3. Pick one of your three fixes: why is it in the file you put it in, rather than somewhere else in the data flow?

The one-away fix belongs in `checkGuess()` in `src/lib/puzzle.ts`, not in `usePuzzleState.ts` or `PlayPanel.tsx`. `checkGuess` is the single place that turns a raw guess into a verdict — correct, one-away, or wrong — and everything downstream just acts on whatever verdict it hands back: the hook records it, the panel renders the toast. If I'd patched this anywhere downstream, like suppressing the toast in the panel when it looked wrong, the actual miscount would still be sitting in `checkGuess`, ready to produce a wrong verdict for any other caller that ever checks a guess.

## 4. What did you decide during the conflict resolution, and what would have been lost if you had decided the other way?

The conflict in `src/data/filler-groups.ts` was a clean two-way conflict — no common-ancestor section, just my one added filler group and the three `filler-updates` added, both landing at the same anchor comment. I kept all four entries, mine first and then the three from `filler-updates`, in the order each side had them. Taking `--ours` would have quietly deleted the three categories `filler-updates` added for the entire cohort's puzzles to draw from — data loss dressed up as a resolved conflict. Taking `--theirs` would have dropped my own required contribution instead. Keeping both was the only version of this that didn't lose something somebody was graded on.
