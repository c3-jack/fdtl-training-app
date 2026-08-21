# Assignment 1 report

## 1. The three defects and the banner-colour fix

     - W1-1 Even if a user selects blocks that are of multiple categories, the application incorrectly prompts that the user is "one away", even though they are not
     - W1-2 The application allows the user to select 5 blocks at a time before submitting, which goes against the purpose of the game of finding 4 blocks in a category
     - W1-3 When building the puzzle and selecting the colour/difficulty, the proper colours are not applied to the difficulty correctly (e.g. difficult/purple shows up as yellow in the game and in the build puzzle screen)
     - W1-0 When the purple group is solved in the game, the text of the blocks is difficult to read and needs to have its colour changed to higher contrast

## 2. Where your agent helped, and one specific thing it got wrong

During the merge, Claude told me run a git command (git commit), which I innacurately put in. It then corrected itself to use git commit -m to avoid opening an interactive text editor that would not have worked as well.

## 3. Pick one fix: why does it belong in that file?

For W1-1, the fix should belong in puzzle.ts where checkGuess() is saved. This is the function that interprets the submission and evaluates whether it is correct. The defect was being caused by the fact that the "One Away" message was rendered in the play panel, where the checkGuess function was not properly feeding it the correct result.

## 4. What you decided during the conflict, and what would've been lost the other way

The filler-groups.ts issue was caused by an existing filler group and incoming ones at the same line. This was resolved by deleting the conflict markers and keeping the entries on their own lines. Deleting the lines themselves would have erased the others contributions.
