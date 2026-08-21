# Assignment 1 report

## 1. The defects, plainly

- **W1-0 (banner colour):** the hardest (purple) group's "solved" banner never got a text
  colour, so its title and words could be hard to read against the purple background once
  solved — the other three difficulty colours all had one.
- **W1-1 ("One away"):** the game told you "One away!" even when your guess wasn't close —
  picking 2 words from one category plus 2 unrelated ones triggered the same hint that's
  supposed to mean "3 of these 4 are right."
- **W1-2 (fifth tile):** the game was supposed to stop you from selecting a fifth tile once
  you already had four picked, but it let the fifth one highlight anyway, which then left the
  Submit button unusable.
- **W1-3 (colour dropdown):** the dropdown for choosing a group's colour didn't line up with
  the colour actually shown — it opened already showing the wrong colour selected, and
  choosing "Yellow" from the list would turn the group green instead.

## 2. Where the agent helped

I used Claude to support me at every step: finding each bug's root cause, writing the fix,
running build/lint to verify, resolving the merge conflict, and even cleaning up my commit
history afterward.

One specific thing it got wrong: I ended up recording the exercise twice, and by the first
take I'd already had Claude add a filler group ("Playground equipment") at the W1-0 anchor.
When I recorded again for the second take, it added another one ("Shapes") without noticing
or flagging that a filler group from the earlier take was already sitting there — so the
branch ended up with two filler groups instead of one. I caught it myself by rereading the
diff against `main`, and then had Claude help me remove the extra one and rewrite the commit
history into one clean commit per ticket.

## 3. Why one fix belongs where it landed

The "One away" fix belongs in `src/lib/puzzle.ts`, inside `checkGuess`, not in the play panel
component that shows the toast. `checkGuess` is the one function responsible for deciding
what a guess *means* — correct, one-away, or wrong — and every other part of the app
(mistake counter, toast, emoji recap) just reacts to whatever status it returns. If I'd
patched the toast logic in the component instead, the underlying function would still report
"one-away" incorrectly, and anything else that ever reads that status would still be wrong.

## 4. The conflict

`filler-updates` added three filler groups at the same anchor comment where my own W1-0 group
was added, so the merge conflicted in `src/data/filler-groups.ts`. I resolved it by keeping
all four groups — mine and the three incoming ones — one per line, in the same format as the
rest of the file. Deleting the incoming groups to make the conflict go away would have thrown
away three categories someone else on the cohort had already written and expected to be in
the shared pool; keeping both sides was the only resolution that didn't destroy anyone's work.
