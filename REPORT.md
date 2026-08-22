# REPORT

## 1. The defects and fixes

W1-1 ("One away" false positive): The `checkGuess` function in `puzzle.ts` fired the one-away signal when any group had 2 of the 4 selected words instead of 3; changing the threshold from 2 to 3 makes it trigger only on a genuine 3-of-4 near-miss. W1-2 (fifth tile selectable): The `toggle` function in `usePuzzleState.ts` used a strict greater-than check (`> 4`) that let a fifth selection through when exactly four were already highlighted; switching to `>= 4` blocks the fifth click. W1-3 (color dropdown mismatch): Each dropdown option in `CreatePanel.tsx` wrote `(d + 1) % 4` as its value instead of `d`, shifting every color assignment by one so "Yellow" actually stored green; removing the arithmetic so the option value equals the difficulty constant fixes the mapping. For the purple banner (W1-0), the `textColors` map in `SolvedGroupBanner.tsx` had entries for difficulties 0-2 but not 3, so purple groups had no text color on the solved banner; adding the existing `--diff-3-text` CSS variable as the entry for difficulty 3 gives purple the same readable text treatment as the other three.

## 2. Agent help and one thing it got wrong

[FILL IN: Describe where you used Claude/Cursor to help — e.g. searching for the bug, generating the fix, explaining code. Then describe one specific thing the agent told you that was wrong or unhelpful and how you corrected course.]

## 3. Why the fix belongs in that file

[PICK ONE FIX — e.g. W1-1]: The `checkGuess` function in `puzzle.ts` is the single source of truth for evaluating a player's guess against the puzzle. The one-away logic lives there because it's a property of the guess result, not the UI — the play panel just reads the result and shows a toast. Fixing the threshold in this function means every caller gets the correct behavior without any UI changes.

## 4. The conflict and what would have been lost

The `filler-updates` branch added three new filler groups at the same anchor comment where I added mine. I resolved by keeping all four entries — mine above the incoming three (or vice versa, order doesn't matter within the array). If I had accepted only my changes, the three groups from `filler-updates` would be lost — data authored by someone else, deleted silently. If I had accepted only theirs, my own filler group would disappear and W1-0 would be incomplete.
