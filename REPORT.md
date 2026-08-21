# Report

## The defects

Solving the hardest (purple) category left its answer banner with invisible
text; now the words are readable there just like they are for the other
three colors. Guessing two right words from one category plus one each from
two other categories used to wrongly say "One away!"; now that message only
shows up when you're truly one word off from a full match. You used to be
able to select a fifth tile even though a guess only allows four, which then
made the Submit button turn off; now a fifth click just does nothing until
you deselect one of your four. Picking a color for a category in the puzzle
builder used to apply a different color than the one you clicked; now the
color you pick is the color that actually gets used.

## Where the agent helped

Claude traced each of the four tickets to the exact line causing it and
explained the mechanism in plain terms before touching anything, then
applied a single-line fix for each rather than anything broader. It also
caught things I wouldn't have on my own, like unconfigured git identity, and
walked me through the filler-updates merge conflict rather than resolving it
invisibly. One place it was flatly wrong: it assumed my branch already had
an upstream tracking branch on origin, so a plain `git push` would just
work. The first real push failed because week1/c3-terrance had never been
published before; it corrected course immediately once the error came back,
but the initial assumption was wrong.

## Why one fix belongs in its file

The W1-1 fix (`c === 2` to `c === 3` in `checkGuess`) belongs in
`lib/puzzle.ts` because that's where all guess-evaluation logic already
lives, correct match, one-away, wrong. The comparison that decides which of
those three a guess gets is part of that same evaluation, not something the
UI layer should be deciding on its own.

## The conflict

I kept both my own filler group and the three groups that came in from
filler-updates, deleting only the conflict markers themselves, per
CONTRIBUTING's "keep both sides" instruction. Deleting the incoming three
groups instead to make the conflict disappear would have silently erased
three other people's contributed filler categories, which the assignment
explicitly calls out as an automatic zero.
