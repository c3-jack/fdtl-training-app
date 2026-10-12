# Week 1 report

## 1. What was wrong

The "One away!" hint appeared when only two of the four selected tiles shared a group, because the check counted two matches instead of three. The board let you select a fifth tile, because the limit only stopped a new selection once more than four were already selected, rather than at four. On the Create screen, every option in a group's Color dropdown carried the value of the next colour along, so choosing "Yellow" saved the group as green and the dropdown never matched the strip above it. The purple group's solved banner had no text colour because purple was simply left out of the list that gives each banner its text colour.

## 2. Where the agent helped, and what it got wrong

I did this week with Claude Code, and it did most of the hands-on work: it found the handout in the cohort chat, read the code, made the four one-line fixes, ran the build and lint, handled the merge, and walked through each ticket's repro steps in Chrome with a Playwright script. My part was choosing the filler group, deciding the order of the merged groups, and checking each change before it went up. It got two specific things wrong. Its first push went out under my Nucor GitHub account instead of my C3 one and was rejected, because my machine's git login defaults to the Nucor account. And its first browser check reported five tiles selected after five clicks, which looked like the W1-2 fix had failed; the real cause was that the Submit button uses the same highlight style as a selected tile, so the script was counting Submit as a fifth tile. Counting only the word tiles showed the original four were still selected and the fifth was refused.

## 3. Why the "One away" fix belongs in `src/lib/puzzle.ts`

The fix is in `checkGuess`, the function that decides what a guess means: correct, one away, or wrong. The play screen and the state hook only react to the answer it returns, by shaking the tiles and showing the toast. Changing the threshold anywhere else, for example by hiding the toast in the play screen, would leave the rule itself wrong for anything else that calls `checkGuess`, and would put game rules into display code.

## 4. The conflict

Merging `filler-updates` conflicted at the anchor comment, because that branch added three groups (Winter holidays, Bathroom fixtures, Types of fences) on the same lines where I added "Feelings". I kept all four. I put "Feelings" first so it still sits directly under the anchor, as W1-0 asks, and kept the three incoming groups after it in their original order. If I had resolved it by keeping only my side, the pool would have silently lost three categories someone else added, and the build would still have passed, so nothing would have flagged the loss.
