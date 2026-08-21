# Report

## 1. What were the three defects, in one sentence each a non-engineer would follow?

The "one away" hint was firing on guesses that weren't close, because it only needed two of
four words to share a category instead of three. A player could select a fifth word tile even
though a guess is only ever four words, leaving Submit greyed out with no explanation. And in
puzzle creation, the colour picked from a group's dropdown often wasn't the colour actually
applied to that group.

## 2. Where did your agent help, and where did it get in the way? Name one specific thing it got wrong.

The agent helped quickly find the root cause and point to the exact line for each defect —
each bug turned out to be a single misplaced constant, and grep found it fast. Where it fell
short: it did not consistently follow the reproduce → fix → verify → build/lint workflow as a
disciplined sequence per ticket; it treated verification as a formality after the fix rather
than confirming the bug first. It also tried to push a PR after small individual tickets
instead of aggregating all four tickets into one PR first, which only got corrected because I
held off committing/pushing until asked.

## 3. Pick one of your three fixes: why is it in the file you put it in, rather than somewhere else in the data flow?

The "one away" fix lives in `checkGuess`, in `src/lib/puzzle.ts`, not in the hook or component
that use it. `checkGuess` is a pure function — it classifies a guess against the puzzle's
groups with no dependency on component state or timing. `src/lib` is this codebase's boundary
for that kind of logic, separate from `src/hooks` (state) and `src/components` (rendering).
Putting the rule anywhere else would split the definition of "one away" across files instead
of keeping it in the one function whose docstring already stated the correct rule.

## 4. What did you decide during the conflict resolution, and what would have been lost if you had decided the other way?

The conflict was between my one filler group and three from `filler-updates`, both added at
the same anchor comment. I kept all four rather than picking one side. Taking only mine would
have deleted three categories another contributor already pushed to a shared file everyone in
the cohort reads from. Taking only theirs would have dropped the one group the ticket required
from me personally. Keeping both was the only option that met the ticket's criteria without
erasing someone else's already-merged work.
