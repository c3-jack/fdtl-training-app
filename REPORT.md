# Assignment 1 report

## 1. The three defects, in one sentence each

- **W1-1 — "One away!" on weak guesses.** The game cheered "One away!" whenever two of your four
  tiles happened to belong to the same group, so a scattered guess got the same encouragement as a
  near-miss; it should only say that when three of the four really belong together.
- **W1-2 — a fifth tile could be selected.** A guess is supposed to be four tiles, but the board
  let you highlight a fifth, which then quietly disabled the Submit button with no explanation
  instead of simply refusing the fifth click.
- **W1-3 — the Color dropdown lied about the color.** In Create mode each group's color menu was
  off by one, so an untouched first group showed "Purple" over a yellow strip, and choosing
  "Yellow" actually turned the group green.

## 2. Where the agent helped, and where it got in the way

The agent was fastest at the part I expected to be slowest: given only the symptom from each
ticket, it traced W1-1 to `checkGuess` in `src/lib/puzzle.ts` and W1-2 to the `toggle` guard in
`usePuzzleState.ts` and pointed at the exact wrong number in each, which saved me reading the whole
state hook. Where it got in the way was overconfidence on the small stuff: the first filler-group
title it proposed for W1-0, "Chess pieces," was already in the pool — it hadn't checked — and it
only caught the collision after I had it grep the file, at which point it also flagged that "Knight"
and "Rook" already appeared elsewhere. I replaced it with "Chili peppers" and re-checked every word.
The lesson I took is that the agent is reliable about the line of code and careless about the
surrounding facts, so the checking is still mine to do.

## 3. Why the W1-3 fix is where it is

The wrong color came from the dropdown emitting `value={(d + 1) % 4}` while labeling the option with
`d`, so the difficulty written into the group was one band off. I fixed it there, at the `<option>`,
rather than at the colored strip or the solved banner. Both of those read `var(--diff-${difficulty})`
and were rendering faithfully — the difficulty they were handed was simply wrong. Patching the strip
to "look right" would have left the same bad difficulty flowing into the puzzle and its share URL,
so the color you built would still not be the color someone else opened. The dropdown is the point
where the value is chosen, so it is the point where the value has to be correct.

## 4. The conflict resolution

`filler-updates` adds three yellow groups at the same anchor comment where mine goes, so the merge
conflicted on exactly those lines in `filler-groups.ts`. I kept both sides: my "Chili peppers" group
and its three — "Winter holidays," "Bathroom fixtures," "Types of fences" — and deleted the markers,
leaving every other entry untouched. Had I taken my side wholesale to make the error stop, the three
incoming groups would have been silently dropped; that is data loss, not a resolution, and the next
person to add a filler group would have merged against a file that had quietly lost three of them.
`npm run build` confirmed no markers were left behind.
