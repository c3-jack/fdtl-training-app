# Assignment 1 report

## The bugs, plainly

"One away" was firing after only two tiles from the same group matched, not
three, so a guess that wasn't close still got a hint it hadn't earned.
Selecting a fifth tile wasn't blocked, so you could pile a fifth on top of
four already-chosen ones instead of the fifth click doing nothing. The color
menu on the puzzle-builder screen showed the wrong color name for what was
actually applied to a group — picking "Yellow" could turn the group green.
And separately, a solved purple group's banner had no text color set at all,
unlike the other three colors.

## Where the agent helped, and what it got wrong

I used Claude Code to find each bug's actual cause rather than guessing from
where it showed up, and it ran `npm run build` and `npm run lint` after every
change so a break would surface immediately instead of at the end. It also
went and found the individual GitHub issues and cross-referenced them against
the handout so I wasn't fixing the wrong distinction. The mistake it made:
it opened toward the pull request without ever merging `filler-updates`,
skipping the mandatory conflict step in `CONTRIBUTING.md` entirely — it only
caught this because it re-read that file on its own right before pushing, not
because it had planned for the merge from the start.

## Why one fix belongs where it does

Take the "one away" fix, in `src/lib/puzzle.ts`. That file's `checkGuess`
function is the one place a submitted guess gets tallied against group
indices and turned into correct/one-away/wrong — it's the single source of
truth the rest of the app reads from. Fixing the threshold anywhere else,
like suppressing the toast in the component that displays it, would have
hidden the wrong signal on screen without fixing the actual miscount, and any
other code that calls `checkGuess` later would still get the wrong answer.

## The conflict

Merging `filler-updates` conflicted exactly where the ticket said it would:
at the anchor comment in `filler-groups.ts`, because both branches added
entries in the same spot. I kept my own filler group and all three from
`filler-updates`, in the order Git presented them, rather than choosing one
side. Dropping either side would have thrown away a valid category someone
already wrote — mine or theirs — for no reason other than convenience, and
the assignment is explicit that deleting the incoming groups to make the
conflict disappear counts as destroying data, not resolving anything.
