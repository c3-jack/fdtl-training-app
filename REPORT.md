# REPORT

## 1. The defects

Banner-colour fix - The purple (hardest) group's "solved" banner showed its title and words with no text
colour, unlike the other three groups, so it was much harder to read once solved.
Defect #1 - Guessing two correct words plus two wrong ones from different groups incorrectly showed
a "One away!" hint, when that hint should only appear if three of the four guessed words
belong to the same group. 
Defect#2 - After selecting four tiles, clicking a fifth, unselected tile
let it get highlighted too instead of being ignored, silently breaking the Submit button.
Defect#3 - Picking "Yellow (easiest)" from a puzzle group's colour menu actually assigned the group
a different colour (green), so the menu did not do what it said.

## 2. Where the agent helped

The agent located each bug from the ticket text alone, fixed it in the correct file, and
verified every fix by running `npm run build` and, for the two easiest-to-miss bugs
(the filler pick and the "one away" threshold), by simulating thousands of runs of the
underlying function to confirm the fix actually changes behaviour at the stated
frequency, rather than trusting the diff alone. One thing it got wrong: for the W1-0
filler-group ticket, its first attempt added a new entry titled "Sandwich breads" without
checking the existing pool, and that title was already used by an existing entry — a
duplicate that CONTRIBUTING.md explicitly says not to add. I caught this by testing the
dice roll on both the before and after versions of the app and noticing the same title
appeared on both, and the agent replaced it with a genuinely unique entry ("Salad
dressings") afterward.

## 3. Why this fix belongs in this file

The W1-3 fix (the colour dropdown assigning the wrong difficulty) belongs in
`CreatePanel.tsx` because that is the only file that builds the dropdown's list of
options and wires each one to a difficulty value — the bug was a wrong `value={(d + 1) %
4}` on the `<option>` element itself, not a problem with how difficulty is stored or
used elsewhere. `types/puzzle.ts` defines what a difficulty is, and `usePuzzleState.ts`
only cares about difficulty once a puzzle is already built, so neither of those files
contains, or should contain, the mapping between a dropdown label and the value it
submits. Since the broken mapping existed in exactly one place, the fix belongs in that
same place rather than being worked around somewhere downstream.

## 4. The merge conflict

Nothing was deleted. When I merged in `filler-updates`, Git stopped at
`src/data/filler-groups.ts` and showed two versions of the same spot in the file: my one
new line ("Salad dressings") between `<<<<<<< HEAD` and `=======`, and their three new
lines ("Winter holidays", "Bathroom fixtures", "Types of fences") between `=======` and
`>>>>>>> origin/filler-updates`. Git can't tell on its own that both additions are meant
to coexist, so it just shows both and lets a person decide. I kept all four lines and
only deleted the marker lines themselves (`<<<<<<<`, `=======`, `>>>>>>>`), since
CONTRIBUTING.md said to keep both sides rather than pick one. If I had kept only my side,
my classmates' three filler groups would have vanished from the pool; if I had kept only
their side, my own required W1-0 addition would have vanished instead. Keeping both was
the only option that lost nothing.
