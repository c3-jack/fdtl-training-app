# Week 1 Report

## 1. The defects and the banner-colour fix

Guessing wrong on the puzzle sometimes told you "One away!" even when you weren't close at all, which was confusing. Trying to select a 5th tile when you already had 4 picked should have done nothing, but it let you pick it anyway and then wouldn't let you submit. When building a puzzle, choosing a color from the dropdown sometimes applied a different color than the one you picked. Separately, the banner shown when you solve the hardest (purple) category had text you could barely see, unlike the other three colors, and we added one new easy-tier category to the pool of ready-made options.

## 2. Where your agent helped, and one specific thing it got wrong

It helped me well along the way

## 3. One fix, and why it belongs in that file

I'd pick the one-away fix. The bug lived in `checkGuess`, in `src/lib/puzzle.ts`, which is the single function responsible for deciding what a submitted guess means, regardless of which screen displays the result. The toast itself is rendered in `PlayPanel.tsx`, which is where the bug was visible, but that component just displays whatever status `checkGuess` returns; it doesn't decide it. Fixing it there would have meant duplicating or second-guessing the game logic in the UI layer instead of fixing the one place that owns the actual rule.

## 4. The conflict

During the merge, I kept all four filler-group entries: my own addition, plus the three from `filler-updates`, rather than picking one side. If I'd resolved it by dropping the incoming three, the `filler-updates` branch's contributions would have been silently lost even though they'd already been merged into everyone else's branches too. If I'd dropped my own, my W1-0 work would have vanished without anyone noticing until later.