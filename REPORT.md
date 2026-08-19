# Report

The game was telling players "One away!" even when they'd only matched two of the four
words in a group, so the hint was firing on guesses that weren't actually close. Selecting
tiles for a guess let a fifth tile get highlighted before the app stopped you, so you could
try to submit more than the four words a guess is supposed to have. On the puzzle-creation
page, picking a color like "Purple" from a category's dropdown didn't reliably color that
category the same way, so what you picked and what you saw didn't match. Separately, the
hardest (purple) category's "solved" banner had no text color set, so its text was
invisible against the purple background while the other three difficulty levels showed
theirs fine.

My agent found and fixed all four issues by reading the relevant code, matching each
symptom to the exact line responsible, and making a single-line change per fix rather than
restructuring anything around it. It also handled the git side end-to-end: setting up the
branch, opening the PR, and merging in a classmate's filler-updates branch. One thing it
got wrong along the way: when it first created my branch off main, it used a plain
`checkout -b`, which silently dragged my uncommitted, unrelated changes on a different
branch (W1-1) along with it onto the new branch — because uncommitted changes live in the
working directory, not on a branch, switching branches doesn't leave them behind the way
you'd expect. It had to catch that itself, stash the changes, move them back to the
original branch by hand, and start the new branch clean.

The one-away fix belongs in `src/lib/puzzle.ts` because that's where `checkGuess` lives —
the one function whose entire job is to look at four selected words and decide whether
they're correct, one-away, or wrong. It doesn't touch rendering, state, or UI at all, which
is exactly why the off-by-one (checking for 2 matches instead of 3) was a self-contained bug
fixable in one line, and why fixing it there guarantees every place that calls `checkGuess`
gets the correct behavior automatically instead of needing the same fix applied in multiple
components.

Merging in the `filler-updates` branch produced a conflict at the exact spot where I'd
added my own new filler group, because a classmate's branch added three new groups at
that same location. I resolved it by keeping both sides — my one group and their three —
rather than picking one over the other. Taking only mine would have silently dropped three
category templates (winter holidays, bathroom fixtures, types of fences) that someone else
had already written and were presumably expected to ship; taking only theirs would have
thrown away the filler group I was specifically assigned to add for this week's task.
